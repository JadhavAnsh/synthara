import { apiFetch } from "@/lib/api/client";
import type { CreateProjectInput } from "@/lib/validation/project";

export type ProjectSummary = {
  id: string;
  topic: string;
  title: string;
  citationStyle: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type ProjectsResponse = {
  projects: ProjectSummary[];
};

type CreateProjectResponse = {
  project: ProjectSummary;
};

export async function fetchProjects() {
  const data = await apiFetch<ProjectsResponse>("/api/projects");
  return data.projects;
}

export async function createProject(input: CreateProjectInput) {
  const data = await apiFetch<CreateProjectResponse>("/api/projects", {
    method: "POST",
    body: JSON.stringify(input),
  });

  return data.project;
}

export async function fetchProject(id: string) {
  const data = await apiFetch<{ project: ProjectSummary }>(`/api/projects/${id}`);
  return data.project;
}
