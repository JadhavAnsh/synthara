"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { CITATION_STYLE_LABELS, type CitationStyle } from "@/lib/validation/project";

type ProjectHeroProps = {
  title: string;
  topic: string;
  citationStyle: CitationStyle;
  savedCount: number;
  isSearching: boolean;
};

export function ProjectHero({
  title,
  topic,
  citationStyle,
  savedCount,
  isSearching,
}: ProjectHeroProps) {
  const reduceMotion = useReducedMotion();

  return (
    <header className="relative overflow-hidden rounded-2xl border border-hairline bg-surface-card px-6 py-8 sm:px-8 sm:py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-primary/[0.06] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 left-1/3 size-48 rounded-full bg-[#5db8a6]/[0.05] blur-3xl"
      />

      <Link
        href="/projects"
        className="group inline-flex items-center gap-1.5 text-sm text-body transition-colors hover:text-ink"
      >
        <HugeiconsIcon
          icon={ArrowLeft01Icon}
          strokeWidth={1.75}
          className="size-4 transition-transform group-hover:-translate-x-0.5"
        />
        All projects
      </Link>

      <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <h1 className="font-[family-name:var(--font-display)] text-3xl leading-tight text-ink sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-body">{topic}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center rounded-full border border-hairline bg-canvas px-3 py-1 text-xs font-medium text-body-strong">
            {CITATION_STYLE_LABELS[citationStyle]}
          </span>
          <span className="inline-flex items-center rounded-full border border-hairline bg-canvas px-3 py-1 text-xs font-medium text-body-strong">
            {savedCount} saved
          </span>
          {isSearching ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-3 py-1 text-xs font-medium text-primary">
              <motion.span
                className="size-1.5 rounded-full bg-primary"
                animate={reduceMotion ? undefined : { opacity: [1, 0.35, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              />
              Searching sources
            </span>
          ) : null}
        </div>
      </div>
    </header>
  );
}
