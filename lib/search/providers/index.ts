export { academicProvider } from "@/lib/search/providers/academic";
export { githubProvider } from "@/lib/search/providers/github";
export { tavilyProvider } from "@/lib/search/providers/tavily";

import { academicProvider } from "@/lib/search/providers/academic";
import { githubProvider } from "@/lib/search/providers/github";
import { tavilyProvider } from "@/lib/search/providers/tavily";
import type { SearchChannel, SearchProvider } from "@/lib/search/types";

export const searchProviders: Record<SearchChannel, SearchProvider> = {
  web: tavilyProvider,
  academic: academicProvider,
  github: githubProvider,
};

export function getSearchProvider(channel: SearchChannel) {
  return searchProviders[channel];
}
