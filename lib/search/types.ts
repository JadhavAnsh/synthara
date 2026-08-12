export const SEARCH_CHANNELS = ["web", "academic", "github"] as const;

export type SearchChannel = (typeof SEARCH_CHANNELS)[number];

export const CHANNEL_STATUSES = [
  "idle",
  "loading",
  "success",
  "empty",
  "timeout",
  "rate_limited",
  "error",
] as const;

export type ChannelStatus = (typeof CHANNEL_STATUSES)[number];

export type SourceType = "web" | "academic" | "github" | "manual";

export type NormalizedSource = {
  title: string;
  authors: string[];
  url: string;
  sourceType: SourceType;
  snippets: string[];
  credibilitySignals: Record<string, unknown>;
  externalId: string;
  relevanceScore?: number;
};

export type SearchOptions = {
  limit?: number;
  signal?: AbortSignal;
};

export type SearchProvider = {
  channel: SearchChannel;
  search(query: string, options?: SearchOptions): Promise<NormalizedSource[]>;
};

export type ChannelSearchResult = {
  channel: SearchChannel;
  status: ChannelStatus;
  results: NormalizedSource[];
  error?: string;
};

export type AggregatedSearchResult = {
  query: string;
  cached: boolean;
  channels: ChannelSearchResult[];
};
