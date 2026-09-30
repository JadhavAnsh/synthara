import { MAX_SNIPPET_LENGTH } from "@/lib/search/config";
import type { NormalizedSource } from "@/lib/search/types";

function trimText(value: string, maxLength?: number) {
  const trimmed = value.trim();
  if (!maxLength || trimmed.length <= maxLength) {
    return trimmed;
  }
  return `${trimmed.slice(0, maxLength - 1)}…`;
}

export function normalizeTitle(title: string) {
  return title.toLowerCase().replace(/\s+/g, " ").trim();
}

export function normalizeSource(source: NormalizedSource): NormalizedSource | null {
  const title = trimText(source.title);
  const url = trimText(source.url);
  const externalId = trimText(source.externalId);

  if (!title || !externalId) {
    return null;
  }

  return {
    title,
    authors: source.authors.map((author) => trimText(author)).filter(Boolean),
    url,
    sourceType: source.sourceType,
    snippets: source.snippets
      .map((snippet) => trimText(snippet, MAX_SNIPPET_LENGTH))
      .filter(Boolean),
    credibilitySignals: source.credibilitySignals ?? {},
    externalId,
    relevanceScore: source.relevanceScore,
  };
}

export function normalizeSources(sources: NormalizedSource[]) {
  return sources
    .map(normalizeSource)
    .filter((source): source is NormalizedSource => source !== null)
    .sort((left, right) => (right.relevanceScore ?? 0) - (left.relevanceScore ?? 0));
}

export function dedupeSources(sources: NormalizedSource[]) {
  const seen = new Set<string>();
  const deduped: NormalizedSource[] = [];

  for (const source of normalizeSources(sources)) {
    const doi =
      typeof source.credibilitySignals.doi === "string"
        ? source.credibilitySignals.doi.toLowerCase()
        : "";
    const arxivId =
      typeof source.credibilitySignals.arxivId === "string"
        ? source.credibilitySignals.arxivId.toLowerCase()
        : "";
    const key = doi || arxivId || source.externalId || normalizeTitle(source.title);

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    deduped.push(source);
  }

  return deduped;
}
