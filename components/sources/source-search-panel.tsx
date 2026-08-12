"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ChannelResults } from "@/components/sources/channel-results";
import { ChannelTabs } from "@/components/sources/channel-tabs";
import { ProjectSourcesList } from "@/components/sources/project-sources-list";
import { SearchCommandBar } from "@/components/sources/search-command-bar";
import { SearchResultsSummary } from "@/components/sources/search-results-summary";
import {
  useAddProjectSources,
  useDeleteProjectSource,
  useProjectSearch,
  useProjectSources,
} from "@/hooks/use-project-sources";
import type { NormalizedSource } from "@/lib/api/sources";
import { SEARCH_CHANNELS, type SearchChannel } from "@/lib/search/types";

type SourceSearchPanelProps = {
  projectId: string;
  defaultQuery: string;
  autoSearch?: boolean;
  onSearchingChange?: (isSearching: boolean) => void;
};

export function SourceSearchPanel({
  projectId,
  defaultQuery,
  autoSearch = false,
  onSearchingChange,
}: SourceSearchPanelProps) {
  const [query, setQuery] = useState(defaultQuery);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeChannel, setActiveChannel] = useState<SearchChannel>("web");
  const [savingExternalId, setSavingExternalId] = useState<string | null>(null);
  const autoSearchTriggered = useRef(false);

  const { mutateAsync, isPending, data, isError, error } = useProjectSearch(projectId);
  const { data: savedSources = [], isLoading: isLoadingSources } = useProjectSources(projectId);
  const addSources = useAddProjectSources(projectId);
  const deleteSource = useDeleteProjectSource(projectId);

  useEffect(() => {
    onSearchingChange?.(isPending);
  }, [isPending, onSearchingChange]);

  const savedExternalIds = useMemo(
    () => new Set(savedSources.map((source) => source.externalId)),
    [savedSources],
  );

  const channelResults = useMemo(() => {
    return SEARCH_CHANNELS.map((channel) => data?.channels.find((item) => item.channel === channel));
  }, [data]);

  const activeResult = channelResults[SEARCH_CHANNELS.indexOf(activeChannel)];

  const runSearch = useCallback(
    async (searchQuery: string, options?: { skipCache?: boolean }) => {
      const trimmed = searchQuery.trim();
      if (trimmed.length < 3) {
        return;
      }

      setHasSearched(true);
      await mutateAsync({ query: trimmed, skipCache: options?.skipCache });
    },
    [mutateAsync],
  );

  useEffect(() => {
    if (!autoSearch || autoSearchTriggered.current || defaultQuery.trim().length < 3) {
      return;
    }

    autoSearchTriggered.current = true;
    setHasSearched(true);
    void mutateAsync({ query: defaultQuery.trim() });
  }, [autoSearch, defaultQuery, mutateAsync]);

  async function handleAdd(source: NormalizedSource) {
    setSavingExternalId(source.externalId);

    try {
      await addSources.mutateAsync([source]);
    } finally {
      setSavingExternalId(null);
    }
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(17rem,22rem)] xl:items-start">
      <div className="space-y-5">
        <SearchCommandBar
          query={query}
          onQueryChange={setQuery}
          onSearch={() => void runSearch(query)}
          isSearching={isPending}
          errorMessage={
            isError ? (error instanceof Error ? error.message : "Search failed.") : null
          }
        />

        {!hasSearched && !isPending ? (
          <div className="rounded-xl border border-dashed border-hairline bg-surface-soft px-6 py-12 text-center">
            <p className="text-sm leading-6 text-body">
              Search Sources to pull evidence from web pages, academic papers, and GitHub repositories.
            </p>
          </div>
        ) : null}

        {hasSearched && data && !isPending ? <SearchResultsSummary result={data} /> : null}

        {hasSearched || isPending ? (
          <div className="space-y-4">
            <ChannelTabs
              activeChannel={activeChannel}
              onChange={setActiveChannel}
              channelResults={channelResults}
              isLoading={isPending}
            />
            <ChannelResults
              channel={activeChannel}
              result={activeResult}
              isLoading={isPending}
              savedExternalIds={savedExternalIds}
              savingExternalId={savingExternalId}
              onAdd={(source) => void handleAdd(source)}
              onRetry={() => void runSearch(query, { skipCache: true })}
            />
          </div>
        ) : null}
      </div>

      <aside className="sticky top-24 overflow-hidden rounded-2xl bg-surface-dark shadow-[0_20px_50px_rgba(24,23,21,0.18)]">
        <div className="border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-primary" />
            <p className="font-mono text-xs text-on-dark-soft">Project library</p>
          </div>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-on-dark">
            Saved sources
          </h2>
          <p className="mt-1 text-sm text-on-dark-soft">
            {savedSources.length} ready for drafting
          </p>
        </div>
        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto p-4">
          <ProjectSourcesList
            sources={savedSources}
            isLoading={isLoadingSources}
            deletingSourceId={deleteSource.isPending ? (deleteSource.variables ?? null) : null}
            onDelete={(sourceId) => void deleteSource.mutateAsync(sourceId)}
          />
        </div>
      </aside>
    </div>
  );
}
