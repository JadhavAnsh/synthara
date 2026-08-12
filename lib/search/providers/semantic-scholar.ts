import { DEFAULT_RESULT_LIMIT, getCrossrefMailto } from "@/lib/search/config";
import { SearchProviderError, SearchRateLimitError } from "@/lib/search/errors";
import type { NormalizedSource, SearchOptions } from "@/lib/search/types";

type SemanticScholarAuthor = {
  name?: string;
};

type SemanticScholarPaper = {
  paperId?: string;
  title?: string;
  url?: string;
  abstract?: string;
  year?: number;
  citationCount?: number;
  externalIds?: {
    DOI?: string;
    ArXiv?: string;
  };
  authors?: SemanticScholarAuthor[];
};

type SemanticScholarResponse = {
  data?: SemanticScholarPaper[];
  error?: string;
};

export async function searchSemanticScholar(
  query: string,
  options?: SearchOptions,
): Promise<NormalizedSource[]> {
  const limit = options?.limit ?? DEFAULT_RESULT_LIMIT;
  const endpoint = new URL("https://api.semanticscholar.org/graph/v1/paper/search");
  endpoint.searchParams.set("query", query);
  endpoint.searchParams.set("limit", String(limit));
  endpoint.searchParams.set(
    "fields",
    "title,url,abstract,year,citationCount,externalIds,authors",
  );

  const response = await fetch(endpoint, {
    headers: {
      Accept: "application/json",
    },
    signal: options?.signal,
  });

  if (response.status === 429) {
    throw new SearchRateLimitError("Semantic Scholar rate limit reached.");
  }

  const payload = (await response.json()) as SemanticScholarResponse;

  if (!response.ok) {
    throw new SearchProviderError(payload.error || "Semantic Scholar search failed.");
  }

  return (payload.data ?? [])
    .filter((paper) => paper.title)
    .map((paper, index) => {
      const doi = paper.externalIds?.DOI;
      const arxivId = paper.externalIds?.ArXiv;
      const url =
        paper.url ||
        (doi ? `https://doi.org/${doi}` : arxivId ? `https://arxiv.org/abs/${arxivId}` : "");

      return {
        title: paper.title!,
        authors: (paper.authors ?? []).map((author) => author.name).filter(Boolean) as string[],
        url,
        sourceType: "academic" as const,
        snippets: paper.abstract ? [paper.abstract] : [],
        credibilitySignals: {
          provider: "semantic-scholar",
          doi: doi ?? null,
          arxivId: arxivId ?? null,
          year: paper.year ?? null,
          citationCount: paper.citationCount ?? null,
        },
        externalId: paper.paperId ? `s2:${paper.paperId}` : `s2:title:${paper.title}`,
        relevanceScore: limit - index,
      };
    });
}

type CrossrefAuthor = {
  given?: string;
  family?: string;
};

type CrossrefItem = {
  DOI?: string;
  title?: string[];
  URL?: string;
  author?: CrossrefAuthor[];
  abstract?: string;
  published?: {
    "date-parts"?: number[][];
  };
  "is-referenced-by-count"?: number;
};

type CrossrefResponse = {
  message?: {
    items?: CrossrefItem[];
  };
};

export async function searchCrossref(
  query: string,
  options?: SearchOptions,
): Promise<NormalizedSource[]> {
  const limit = options?.limit ?? DEFAULT_RESULT_LIMIT;
  const endpoint = new URL("https://api.crossref.org/works");
  endpoint.searchParams.set("query", query);
  endpoint.searchParams.set("rows", String(limit));
  endpoint.searchParams.set("mailto", getCrossrefMailto());

  const response = await fetch(endpoint, {
    headers: {
      Accept: "application/json",
    },
    signal: options?.signal,
  });

  if (response.status === 429) {
    throw new SearchRateLimitError("CrossRef rate limit reached.");
  }

  const payload = (await response.json()) as CrossrefResponse;

  if (!response.ok) {
    throw new SearchProviderError("CrossRef search failed.");
  }

  return (payload.message?.items ?? [])
    .filter((item) => item.title?.[0])
    .map((item, index) => {
      const doi = item.DOI;
      const title = item.title![0];
      const authors = (item.author ?? [])
        .map((author) => [author.given, author.family].filter(Boolean).join(" "))
        .filter(Boolean);
      const year = item.published?.["date-parts"]?.[0]?.[0] ?? null;

      return {
        title,
        authors,
        url: item.URL || (doi ? `https://doi.org/${doi}` : ""),
        sourceType: "academic" as const,
        snippets: item.abstract ? [item.abstract.replace(/<[^>]+>/g, "")] : [],
        credibilitySignals: {
          provider: "crossref",
          doi: doi ?? null,
          year,
          citationCount: item["is-referenced-by-count"] ?? null,
        },
        externalId: doi ? `crossref:${doi.toLowerCase()}` : `crossref:title:${title}`,
        relevanceScore: (limit - index) * 0.5,
      };
    });
}
