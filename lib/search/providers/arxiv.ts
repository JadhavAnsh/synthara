import { DEFAULT_RESULT_LIMIT } from "@/lib/search/config";
import { SearchProviderError } from "@/lib/search/errors";
import type { NormalizedSource, SearchOptions } from "@/lib/search/types";

function parseArxivAuthors(summary: string) {
  const match = summary.match(/^Authors:\s*(.+?)\n/m);
  if (!match?.[1]) {
    return [];
  }

  return match[1]
    .split(",")
    .map((author) => author.trim())
    .filter(Boolean);
}

function parseArxivSummary(summary: string) {
  const lines = summary.split("\n");
  const abstractIndex = lines.findIndex((line) => line.trim() === "Abstract:");
  if (abstractIndex === -1) {
    return "";
  }

  return lines
    .slice(abstractIndex + 1)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function searchArxiv(
  query: string,
  options?: SearchOptions,
): Promise<NormalizedSource[]> {
  const limit = options?.limit ?? DEFAULT_RESULT_LIMIT;
  const endpoint = new URL("https://export.arxiv.org/api/query");
  endpoint.searchParams.set("search_query", `all:${query}`);
  endpoint.searchParams.set("start", "0");
  endpoint.searchParams.set("max_results", String(limit));
  endpoint.searchParams.set("sortBy", "relevance");
  endpoint.searchParams.set("sortOrder", "descending");

  const response = await fetch(endpoint, {
    headers: {
      Accept: "application/atom+xml",
    },
    signal: options?.signal,
  });

  if (!response.ok) {
    throw new SearchProviderError("arXiv search failed.");
  }

  const xml = await response.text();
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)];

  return entries.flatMap((entryMatch, index) => {
    const entry = entryMatch[1];
    const title = entry.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.replace(/\s+/g, " ").trim();
    const summary = entry.match(/<summary>([\s\S]*?)<\/summary>/)?.[1]?.trim() ?? "";
    const id = entry.match(/<id>([\s\S]*?)<\/id>/)?.[1]?.trim() ?? "";
    const arxivId = id.split("/abs/")[1] ?? id;

    if (!title) {
      return [];
    }

    return [
      {
        title,
        authors: parseArxivAuthors(summary),
        url: id,
        sourceType: "academic" as const,
        snippets: [parseArxivSummary(summary)].filter(Boolean),
        credibilitySignals: {
          provider: "arxiv",
          arxivId,
        },
        externalId: arxivId ? `arxiv:${arxivId}` : `arxiv:title:${title}`,
        relevanceScore: limit - index,
      },
    ];
  });
}
