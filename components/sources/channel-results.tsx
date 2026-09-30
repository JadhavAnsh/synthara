"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import type { ChannelSearchResult } from "@/lib/api/sources";
import { CHANNEL_LABELS } from "@/lib/validation/search";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { SourceResultCard } from "@/components/sources/source-result-card";
import type { NormalizedSource } from "@/lib/api/sources";
import type { SearchChannel } from "@/lib/search/types";

type ChannelResultsProps = {
  channel: SearchChannel;
  result?: ChannelSearchResult;
  isLoading: boolean;
  savedExternalIds: Set<string>;
  savingExternalId: string | null;
  onAdd: (source: NormalizedSource) => void;
  onRetry?: () => void;
};

function ChannelSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-28 w-full rounded-xl" />
      <Skeleton className="h-28 w-full rounded-xl" />
      <Skeleton className="h-28 w-full rounded-xl" />
    </div>
  );
}

export function ChannelResults({
  channel,
  result,
  isLoading,
  savedExternalIds,
  savingExternalId,
  onAdd,
  onRetry,
}: ChannelResultsProps) {
  const reduceMotion = useReducedMotion();
  const label = CHANNEL_LABELS[channel];

  return (
    <section aria-live="polite" className="min-h-[12rem]">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ChannelSkeleton />
          </motion.div>
        ) : !result ? (
          <motion.div
            key="idle"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border border-dashed border-hairline bg-surface-soft px-6 py-10 text-center"
          >
            <p className="text-sm text-body">Run a search to see {label.toLowerCase()} results here.</p>
          </motion.div>
        ) : result.status === "empty" ? (
          <motion.div
            key="empty"
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-hairline bg-surface-soft px-6 py-8"
          >
            <p className="text-sm text-body">
              {channel === "github"
                ? "No GitHub repositories matched this project idea. Try shorter keywords or a library name."
                : `No ${label.toLowerCase()} results for this query.`}
            </p>
          </motion.div>
        ) : result.status === "timeout" ? (
          <motion.div
            key="timeout"
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-hairline bg-surface-soft px-6 py-6"
          >
            <p className="text-sm text-body">
              This channel timed out. A background retry is scheduled — use Retry now to search again
              immediately.
            </p>
            {onRetry ? (
              <Button type="button" variant="outline" size="sm" className="mt-4" onClick={onRetry}>
                Retry now
              </Button>
            ) : null}
          </motion.div>
        ) : result.status === "rate_limited" ? (
          <motion.div
            key="rate-limited"
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-hairline bg-surface-soft px-6 py-6"
          >
            <p className="text-sm text-body">
              This provider is rate limited. We&apos;ll retry in the background, or use Retry now to
              force a fresh search.
            </p>
            {onRetry ? (
              <Button type="button" variant="outline" size="sm" className="mt-4" onClick={onRetry}>
                Retry now
              </Button>
            ) : null}
            {result.error ? <p className="mt-2 text-xs text-muted-foreground">{result.error}</p> : null}
          </motion.div>
        ) : result.status === "error" ? (
          <motion.div
            key="error"
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-6"
          >
            <p className="text-sm text-destructive">
              {result.error ||
                (channel === "github"
                  ? "GitHub search failed. Check your connection or add GITHUB_TOKEN for higher limits."
                  : `${label} search failed.`)}
            </p>
            {onRetry ? (
              <Button type="button" variant="outline" size="sm" className="mt-4" onClick={onRetry}>
                Retry
              </Button>
            ) : null}
          </motion.div>
        ) : (
          <motion.ul
            key={`results-${channel}`}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {result.results.map((source, index) => (
              <li key={source.externalId}>
                <SourceResultCard
                  source={source}
                  index={index}
                  isSaved={savedExternalIds.has(source.externalId)}
                  isSaving={savingExternalId === source.externalId}
                  onAdd={onAdd}
                />
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </section>
  );
}
