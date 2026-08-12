"use client";

import { motion, useReducedMotion } from "motion/react";

import { HugeiconsIcon } from "@hugeicons/react";
import { SearchIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SearchCommandBarProps = {
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
  isSearching: boolean;
  errorMessage?: string | null;
};

export function SearchCommandBar({
  query,
  onQueryChange,
  onSearch,
  isSearching,
  errorMessage,
}: SearchCommandBarProps) {
  const reduceMotion = useReducedMotion();
  const canSearch = query.trim().length >= 3;

  return (
    <div className="overflow-hidden rounded-2xl border border-hairline bg-canvas shadow-[0_8px_30px_rgba(20,20,19,0.04)]">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:p-5">
        <div className="relative min-w-0 flex-1">
          <HugeiconsIcon
            icon={SearchIcon}
            strokeWidth={1.75}
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id="search-query"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Refine your search across web, papers, and repositories"
            className="h-12 border-hairline bg-surface-soft pl-10 text-base shadow-none"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                onSearch();
              }
            }}
          />
        </div>
        <Button
          type="button"
          size="lg"
          disabled={isSearching || !canSearch}
          onClick={onSearch}
          className="h-12 shrink-0 px-6"
        >
          {isSearching ? "Searching…" : "Search Sources"}
        </Button>
      </div>

      {isSearching ? (
        <div className="relative h-0.5 overflow-hidden bg-hairline">
          {reduceMotion ? (
            <div className="h-full w-1/3 bg-primary" />
          ) : (
            <motion.div
              className="absolute inset-y-0 w-1/3 bg-primary"
              animate={{ x: ["-100%", "400%"] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </div>
      ) : null}

      {isSearching ? (
        <p className="border-t border-hairline px-5 py-3 text-xs text-muted-foreground">
          Fanning out to web, academic, and GitHub channels — usually under 30 seconds.
        </p>
      ) : null}

      {errorMessage ? (
        <p className="border-t border-destructive/20 bg-destructive/5 px-5 py-3 text-sm text-destructive">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
