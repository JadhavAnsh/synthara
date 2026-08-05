const LOCAL_FALLBACK =
  process.env.BETTER_AUTH_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  "http://localhost:3000";

const DEFAULT_ALLOWED_HOSTS = [
  "localhost",
  "localhost:3000",
  "127.0.0.1",
  "127.0.0.1:3000",
  "*.contentstackapps.com",
  "*.eu-contentstackapps.com",
];

function parseAllowedHost(url: string) {
  try {
    return new URL(url).host;
  } catch {
    return null;
  }
}

export function getAuthBaseUrl() {
  const extraHosts =
    process.env.BETTER_AUTH_ALLOWED_HOSTS?.split(",")
      .map((host) => host.trim())
      .filter(Boolean) ?? [];

  const configuredHosts = [process.env.BETTER_AUTH_URL, process.env.NEXT_PUBLIC_APP_URL]
    .map((value) => (value ? parseAllowedHost(value) : null))
    .filter((value): value is string => Boolean(value));

  return {
    allowedHosts: [...new Set([...DEFAULT_ALLOWED_HOSTS, ...configuredHosts, ...extraHosts])],
    protocol: "auto" as const,
    fallback: LOCAL_FALLBACK,
  };
}
