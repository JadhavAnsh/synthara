"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import type { SourceSummary } from "@/lib/api/sources";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ProjectSourcesListProps = {
  sources: SourceSummary[];
  isLoading: boolean;
  deletingSourceId: string | null;
  onDelete: (sourceId: string) => void;
};

const TYPE_DOT: Record<string, string> = {
  web: "bg-primary",
  academic: "bg-[#5db8a6]",
  github: "bg-[#e8a55a]",
  manual: "bg-on-dark-soft",
};

export function ProjectSourcesList({
  sources,
  isLoading,
  deletingSourceId,
  onDelete,
}: ProjectSourcesListProps) {
  const reduceMotion = useReducedMotion();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[0, 1, 2].map((item) => (
          <div key={item} className="h-20 animate-pulse rounded-lg bg-white/5" />
        ))}
      </div>
    );
  }

  if (!sources.length) {
    return (
      <div className="rounded-xl border border-dashed border-white/10 bg-surface-dark-elevated px-5 py-8 text-center">
        <p className="text-sm leading-6 text-on-dark-soft">
          Your library is empty. Add sources from search results to build evidence for drafting.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      <AnimatePresence initial={false} mode="popLayout">
        {sources.map((source) => (
          <motion.li
            key={source.id}
            layout={!reduceMotion}
            initial={reduceMotion ? false : { opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, x: -12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="group rounded-lg border border-white/8 bg-surface-dark-soft/70 p-3.5 transition-colors hover:border-primary/30 hover:bg-surface-dark-elevated"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={cn("size-1.5 shrink-0 rounded-full", TYPE_DOT[source.sourceType] ?? TYPE_DOT.manual)} />
                  <p className="text-xs font-semibold uppercase tracking-wide text-on-dark-soft">
                    {source.sourceType}
                  </p>
                </div>
                <p className="mt-2 text-sm leading-5 text-on-dark">{source.title}</p>
                {source.authors.length ? (
                  <p className="mt-1 text-xs text-on-dark-soft">{source.authors.join(", ")}</p>
                ) : null}
                {source.url ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block max-w-full truncate text-xs text-primary underline-offset-4 hover:underline"
                  >
                    {source.url}
                  </a>
                ) : null}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={deletingSourceId === source.id}
                onClick={() => onDelete(source.id)}
                className="shrink-0 border-white/10 bg-transparent text-on-dark-soft opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 hover:bg-white/5 hover:text-on-dark"
              >
                {deletingSourceId === source.id ? "Removing…" : "Remove"}
              </Button>
            </div>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
