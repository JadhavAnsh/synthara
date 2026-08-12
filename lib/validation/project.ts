import { z } from "zod";

export const CITATION_STYLES = ["ieee", "harvard"] as const;

export type CitationStyle = (typeof CITATION_STYLES)[number];

export const createProjectSchema = z.object({
  topic: z
    .string()
    .trim()
    .min(10, "Topic must be at least 10 characters")
    .max(300, "Topic must be at most 300 characters"),
  citationStyle: z.enum(CITATION_STYLES, {
    error: "Choose IEEE or Harvard citation style",
  }),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

export const CITATION_STYLE_LABELS: Record<CitationStyle, string> = {
  ieee: "IEEE",
  harvard: "Harvard",
};
