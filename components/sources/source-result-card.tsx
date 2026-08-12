"use client";

import { motion, useReducedMotion } from "motion/react";

import type { NormalizedSource } from "@/lib/api/sources";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SourceResultCardProps = {
  source: NormalizedSource;
  isSaved: boolean;
  isSaving: boolean;
  onAdd: (source: NormalizedSource) => void;
  index?: number;
};

const TYPE_STYLES: Record<string, { badge: string; ring: string }> = {
  web: {
    badge: "border-primary/20 bg-primary/10 text-primary",
    ring: "hover:border-primary/35 hover:shadow-[0_8px_24px_rgba(204,120,92,0.08)]",
  },
  academic: {
    badge: "border-[#5db8a6]/25 bg-[#5db8a6]/10 text-[#3d8f80]",
    ring: "hover:border-[#5db8a6]/35 hover:shadow-[0_8px_24px_rgba(93,184,166,0.08)]",
  },
  github: {
    badge: "border-[#e8a55a]/25 bg-[#e8a55a]/10 text-[#b87a2a]",
    ring: "hover:border-[#e8a55a]/35 hover:shadow-[0_8px_24px_rgba(232,165,90,0.08)]",
  },
  manual: {
    badge: "border-hairline bg-surface-soft text-body-strong",
    ring: "hover:border-hairline",
  },
};

function formatAuthors(authors: string[]) {
  if (!authors.length) {
    return "Unknown author";
  }

  if (authors.length <= 2) {
    return authors.join(", ");
  }

  return `${authors.slice(0, 2).join(", ")} +${authors.length - 2}`;
}

export function SourceResultCard({
  source,
  isSaved,
  isSaving,
  onAdd,
  index = 0,
}: SourceResultCardProps) {
  const reduceMotion = useReducedMotion();
  const styles = TYPE_STYLES[source.sourceType] ?? TYPE_STYLES.manual;

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.24), ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group rounded-xl border border-hairline bg-canvas p-5 transition-[border-color,box-shadow] duration-200",
        styles.ring,
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <span
            className={cn(
              "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide",
              styles.badge,
            )}
          >
            {source.sourceType}
          </span>
          <h3 className="mt-3 font-[family-name:var(--font-display)] text-xl leading-snug text-ink">
            {source.title}
          </h3>
          <p className="mt-1.5 text-sm text-body">{formatAuthors(source.authors)}</p>
          {source.url ? (
            <a
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block max-w-full truncate text-sm text-primary underline-offset-4 hover:underline"
            >
              {source.url}
            </a>
          ) : null}
          {source.snippets[0] ? (
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-body">{source.snippets[0]}</p>
          ) : null}
        </div>
        <Button
          type="button"
          variant={isSaved ? "outline" : "default"}
          disabled={isSaved || isSaving}
          onClick={() => onAdd(source)}
          className="shrink-0 sm:opacity-90 sm:transition-opacity sm:group-hover:opacity-100"
        >
          {isSaved ? "In library" : isSaving ? "Saving…" : "Add to library"}
        </Button>
      </div>
    </motion.article>
  );
}
