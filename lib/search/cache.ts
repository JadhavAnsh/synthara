import { createHash } from "node:crypto";

import { connectDB } from "@/lib/db/mongoose";
import { SearchCache } from "@/lib/db/models/search-cache";
import { SEARCH_CACHE_TTL_MS } from "@/lib/search/config";
import type { AggregatedSearchResult, SearchChannel } from "@/lib/search/types";

function normalizeQuery(query: string) {
  return query.trim().toLowerCase().replace(/\s+/g, " ");
}

export function buildSearchCacheKey(query: string, channels: SearchChannel[]) {
  const payload = `${normalizeQuery(query)}::${[...channels].sort().join(",")}`;
  return createHash("sha256").update(payload).digest("hex");
}

export async function getCachedSearchResult(query: string, channels: SearchChannel[]) {
  try {
    await connectDB();

    const queryHash = buildSearchCacheKey(query, channels);
    const cached = await SearchCache.findOne({
      queryHash,
      expiresAt: { $gt: new Date() },
    }).lean();

    if (!cached) {
      return null;
    }

    return {
      query: cached.query,
      cached: true,
      channels: cached.results as AggregatedSearchResult["channels"],
    } satisfies AggregatedSearchResult;
  } catch {
    return null;
  }
}

export async function setCachedSearchResult(
  query: string,
  channels: SearchChannel[],
  results: AggregatedSearchResult["channels"],
) {
  try {
    await connectDB();

    const queryHash = buildSearchCacheKey(query, channels);
    const expiresAt = new Date(Date.now() + SEARCH_CACHE_TTL_MS);

    await SearchCache.findOneAndUpdate(
      { queryHash },
      {
        query: query.trim(),
        channels,
        results,
        expiresAt,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  } catch {
    // Cache write failure should not block search responses.
  }
}
