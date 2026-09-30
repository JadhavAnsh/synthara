import { logInfo, logWarn } from "@/lib/logger";
import { getPartialCachedResults, setCachedChannelResults } from "@/lib/search/cache";
import { DEFAULT_SEARCH_TIMEOUT_MS } from "@/lib/search/config";
import { mapSearchError } from "@/lib/search/errors";
import { mergeChannelResults } from "@/lib/search/merge";
import { normalizeSources } from "@/lib/search/normalize";
import { enqueueSearchJob, processPendingSearchJobs } from "@/lib/search/queue";
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

function shouldEnqueueRetry(result: ChannelSearchResult) {
  return (
    result.status === "timeout" ||
    result.status === "rate_limited" ||
    result.status === "error"
  );
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
    logWarn("search", "channel.failed", {
      channel,
      status: mapped.status,
      message: mapped.message,
    });

    return {
      channel,
      status: mapped.status,
      results: [],
      error: mapped.message,
    };
  }
}

async function enqueueFailedChannels(
  projectId: string,
  query: string,
  channels: SearchChannel[],
  channelResults: ChannelSearchResult[],
) {
  for (const result of channelResults) {
    if (!shouldEnqueueRetry(result)) {
      continue;
    }

    void enqueueSearchJob({
      projectId,
      query,
      channels,
      channel: result.channel,
      error: result.error || `${result.channel} search failed`,
    });
  }
}

async function runAggregateSearch(input: AggregateSearchInput): Promise<AggregatedSearchResult> {
  const query = input.query.trim().slice(0, 200);
  const channels = resolveChannels(input.channels);
  let recoveredFromQueue = false;

  if (input.projectId) {
    const recovered = await processPendingSearchJobs(input.projectId);
    recoveredFromQueue = recovered.length > 0;
  }

  let channelResults: ChannelSearchResult[] = [];
  let servedFromCache = false;

  if (!input.skipCache) {
    const { cached, missing } = await getPartialCachedResults(query, channels);

    if (missing.length === 0) {
      logInfo("search", "aggregate.cache_hit", { query, channelCount: channels.length });
      return {
        query,
        cached: true,
        channels: mergeChannelResults([], cached, channels),
        recoveredFromQueue,
      };
    }

    if (cached.length > 0) {
      servedFromCache = true;
      logInfo("search", "aggregate.partial_cache_hit", {
        query,
        cachedChannels: cached.map((result) => result.channel),
        missingChannels: missing,
      });
    }

    const freshResults = await Promise.all(missing.map((channel) => searchChannel(channel, query)));
    channelResults = mergeChannelResults(cached, freshResults, channels);

    const freshSuccesses = freshResults.filter(
      (result) => result.status === "success" && result.results.length > 0,
    );

    if (freshSuccesses.length > 0) {
      void setCachedChannelResults(query, freshSuccesses);
    }
  } else {
    logInfo("search", "aggregate.skip_cache", { query, channels });
    channelResults = await Promise.all(channels.map((channel) => searchChannel(channel, query)));

    const successes = channelResults.filter(
      (result) => result.status === "success" && result.results.length > 0,
    );

    if (successes.length > 0) {
      void setCachedChannelResults(query, successes);
    }
  }

  if (input.projectId) {
    await enqueueFailedChannels(input.projectId, query, channels, channelResults);
  }

  return {
    query,
    cached: servedFromCache && channelResults.every((result) => result.status !== "error"),
    channels: channelResults,
    recoveredFromQueue,
  };
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
