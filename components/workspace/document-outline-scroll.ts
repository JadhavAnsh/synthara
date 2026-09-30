import type { Editor } from "@tiptap/react";

export function scrollEditorToHeading(editor: Editor, pos: number) {
  editor.chain().focus().setTextSelection(pos + 1).scrollIntoView().run();
}
