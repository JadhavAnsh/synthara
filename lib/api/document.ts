import { apiFetch } from "@/lib/api/client";
import type { UpdateDocumentInput } from "@/lib/validation/document";

export type DocumentSummary = {
  id: string;
  citationStyle: string;
  editorState: Record<string, unknown> | null;
  exportStatus: string;
  updatedAt?: string;
};

export type CitationSummary = {
  id: string;
  sourceId: string;
  label: string;
  range: { from: number; to: number };
};

export async function fetchProjectDocument(projectId: string) {
  const data = await apiFetch<{ document: DocumentSummary }>(
    `/api/projects/${projectId}/document`,
  );
  return data.document;
}

export async function updateProjectDocument(projectId: string, input: UpdateDocumentInput) {
  const data = await apiFetch<{ document: DocumentSummary }>(
    `/api/projects/${projectId}/document`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
  return data.document;
}

export async function createDocumentCitation(
  projectId: string,
  input: { sourceId: string; cslJson: Record<string, unknown>; range?: { from: number; to: number } },
) {
  const data = await apiFetch<{ citation: CitationSummary }>(
    `/api/projects/${projectId}/document`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
  return data.citation;
}

export async function updateSourceSelection(projectId: string, sourceIds: string[]) {
  const data = await apiFetch<{ sources: import("@/lib/api/sources").SourceSummary[] }>(
    `/api/projects/${projectId}/sources/selection`,
    {
      method: "PATCH",
      body: JSON.stringify({ sourceIds }),
    },
  );
  return data.sources;
}
