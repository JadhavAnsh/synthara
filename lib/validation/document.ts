import { z } from "zod";

const MAX_EDITOR_STATE_BYTES = 512_000;

export const updateDocumentSchema = z.object({
  editorState: z.record(z.string(), z.unknown()).nullable(),
});

export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;

export function validateEditorStateSize(editorState: unknown): boolean {
  try {
    return JSON.stringify(editorState).length <= MAX_EDITOR_STATE_BYTES;
  } catch {
    return false;
  }
}

export const updateSourceSelectionSchema = z.object({
  sourceIds: z.array(z.string().min(1)).max(100),
});

export type UpdateSourceSelectionInput = z.infer<typeof updateSourceSelectionSchema>;
