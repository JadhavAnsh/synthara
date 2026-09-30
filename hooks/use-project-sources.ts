import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  addProjectSources,
  deleteProjectSource,
  fetchProjectSources,
  searchProjectSources,
  type NormalizedSource,
} from "@/lib/api/sources";
import type { SearchRequestInput } from "@/lib/validation/search";
import { projectKeys } from "@/hooks/use-projects";

export const sourceKeys = {
  all: (projectId: string) => ["projects", projectId, "sources"] as const,
  search: (projectId: string, query: string) =>
    ["projects", projectId, "search", query] as const,
};

export function useProjectSources(projectId: string) {
  return useQuery({
    queryKey: sourceKeys.all(projectId),
    queryFn: () => fetchProjectSources(projectId),
    enabled: Boolean(projectId),
  });
}

export function useProjectSearch(projectId: string) {
  return useMutation({
    mutationFn: (input: SearchRequestInput) => searchProjectSources(projectId, input),
  });
}

export function useAddProjectSources(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sources: NormalizedSource[]) => addProjectSources(projectId, sources),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: sourceKeys.all(projectId) });
      await queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) });
    },
  });
}

export function useDeleteProjectSource(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sourceId: string) => deleteProjectSource(projectId, sourceId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: sourceKeys.all(projectId) });
    },
  });
}
