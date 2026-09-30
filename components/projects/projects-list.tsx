"use client";

import { ProjectCard } from "@/components/projects/project-card";
import { ProjectsEmptyState, ProjectsLoadingSkeleton } from "@/components/projects/projects-empty-state";
import { ProjectsHero } from "@/components/projects/projects-hero";
import { useProjects } from "@/hooks/use-projects";

export function ProjectsList() {
  const { data: projects, isLoading, isError, error } = useProjects();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <ProjectsHero projectCount={0} />
        <ProjectsLoadingSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-8">
        <ProjectsHero projectCount={0} />
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-8">
          <p className="text-sm text-destructive">
            {error instanceof Error ? error.message : "Unable to load projects."}
          </p>
        </div>
      </div>
    );
  }

  const projectCount = projects?.length ?? 0;

  return (
    <div className="space-y-8">
      <ProjectsHero projectCount={projectCount} />

      {!projectCount ? (
        <ProjectsEmptyState />
      ) : (
        <section aria-label="Your research projects">
          <ul className="grid gap-4">
            {(projects ?? []).map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
