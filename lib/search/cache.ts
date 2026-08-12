import { createHash } from "node:crypto";

import { connectDB } from "@/lib/db/mongoose";
import { SearchCache } from "@/lib/db/models/search-cache";
import { logError, logInfo, logWarn } from "@/lib/logger";
import { SEARCH_CACHE_TTL_MS } from "@/lib/search/config";
import type { ChannelSearchResult, SearchChannel } from "@/lib/search/types";

function normalizeQuery(query: string) {
  return query.trim().toLowerCase().replace(/\s+/g, " ");
}

export function buildSearchCacheKey(query: string, channels: SearchChannel[]) {
  const payload = `${normalizeQuery(query)}::${[...channels].sort().join(",")}`;
  return createHash("sha256").update(payload).digest("hex");
}

export function buildChannelCacheKey(query: string, channel: SearchChannel) {
  return buildSearchCacheKey(query, [channel]);
}

export async function getCachedChannelResult(query: string, channel: SearchChannel) {
  try {
    await connectDB();

    const queryHash = buildChannelCacheKey(query, channel);
    const cached = await SearchCache.findOne({
      queryHash,
      expiresAt: { $gt: new Date() },
    }).lean();

    if (!cached) {
      return null;
    }

    const results = cached.results as ChannelSearchResult[];
    const match = results.find((result) => result.channel === channel) ?? results[0];

    if (!match) {
      return null;
    }

    logInfo("search-cache", "channel.hit", { channel, queryHash });
    return match;
  } catch (error) {
    logWarn("search-cache", "channel.read_failed", {
      channel,
      message: error instanceof Error ? error.message : "Unknown cache read error",
    });
    return null;
  }
}

export async function getPartialCachedResults(query: string, channels: SearchChannel[]) {
  const cached: ChannelSearchResult[] = [];
  const missing: SearchChannel[] = [];

  for (const channel of channels) {
    const result = await getCachedChannelResult(query, channel);
    if (result) {
      cached.push(result);
    } else {
      missing.push(channel);
    }
  }

  return { cached, missing };
}

export async function setCachedChannelResult(
  query: string,
  channel: SearchChannel,
  result: ChannelSearchResult,
) {
  try {
    await connectDB();

    const queryHash = buildChannelCacheKey(query, channel);
    const expiresAt = new Date(Date.now() + SEARCH_CACHE_TTL_MS);

    await SearchCache.findOneAndUpdate(
      { queryHash },
      {
        query: query.trim(),
        channels: [channel],
        results: [result],
        expiresAt,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    logInfo("search-cache", "channel.write", { channel, queryHash, status: result.status });
  } catch (error) {
    logError("search-cache", "channel.write_failed", {
      channel,
      message: error instanceof Error ? error.message : "Unknown cache write error",
    });
  }
}

export async function setCachedChannelResults(
  query: string,
  results: ChannelSearchResult[],
) {
  await Promise.all(results.map((result) => setCachedChannelResult(query, result.channel, result)));
}
