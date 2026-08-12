import { z } from "zod";

import { SEARCH_CHANNELS } from "@/lib/search/types";

export const searchRequestSchema = z.object({
  query: z
    .string()
    .trim()
    .min(3, "Search query must be at least 3 characters")
    .max(200, "Search query must be at most 200 characters")
    .optional(),
  channels: z.array(z.enum(SEARCH_CHANNELS)).optional(),
});

export type SearchRequestInput = z.infer<typeof searchRequestSchema>;

export const addSourceSchema = z.object({
  title: z.string().trim().min(1),
  authors: z.array(z.string()).default([]),
  url: z.string().default(""),
  sourceType: z.enum(["web", "academic", "github", "manual"]),
  snippets: z.array(z.string()).default([]),
  credibilitySignals: z.record(z.string(), z.unknown()).default({}),
  externalId: z.string().trim().min(1),
});

export const addSourcesSchema = z.object({
  sources: z.array(addSourceSchema).min(1),
});

export type AddSourcesInput = z.infer<typeof addSourcesSchema>;

export const CHANNEL_LABELS = {
  web: "Web",
  academic: "Academic",
  github: "GitHub",
} as const;
