import { DEFAULT_RESULT_LIMIT } from "@/lib/search/config";
import { SearchProviderError, SearchRateLimitError } from "@/lib/search/errors";
import type { NormalizedSource, SearchOptions } from "@/lib/search/types";

function decodeXmlEntities(value: string) {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function readXmlTag(block: string, tag: string) {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match?.[1] ? decodeXmlEntities(match[1]) : "";
}

function parseArxivAuthors(summary: string) {
  const match = summary.match(/^Authors:\s*(.+?)(?:\n|$)/m);
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
    return decodeXmlEntities(summary);
  }

  return lines
    .slice(abstractIndex + 1)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseArxivEntries(xml: string) {
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/gi)];

  return entries.flatMap((entryMatch, index) => {
    const entry = entryMatch[1];
    const title = readXmlTag(entry, "title");
    const summary = entry.match(/<summary>([\s\S]*?)<\/summary>/i)?.[1]?.trim() ?? "";
    const id = readXmlTag(entry, "id");
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
        relevanceScore: DEFAULT_RESULT_LIMIT - index,
      },
    ];
  });
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

  if (response.status === 429) {
    throw new SearchRateLimitError("arXiv rate limit reached.");
  }

  if (!response.ok) {
    throw new SearchProviderError(`arXiv search failed with status ${response.status}.`);
  }

  const xml = await response.text();

  if (!xml.includes("<feed")) {
    throw new SearchProviderError("arXiv returned an unexpected response.");
  }

  return parseArxivEntries(xml);
}

export function parseArxivEntriesForTest(xml: string) {
  return parseArxivEntries(xml);
}
