import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";

import { CitationChip } from "@/components/editor/extensions/citation-chip";
import { CommentMark } from "@/components/editor/extensions/comment-mark";

export function createEditorExtensions(placeholder = "Start writing your research draft…") {
  return [
    StarterKit.configure({
      heading: { levels: [1, 2, 3] },
      codeBlock: false,
    }),
    Placeholder.configure({ placeholder }),
    CitationChip,
    CommentMark,
  ];
}
