import { DEFAULT_RESULT_LIMIT, getTavilyApiKey } from "@/lib/search/config";
import { SearchProviderError, SearchRateLimitError } from "@/lib/search/errors";
import type { NormalizedSource, SearchOptions, SearchProvider } from "@/lib/search/types";

type TavilyResult = {
  title?: string;
  url?: string;
  content?: string;
  score?: number;
};

type TavilyResponse = {
  results?: TavilyResult[];
  error?: string;
};

export const tavilyProvider: SearchProvider = {
  channel: "web",

  async search(query: string, options?: SearchOptions): Promise<NormalizedSource[]> {
    const apiKey = getTavilyApiKey();
    const limit = options?.limit ?? DEFAULT_RESULT_LIMIT;

    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        max_results: limit,
        include_answer: false,
      }),
      signal: options?.signal,
    });

    const payload = (await response.json()) as TavilyResponse;

    if (response.status === 429) {
      throw new SearchRateLimitError("Tavily rate limit reached.");
    }

    if (!response.ok) {
      throw new SearchProviderError(payload.error || "Tavily search failed.");
    }

    return (payload.results ?? [])
      .filter((result) => result.title && result.url)
      .map((result, index) => ({
        title: result.title!,
        authors: [],
        url: result.url!,
        sourceType: "web" as const,
        snippets: result.content ? [result.content] : [],
        credibilitySignals: {
          provider: "tavily",
          score: result.score ?? null,
        },
        externalId: `tavily:${result.url}`,
        relevanceScore: result.score ?? limit - index,
      }));
  },
};
