import { z } from "zod";

export const ASSISTANT_ACTIONS = [
  "draft_document",
  "summarize_source",
  "propose_outline",
  "draft_section",
  "rewrite_section",
  "insert_citation",
] as const;

export type AssistantAction = (typeof ASSISTANT_ACTIONS)[number];

export const ASSISTANT_ACTION_LABELS: Record<AssistantAction, string> = {
  draft_document: "Draft document",
  summarize_source: "Summarize source",
  propose_outline: "Propose outline",
  draft_section: "Draft section",
  rewrite_section: "Rewrite selection",
  insert_citation: "Insert citation",
};

const assistantMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  text: z.string().trim().min(1).max(8_000),
});

export const assistantRequestSchema = z.object({
  action: z.enum(ASSISTANT_ACTIONS),
  prompt: z.string().trim().max(6_000).default(""),
  sourceId: z.string().trim().optional(),
  editorSelection: z.string().trim().max(12_000).optional(),
  messages: z.array(assistantMessageSchema).max(20).default([]),
});

export type AssistantRequestInput = z.infer<typeof assistantRequestSchema>;
