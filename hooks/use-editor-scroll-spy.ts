"use client";

import type { Editor } from "@tiptap/react";
import { useEffect, useState } from "react";

import type { OutlineHeading } from "@/lib/editor/document-utils";

export function useEditorScrollSpy(
  editor: Editor | null,
  headings: OutlineHeading[],
  scrollRootSelector = "[data-editor-scroll-root]",
) {
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!editor || !headings.length) {
      setActiveHeadingId(null);
      return;
    }

    const scrollRoot =
      editor.view.dom.closest(scrollRootSelector) ??
      editor.view.dom.parentElement;

    if (!scrollRoot) {
      return;
    }

    const updateActiveHeading = () => {
      const rootRect = scrollRoot.getBoundingClientRect();
      const anchor = scrollRoot.scrollTop + 96;
      let nextId = headings[0]?.id ?? null;

      for (const heading of headings) {
        const coords = editor.view.coordsAtPos(heading.pos + 1);
        const relativeTop = coords.top - rootRect.top + scrollRoot.scrollTop;

        if (relativeTop <= anchor) {
          nextId = heading.id;
        }
      }

      setActiveHeadingId(nextId);
    };

    updateActiveHeading();
    scrollRoot.addEventListener("scroll", updateActiveHeading, { passive: true });
    editor.on("update", updateActiveHeading);
    editor.on("selectionUpdate", updateActiveHeading);

    return () => {
      scrollRoot.removeEventListener("scroll", updateActiveHeading);
      editor.off("update", updateActiveHeading);
      editor.off("selectionUpdate", updateActiveHeading);
    };
  }, [editor, headings, scrollRootSelector]);

  return activeHeadingId;
}
