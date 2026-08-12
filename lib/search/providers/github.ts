import { DEFAULT_RESULT_LIMIT, getGithubToken } from "@/lib/search/config";
import { SearchProviderError, SearchRateLimitError } from "@/lib/search/errors";
import type { NormalizedSource, SearchOptions, SearchProvider } from "@/lib/search/types";

type GithubRepository = {
  full_name?: string;
  html_url?: string;
  description?: string;
  stargazers_count?: number;
  language?: string;
  updated_at?: string;
  owner?: {
    login?: string;
  };
};

type GithubSearchResponse = {
  total_count?: number;
  items?: GithubRepository[];
  message?: string;
  documentation_url?: string;
};

function isRateLimited(response: Response) {
  if (response.status === 429) {
    return true;
  }

  if (response.status !== 403) {
    return false;
  }

  const remaining = response.headers.get("X-RateLimit-Remaining");
  const reset = response.headers.get("X-RateLimit-Reset");

  return remaining === "0" || Boolean(reset);
}

export const githubProvider: SearchProvider = {
  channel: "github",

  async search(query: string, options?: SearchOptions): Promise<NormalizedSource[]> {
    const limit = options?.limit ?? DEFAULT_RESULT_LIMIT;
    const token = getGithubToken();
    const endpoint = new URL("https://api.github.com/search/repositories");
    endpoint.searchParams.set("q", query);
    endpoint.searchParams.set("sort", "stars");
    endpoint.searchParams.set("order", "desc");
    endpoint.searchParams.set("per_page", String(limit));

    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "Synthara-Research-App",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    let response: Response;

    try {
      response = await fetch(endpoint, {
        headers,
        signal: options?.signal,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw error;
      }

      throw new SearchProviderError("Unable to reach GitHub. Check your network connection.");
    }

    let payload: GithubSearchResponse;

    try {
      payload = (await response.json()) as GithubSearchResponse;
    } catch {
      throw new SearchProviderError("GitHub returned an invalid response.");
    }

    if (isRateLimited(response)) {
      const resetAt = response.headers.get("X-RateLimit-Reset");
      const resetMessage = resetAt
        ? ` Try again after ${new Date(Number(resetAt) * 1000).toLocaleTimeString()}.`
        : "";
      throw new SearchRateLimitError(`GitHub rate limit reached.${resetMessage}`);
    }

    if (!response.ok) {
      throw new SearchProviderError(payload.message || "GitHub search failed.");
    }

    return (payload.items ?? [])
      .filter((repo) => repo.full_name && repo.html_url)
      .map((repo, index) => ({
        title: repo.full_name!,
        authors: repo.owner?.login ? [repo.owner.login] : [],
        url: repo.html_url!,
        sourceType: "github" as const,
        snippets: repo.description ? [repo.description] : [],
        credibilitySignals: {
          provider: "github",
          stars: repo.stargazers_count ?? null,
          language: repo.language ?? null,
          updatedAt: repo.updated_at ?? null,
        },
        externalId: `github:${repo.full_name}`,
        relevanceScore: repo.stargazers_count ?? limit - index,
      }));
  },
};
