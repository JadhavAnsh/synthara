import { describe, expect, it } from "vitest";

import { buildSearchCacheKey, buildChannelCacheKey } from "@/lib/search/cache";
import { mapSearchError, SearchRateLimitError, SearchTimeoutError } from "@/lib/search/errors";
import { mergeChannelResults } from "@/lib/search/merge";
import { dedupeSources, normalizeSource, normalizeSources } from "@/lib/search/normalize";
import type { ChannelSearchResult, NormalizedSource } from "@/lib/search/types";

function source(overrides: Partial<NormalizedSource> = {}): NormalizedSource {
  return {
    title: "Sample Paper",
    authors: ["Ada Lovelace"],
    url: "https://example.com/paper",
    sourceType: "academic",
    snippets: ["A useful abstract."],
    credibilitySignals: { doi: "10.1000/example" },
    externalId: "doi:10.1000/example",
    relevanceScore: 5,
    ...overrides,
  };
}

describe("buildSearchCacheKey", () => {
  it("normalizes query whitespace and channel order", () => {
    const left = buildSearchCacheKey("  Machine   Learning  ", ["github", "web"]);
    const right = buildSearchCacheKey("machine learning", ["web", "github"]);
    expect(left).toBe(right);
  });

  it("builds per-channel cache keys", () => {
    expect(buildChannelCacheKey("transformers", "web")).toBe(
      buildSearchCacheKey("transformers", ["web"]),
    );
  });
});

describe("normalizeSources", () => {
  it("drops invalid entries and sorts by relevance", () => {
    const results = normalizeSources([
      source({ externalId: "b", relevanceScore: 2 }),
      source({ externalId: "", title: "Missing id" }),
      source({ externalId: "a", relevanceScore: 9 }),
    ]);

    expect(results.map((item) => item.externalId)).toEqual(["a", "b"]);
  });
});

describe("dedupeSources", () => {
  it("dedupes academic sources by DOI", () => {
    const results = dedupeSources([
      source({ externalId: "one", credibilitySignals: { doi: "10.1/abc" } }),
      source({ externalId: "two", title: "Duplicate", credibilitySignals: { doi: "10.1/abc" } }),
    ]);

    expect(results).toHaveLength(1);
    expect(results[0]?.externalId).toBe("one");
  });
});

describe("normalizeSource", () => {
  it("trims fields and preserves valid sources", () => {
    const normalized = normalizeSource(
      source({
        title: "  Sample Paper  ",
        authors: ["  Ada Lovelace  "],
        snippets: ["  abstract  "],
      }),
    );

    expect(normalized?.title).toBe("Sample Paper");
    expect(normalized?.authors).toEqual(["Ada Lovelace"]);
  });
});

describe("mapSearchError", () => {
  it("maps timeout and rate limit errors", () => {
    expect(mapSearchError(new SearchTimeoutError()).status).toBe("timeout");
    expect(mapSearchError(new SearchRateLimitError()).status).toBe("rate_limited");
  });

  it("maps abort errors to timeout", () => {
    const error = new DOMException("Aborted", "AbortError");
    expect(mapSearchError(error).status).toBe("timeout");
  });
});

describe("mergeChannelResults", () => {
  it("prefers successful results over failed ones", () => {
    const failed: ChannelSearchResult = {
      channel: "github",
      status: "timeout",
      results: [],
      error: "Timed out",
    };
    const recovered: ChannelSearchResult = {
      channel: "github",
      status: "success",
      results: [source({ sourceType: "github", externalId: "gh:1" })],
    };

    const merged = mergeChannelResults([failed], [recovered]);
    expect(merged).toHaveLength(1);
    expect(merged[0]?.status).toBe("success");
    expect(merged[0]?.results).toHaveLength(1);
  });

  it("keeps existing success when retry still fails", () => {
    const success: ChannelSearchResult = {
      channel: "web",
      status: "success",
      results: [source({ sourceType: "web", externalId: "web:1" })],
    };
    const retryFailure: ChannelSearchResult = {
      channel: "web",
      status: "error",
      results: [],
      error: "Provider unavailable",
    };

    const merged = mergeChannelResults([success], [retryFailure]);
    expect(merged[0]?.status).toBe("success");
  });
});
