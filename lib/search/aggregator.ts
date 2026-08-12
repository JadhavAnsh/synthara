import { DEFAULT_SEARCH_TIMEOUT_MS } from "@/lib/search/config";
import { getCachedSearchResult, setCachedSearchResult } from "@/lib/search/cache";
import { mapSearchError } from "@/lib/search/errors";
import { normalizeSources } from "@/lib/search/normalize";
import { enqueueSearchJob } from "@/lib/search/queue";
import { getSearchProvider } from "@/lib/search/providers";
import {
  SEARCH_CHANNELS,
  type AggregatedSearchResult,
  type ChannelSearchResult,
  type SearchChannel,
} from "@/lib/search/types";

const AGGREGATE_SEARCH_BUDGET_MS = 35_000;

type AggregateSearchInput = {
  query: string;
  channels?: SearchChannel[];
  projectId?: string;
  skipCache?: boolean;
};

function resolveChannels(channels?: SearchChannel[]) {
  if (!channels?.length) {
    return [...SEARCH_CHANNELS];
  }

  return [...new Set(channels)];
}

async function searchChannel(
  channel: SearchChannel,
  query: string,
): Promise<ChannelSearchResult> {
  try {
    const provider = getSearchProvider(channel);
    const results = normalizeSources(
      await provider.search(query, {
        signal: AbortSignal.timeout(DEFAULT_SEARCH_TIMEOUT_MS),
      }),
    );

    return {
      channel,
      status: results.length ? "success" : "empty",
      results,
    };
  } catch (error) {
    const mapped = mapSearchError(error);
    return {
      channel,
      status: mapped.status,
      results: [],
      error: mapped.message,
    };
  }
}

async function runAggregateSearch(input: AggregateSearchInput): Promise<AggregatedSearchResult> {
  const query = input.query.trim().slice(0, 200);
  const channels = resolveChannels(input.channels);

  if (!input.skipCache) {
    const cached = await getCachedSearchResult(query, channels);
    if (cached) {
      return cached;
    }
  }

  const channelResults = await Promise.all(channels.map((channel) => searchChannel(channel, query)));

  if (input.projectId) {
    for (const result of channelResults) {
      if (
        result.status === "timeout" ||
        result.status === "rate_limited" ||
        result.status === "error"
      ) {
        void enqueueSearchJob({
          projectId: input.projectId,
          query,
          channel: result.channel,
          error: result.error || `${result.channel} search failed`,
        });
      }
    }
  }

  const response = {
    query,
    cached: false,
    channels: channelResults,
  };

  const hasSuccessfulResults = channelResults.some(
    (channel) => channel.status === "success" && channel.results.length > 0,
  );

  if (hasSuccessfulResults) {
    void setCachedSearchResult(query, channels, channelResults);
  }

  return response;
}

export async function aggregateSearch(input: AggregateSearchInput): Promise<AggregatedSearchResult> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error("Search timed out. Try a shorter query or retry in a moment."));
    }, AGGREGATE_SEARCH_BUDGET_MS);
  });

  try {
    return await Promise.race([runAggregateSearch(input), timeoutPromise]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}
