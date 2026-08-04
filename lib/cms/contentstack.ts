export type ContentstackRegion = "us" | "eu" | "azure-na" | "azure-eu" | "gcp-na" | "gcp-eu" | "au";

export type ContentstackEntry<TFields extends Record<string, unknown> = Record<string, unknown>> =
  TFields & {
    uid: string;
    title?: string;
    url?: string;
    created_at?: string;
    updated_at?: string;
  };

type ContentstackListResponse<TFields extends Record<string, unknown>> = {
  entries?: Array<ContentstackEntry<TFields>>;
};

const CDN_HOST_BY_REGION: Record<ContentstackRegion, string> = {
  us: "cdn.contentstack.io",
  eu: "eu-cdn.contentstack.com",
  "azure-na": "azure-na-cdn.contentstack.com",
  "azure-eu": "azure-eu-cdn.contentstack.com",
  "gcp-na": "gcp-na-cdn.contentstack.com",
  "gcp-eu": "gcp-eu-cdn.contentstack.com",
  au: "au-cdn.contentstack.com",
};

function getContentstackConfig() {
  const apiKey = process.env.CONTENTSTACK_API_KEY;
  const deliveryToken = process.env.CONTENTSTACK_DELIVERY_TOKEN;
  const environment = process.env.CONTENTSTACK_ENVIRONMENT;
  const region = (process.env.CONTENTSTACK_REGION || "us") as ContentstackRegion;

  if (!apiKey || !deliveryToken || !environment) {
    throw new Error(
      "Missing Contentstack configuration. Set CONTENTSTACK_API_KEY, CONTENTSTACK_DELIVERY_TOKEN, and CONTENTSTACK_ENVIRONMENT in .env.local.",
    );
  }

  return {
    apiKey,
    deliveryToken,
    environment,
    host: CDN_HOST_BY_REGION[region] || CDN_HOST_BY_REGION.us,
    locale: process.env.CONTENTSTACK_DEFAULT_LOCALE || "en-us",
  };
}

export async function getContentstackEntries<TFields extends Record<string, unknown>>(
  contentTypeUid: string,
  query?: Record<string, string>,
) {
  const config = getContentstackConfig();
  const url = new URL(`https://${config.host}/v3/content_types/${contentTypeUid}/entries`);

  url.searchParams.set("environment", config.environment);
  url.searchParams.set("locale", config.locale);

  for (const [key, value] of Object.entries(query || {})) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url, {
    headers: {
      api_key: config.apiKey,
      access_token: config.deliveryToken,
    },
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`Contentstack request failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as ContentstackListResponse<TFields>;

  return payload.entries || [];
}

export async function getContentstackEntry<TFields extends Record<string, unknown>>(
  contentTypeUid: string,
  entryUid: string,
) {
  const entries = await getContentstackEntries<TFields>(contentTypeUid, {
    query: JSON.stringify({ uid: entryUid }),
  });

  return entries[0] || null;
}
