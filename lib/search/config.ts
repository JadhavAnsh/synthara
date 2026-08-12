export const DEFAULT_SEARCH_TIMEOUT_MS = 10_000;
export const DEFAULT_RESULT_LIMIT = 10;
export const SEARCH_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
export const MAX_SNIPPET_LENGTH = 500;
export const MAX_SEARCH_JOB_ATTEMPTS = 3;

export function getTavilyApiKey() {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    throw new Error("Missing TAVILY_API_KEY. Add it to .env.local.");
  }
  return apiKey;
}

export function getGithubToken() {
  return process.env.GITHUB_TOKEN || "";
}

export function getCrossrefMailto() {
  return process.env.CROSSREF_MAILTO || "contact@synthara.app";
}
