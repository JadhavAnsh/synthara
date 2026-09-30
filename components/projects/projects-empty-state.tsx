"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, SearchIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

export function ProjectsEmptyState() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-2xl border border-dashed border-hairline bg-surface-soft px-6 py-12 text-center sm:px-10 sm:py-14"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/[0.04] to-transparent"
      />
      <div className="relative mx-auto max-w-md">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-hairline bg-canvas shadow-[0_8px_24px_rgba(20,20,19,0.04)]">
          <HugeiconsIcon icon={SearchIcon} strokeWidth={1.75} className="size-6 text-primary" />
        </div>
        <h2 className="mt-6 font-[family-name:var(--font-display)] text-2xl text-ink">
          Start your first research project
        </h2>
        <p className="mt-3 text-sm leading-6 text-body">
          Define a topic and citation style, then search web, academic, and GitHub sources in one
          workspace.
        </p>
        <Button size="lg" className="mt-8 h-11 px-6" render={<Link href="/projects/new" />}>
          <HugeiconsIcon icon={Add01Icon} strokeWidth={1.75} className="size-4" data-icon="inline-start" />
          Create project
        </Button>
      </div>
    </motion.div>
  );
}

function ProjectsLoadingSkeleton() {
  return (
    <div className="grid gap-4">
      {[0, 1, 2].map((item) => (
        <div key={item} className="h-36 animate-pulse rounded-xl border border-hairline bg-surface-soft" />
      ))}
    </div>
  );
}

export { ProjectsLoadingSkeleton };
