"use client";

import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

import { ProjectHero } from "@/components/sources/project-hero";
import { SourceSearchPanel } from "@/components/sources/source-search-panel";
import { ProjectTabs } from "@/components/projects/project-tabs";
import { useProject } from "@/hooks/use-projects";
import { useProjectSources } from "@/hooks/use-project-sources";
import type { CitationStyle } from "@/lib/validation/project";

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const projectId = params.id;
  const autoSearch = searchParams.get("search") === "1";
  const [isSearching, setIsSearching] = useState(autoSearch);

  const { data: project, isLoading, isError, error } = useProject(projectId);
  const { data: savedSources = [] } = useProjectSources(projectId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-44 animate-pulse rounded-2xl bg-surface-soft" />
        <div className="h-16 animate-pulse rounded-2xl bg-surface-soft" />
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-8">
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : "Unable to load project."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ProjectTabs projectId={projectId} savedCount={savedSources.length} />

      <ProjectHero
        title={project.title}
        topic={project.topic}
        citationStyle={project.citationStyle as CitationStyle}
        savedCount={savedSources.length}
        isSearching={isSearching}
      />

      <SourceSearchPanel
        projectId={project.id}
        defaultQuery={project.topic}
        autoSearch={autoSearch}
        onSearchingChange={setIsSearching}
      />
    </div>
  );
}
