import type {
  AggregatedSearchResult,
  ChannelSearchResult,
  NormalizedSource,
  SearchChannel,
} from "@/lib/search/types";
import type { AddSourcesInput, SearchRequestInput } from "@/lib/validation/search";
import { apiFetch } from "@/lib/api/client";

export type SourceSummary = {
  id: string;
  title: string;
  authors: string[];
  url: string;
  sourceType: string;
  snippets: string[];
  credibilitySignals: Record<string, unknown>;
  externalId: string;
  selected?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export async function searchProjectSources(projectId: string, input: SearchRequestInput = {}) {
  return apiFetch<AggregatedSearchResult>(`/api/projects/${projectId}/search`, {
    method: "POST",
    body: JSON.stringify(input),
    signal: AbortSignal.timeout(40_000),
  });
}

export async function fetchProjectSources(projectId: string) {
  const data = await apiFetch<{ sources: SourceSummary[] }>(`/api/projects/${projectId}/sources`);
  return data.sources;
}

export async function addProjectSources(projectId: string, sources: AddSourcesInput["sources"]) {
  const data = await apiFetch<{ sources: SourceSummary[] }>(`/api/projects/${projectId}/sources`, {
    method: "POST",
    body: JSON.stringify({ sources }),
  });

  return data.sources;
}

export async function deleteProjectSource(projectId: string, sourceId: string) {
  return apiFetch<{ success: boolean }>(`/api/projects/${projectId}/sources/${sourceId}`, {
    method: "DELETE",
  });
}

export type { AggregatedSearchResult, ChannelSearchResult, NormalizedSource, SearchChannel };
