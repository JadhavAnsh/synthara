"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { motion, useReducedMotion } from "motion/react";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import type { ProjectSummary } from "@/lib/api/projects";
import { CITATION_STYLE_LABELS, type CitationStyle } from "@/lib/validation/project";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  project: ProjectSummary;
  index: number;
};

const STATUS_STYLES: Record<string, string> = {
  draft: "border-hairline bg-surface-soft text-body-strong",
  active: "border-[#5db8a6]/25 bg-[#5db8a6]/10 text-[#3d8f80]",
  archived: "border-hairline bg-canvas text-muted-foreground",
};

export function ProjectCard({ project, index }: ProjectCardProps) {
  const reduceMotion = useReducedMotion();
  const statusClass = STATUS_STYLES[project.status] ?? STATUS_STYLES.draft;
  const updatedLabel = formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true });

  return (
    <motion.li
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: Math.min(index * 0.05, 0.25),
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Link
        href={`/projects/${project.id}`}
        className="group block rounded-xl border border-hairline bg-canvas p-5 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_12px_32px_rgba(204,120,92,0.08)]"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-primary">
                {CITATION_STYLE_LABELS[project.citationStyle as CitationStyle]}
              </span>
              <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize", statusClass)}>
                {project.status}
              </span>
            </div>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-xl leading-snug text-ink transition-colors group-hover:text-primary">
              {project.title}
            </h2>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-body">{project.topic}</p>
            <p className="mt-3 text-xs text-muted-foreground">Updated {updatedLabel}</p>
          </div>
          <span className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-full border border-hairline bg-surface-soft text-body transition-colors group-hover:border-primary/30 group-hover:bg-primary/10 group-hover:text-primary">
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={1.75} className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </motion.li>
  );
}
