import { dedupeSources } from "@/lib/search/normalize";
import { searchArxiv } from "@/lib/search/providers/arxiv";
import {
  searchCrossref,
  searchSemanticScholar,
} from "@/lib/search/providers/semantic-scholar";
import type { NormalizedSource, SearchOptions, SearchProvider } from "@/lib/search/types";

export const academicProvider: SearchProvider = {
  channel: "academic",

  async search(query: string, options?: SearchOptions): Promise<NormalizedSource[]> {
    const settled = await Promise.allSettled([
      searchSemanticScholar(query, options),
      searchArxiv(query, options),
      searchCrossref(query, options),
    ]);

    const results: NormalizedSource[] = [];

    for (const outcome of settled) {
      if (outcome.status === "fulfilled") {
        results.push(...outcome.value);
      }
    }

    if (results.length === 0) {
      const firstRejection = settled.find(
        (outcome): outcome is PromiseRejectedResult => outcome.status === "rejected",
      );

      if (firstRejection) {
        throw firstRejection.reason;
      }
    }

    return dedupeSources(results);
  },
};
