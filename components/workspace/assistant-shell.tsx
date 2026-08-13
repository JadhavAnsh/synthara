"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";

type AssistantShellProps = {
  projectId: string;
  selectedCount: number;
};

export function AssistantShell({ projectId, selectedCount }: AssistantShellProps) {
  const reduceMotion = useReducedMotion();
  const hasContext = selectedCount > 0;

  return (
    <div className="flex h-full flex-col bg-surface-dark text-on-dark">
      <div className="border-b border-white/10 px-4 py-3.5">
        <div className="flex items-center gap-2">
          {hasContext ? (
            <motion.span
              aria-hidden
              className="size-2 rounded-full bg-[#5db8a6]"
              animate={reduceMotion ? undefined : { scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
          ) : (
            <span aria-hidden className="size-2 rounded-full bg-white/20" />
          )}
          <p className="text-xs font-medium uppercase tracking-wide text-on-dark-soft">
            Research assistant
          </p>
        </div>
        <p className="mt-2 text-sm leading-6 text-on-dark">
          {hasContext
            ? `${selectedCount} source${selectedCount === 1 ? "" : "s"} pinned for Phase 4 context`
            : "Pin sources above to ground assistant replies"}
        </p>
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(204,120,92,0.12),transparent_55%)]"
        />

        <p className="relative max-w-xs text-sm leading-7 text-on-dark-soft">
          Draft on the left. Pin evidence above. Citations insert inline. Streaming assistant tools
          land in Phase 4.
        </p>

        {!hasContext ? (
          <Button
            size="sm"
            variant="outline"
            className="relative mt-5 border-white/15 bg-transparent text-on-dark hover:bg-white/5"
            render={<Link href={`/projects/${projectId}`} />}
          >
            Collect sources
          </Button>
        ) : null}
      </div>
    </div>
  );
}
