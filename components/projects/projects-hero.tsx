"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

type ProjectsHeroProps = {
  projectCount: number;
};

export function ProjectsHero({ projectCount }: ProjectsHeroProps) {
  const reduceMotion = useReducedMotion();

  return (
    <header className="relative overflow-hidden rounded-2xl border border-hairline bg-surface-card">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-primary/[0.07] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 left-0 size-56 rounded-full bg-[#5db8a6]/[0.06] blur-3xl"
      />

      <div className="relative px-6 py-7 sm:px-8 sm:py-9">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
          <div className="min-w-0 max-w-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-[family-name:var(--font-display)] text-3xl leading-tight text-ink sm:text-4xl">
                Research projects
              </h1>
              <span className="inline-flex items-center rounded-full border border-hairline bg-canvas px-3 py-1 text-xs font-medium tabular-nums text-body-strong">
                {projectCount} project{projectCount === 1 ? "" : "s"}
              </span>
            </div>
            <p className="mt-4 text-base leading-7 text-body">
              Open a project to search sources, build your library, and prepare drafts for export.
            </p>
          </div>

          <Button
            size="lg"
            render={<Link href="/projects/new" />}
            className="h-11 w-full shrink-0 px-5 sm:w-auto"
          >
            <HugeiconsIcon icon={Add01Icon} strokeWidth={1.75} className="size-4" data-icon="inline-start" />
            New project
          </Button>
        </div>
      </div>

      {!reduceMotion && projectCount > 0 ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      ) : null}
    </header>
  );
}
