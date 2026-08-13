import type { JSONContent } from "@tiptap/core";

export function createDefaultDocumentContent(title: string): JSONContent {
  return {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [{ type: "text", text: title }],
      },
      {
        type: "paragraph",
        content: [],
      },
    ],
  };
}
