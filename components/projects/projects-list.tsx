"use client";

import Link from "next/link";

import { useProjects } from "@/hooks/use-projects";
import { Button } from "@/components/ui/button";
import {
  CITATION_STYLE_LABELS,
  type CitationStyle,
} from "@/lib/validation/project";
import { useAuthStore } from "@/stores/auth-store";

export function ProjectsList() {
  const session = useAuthStore((state) => state.session);
  const { data: projects, isLoading, isError, error } = useProjects();

  if (isLoading) {
    return (
      <p className="mt-10 text-sm text-muted-foreground">Loading your projects...</p>
    );
  }

  if (isError) {
    return (
      <p className="mt-10 text-sm text-destructive">
        {error instanceof Error ? error.message : "Unable to load projects."}
      </p>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Workspace</p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-ink">
            Research projects
          </h1>
          <p className="mt-2 text-sm text-body">Signed in as {session?.user.email}</p>
        </div>
        <Button render={<Link href="/projects/new" />}>New project</Button>
      </div>

      {!projects?.length ? (
        <div className="mt-12 rounded-lg border border-dashed border-hairline bg-surface-card p-10 text-center">
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-ink">
            No projects yet
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-body">
            Create your first research project with a topic and citation style.
            Phase 2 will add source discovery on top of this foundation.
          </p>
          <Button className="mt-6" render={<Link href="/projects/new" />}>
            Create project
          </Button>
        </div>
      ) : (
        <ul className="mt-10 grid gap-4">
          {projects.map((project) => (
            <li
              key={project.id}
              className="rounded-lg border border-hairline bg-surface-card p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {CITATION_STYLE_LABELS[project.citationStyle as CitationStyle]}
                  </p>
                  <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl text-ink">
                    {project.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-body">{project.topic}</p>
                </div>
                <span className="inline-flex w-fit rounded-full bg-surface-soft px-3 py-1 text-xs font-medium capitalize text-body-strong">
                  {project.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
