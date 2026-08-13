import type { SourceSummary } from "@/lib/api/sources";

type CslJson = Record<string, unknown>;

export function sourceToCslJson(source: Pick<SourceSummary, "title" | "authors" | "url" | "sourceType">): CslJson {
  const type = source.sourceType === "academic" ? "article-journal" : "webpage";

  return {
    type,
    title: source.title,
    author: source.authors.map((name) => ({ literal: name })),
    URL: source.url || undefined,
  };
}
