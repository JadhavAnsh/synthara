"use client";

import type { AggregatedSearchResult } from "@/lib/api/sources";
import { CHANNEL_LABELS } from "@/lib/validation/search";

type SearchResultsSummaryProps = {
  result: AggregatedSearchResult;
};

function countResults(result: AggregatedSearchResult) {
  return result.channels.reduce((total, channel) => total + channel.results.length, 0);
}

export function SearchResultsSummary({ result }: SearchResultsSummaryProps) {
  const totalResults = countResults(result);
  const allChannelsEmpty = result.channels.every(
    (channel) => channel.status === "empty" || (channel.status === "success" && channel.results.length === 0),
  );
  const hasChannelErrors = result.channels.some(
    (channel) =>
      channel.status === "error" || channel.status === "timeout" || channel.status === "rate_limited",
  );

  if (allChannelsEmpty && !hasChannelErrors) {
    return (
      <div className="rounded-xl border border-dashed border-hairline bg-surface-soft px-6 py-8 text-center">
        <h3 className="font-[family-name:var(--font-display)] text-xl text-ink">No sources found</h3>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-body">
          Nothing matched your project idea across web, academic, or GitHub. Try a shorter or more specific
          query, then search again.
        </p>
      </div>
    );
  }

  if (totalResults === 0 && hasChannelErrors) {
    return (
      <div className="rounded-xl border border-hairline bg-surface-soft px-5 py-4">
        <p className="text-sm text-body">
          Search finished with errors and no usable results yet. Switch channels above or retry Search Sources.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-hairline bg-surface-soft px-5 py-3.5">
      <p className="text-sm text-body">
        <span className="font-medium text-ink">{totalResults}</span> sources for &ldquo;{result.query}&rdquo;
        {result.cached ? " · cached" : null}
      </p>
      <div className="flex flex-wrap gap-2">
        {result.channels.map((channel) => (
          <span
            key={channel.channel}
            className="rounded-full border border-hairline bg-canvas px-2.5 py-0.5 text-xs text-body-strong"
          >
            {CHANNEL_LABELS[channel.channel]}: {channel.results.length}
          </span>
        ))}
      </div>
    </div>
  );
}
