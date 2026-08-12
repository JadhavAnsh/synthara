import { SEARCH_CHANNELS, type ChannelSearchResult, type SearchChannel } from "@/lib/search/types";

function isSuccessfulResult(result: ChannelSearchResult) {
  return result.status === "success" && result.results.length > 0;
}

function resultPriority(result: ChannelSearchResult) {
  if (isSuccessfulResult(result)) {
    return 3;
  }

  if (result.status === "empty") {
    return 2;
  }

  if (result.status === "rate_limited" || result.status === "timeout") {
    return 1;
  }

  return 0;
}

function shouldReplaceResult(current: ChannelSearchResult, incoming: ChannelSearchResult) {
  return resultPriority(incoming) > resultPriority(current);
}

export function mergeChannelResults(
  existing: ChannelSearchResult[],
  incoming: ChannelSearchResult[],
  channelOrder: SearchChannel[] = [...SEARCH_CHANNELS],
): ChannelSearchResult[] {
  const merged = new Map(existing.map((result) => [result.channel, result]));

  for (const result of incoming) {
    const current = merged.get(result.channel);
    if (!current || shouldReplaceResult(current, result)) {
      merged.set(result.channel, result);
    }
  }

  return channelOrder.filter((channel) => merged.has(channel)).map((channel) => merged.get(channel)!);
}
