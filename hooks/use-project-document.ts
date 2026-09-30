import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createDocumentCitation,
  fetchProjectDocument,
  updateProjectDocument,
  updateSourceSelection,
} from "@/lib/api/document";
import type { UpdateDocumentInput } from "@/lib/validation/document";
import { sourceKeys } from "@/hooks/use-project-sources";

export const documentKeys = {
  detail: (projectId: string) => ["projects", projectId, "document"] as const,
};

export function useProjectDocument(projectId: string) {
  return useQuery({
    queryKey: documentKeys.detail(projectId),
    queryFn: () => fetchProjectDocument(projectId),
    enabled: Boolean(projectId),
  });
}

export function useUpdateProjectDocument(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateDocumentInput) => updateProjectDocument(projectId, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: documentKeys.detail(projectId) });
    },
  });
}

export function useCreateDocumentCitation(projectId: string) {
  return useMutation({
    mutationFn: (input: {
      sourceId: string;
      cslJson: Record<string, unknown>;
      range?: { from: number; to: number };
    }) => createDocumentCitation(projectId, input),
  });
}

export function useUpdateSourceSelection(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sourceIds: string[]) => updateSourceSelection(projectId, sourceIds),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: sourceKeys.all(projectId) });
    },
  });
}
