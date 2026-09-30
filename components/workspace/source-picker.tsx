"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

import type { SourceSummary } from "@/lib/api/sources";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

type SourcePickerProps = {
  projectId: string;
  sources: SourceSummary[];
  selectedIds: string[];
  onToggle: (sourceId: string, checked: boolean) => void;
  isUpdating: boolean;
};

const TYPE_TONE: Record<string, string> = {
  web: "bg-primary",
  academic: "bg-[#5db8a6]",
  github: "bg-[#e8a55a]",
  manual: "bg-on-dark-soft",
};

export function SourcePicker({
  projectId,
  sources,
  selectedIds,
  onToggle,
  isUpdating,
}: SourcePickerProps) {
  const reduceMotion = useReducedMotion();

  if (!sources.length) {
    return (
      <div className="px-1 py-2 text-center">
        <p className="text-sm leading-6 text-on-dark-soft">No saved sources yet.</p>
        <Button
          size="sm"
          className="mt-3"
          render={<Link href={`/projects/${projectId}`} />}
        >
          Search sources
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2 px-1">
        <p className="text-xs font-medium uppercase tracking-wide text-on-dark-soft">
          Evidence context
        </p>
        <span className="text-xs tabular-nums text-on-dark-soft">
          {selectedIds.length}/{sources.length}
          {isUpdating ? " · syncing" : ""}
        </span>
      </div>
      <ul className="max-h-52 space-y-1 overflow-y-auto pr-1">
        {sources.map((source, index) => {
          const checked = selectedIds.includes(source.id);

          return (
            <motion.li
              key={source.id}
              layout={!reduceMotion}
              initial={reduceMotion ? false : { opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                type: "spring",
                stiffness: 420,
                damping: 32,
                delay: Math.min(index * 0.03, 0.18),
              }}
              className={cn(
                "flex items-start gap-2.5 px-2 py-2 transition-colors",
                checked ? "bg-primary/12" : "hover:bg-white/5",
              )}
            >
              <Checkbox
                checked={checked}
                onCheckedChange={(value) => onToggle(source.id, value === true)}
                aria-label={`Select ${source.title}`}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "size-1.5 shrink-0 rounded-full",
                      TYPE_TONE[source.sourceType] ?? TYPE_TONE.manual,
                    )}
                  />
                  <p className="line-clamp-2 text-xs leading-5 text-on-dark">{source.title}</p>
                </div>
                <p className="mt-1 pl-3.5 text-xs uppercase tracking-wide text-on-dark-soft">
                  {source.sourceType}
                </p>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
