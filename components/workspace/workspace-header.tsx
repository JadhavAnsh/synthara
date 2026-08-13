"use client";

import Link from "next/link";

import { ProjectTabs } from "@/components/projects/project-tabs";
import { SaveIndicator } from "@/components/workspace/save-indicator";
import { CITATION_STYLE_LABELS, type CitationStyle } from "@/lib/validation/project";

type WorkspaceHeaderProps = {
  projectId: string;
  title: string;
  citationStyle: CitationStyle;
  savedCount: number;
  saveStatus: "idle" | "saving" | "saved" | "error";
  wordCount: number;
};

export function WorkspaceHeader({
  projectId,
  title,
  citationStyle,
  savedCount,
  saveStatus,
  wordCount,
}: WorkspaceHeaderProps) {
  return (
    <header className="relative shrink-0 border-b border-white/10 bg-surface-dark px-4 py-4 sm:px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <Link
            href="/projects"
            className="text-xs text-on-dark-soft transition-colors hover:text-on-dark"
          >
            All projects
          </Link>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="truncate font-[family-name:var(--font-display)] text-2xl tracking-tight text-on-dark sm:text-[1.75rem]">
              {title}
            </h1>
            <span className="rounded-full bg-white/8 px-2.5 py-0.5 text-xs font-medium text-on-dark-soft">
              {CITATION_STYLE_LABELS[citationStyle]}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <SaveIndicator status={saveStatus} />
            <span className="text-xs text-on-dark-soft">
              {wordCount} {wordCount === 1 ? "word" : "words"}
            </span>
          </div>
        </div>
        <ProjectTabs projectId={projectId} savedCount={savedCount} variant="dark" />
      </div>
    </header>
  );
}
