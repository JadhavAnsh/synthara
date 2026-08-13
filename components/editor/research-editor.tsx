"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";

import { EditorToolbar } from "@/components/editor/editor-toolbar";
import { createEditorExtensions } from "@/components/editor/extensions";
import type { SourceSummary } from "@/lib/api/sources";
import { sourceToCslJson } from "@/lib/citations/source-to-csl";
import { createDefaultDocumentContent } from "@/lib/editor/default-content";
import { useCreateDocumentCitation, useUpdateProjectDocument } from "@/hooks/use-project-document";
import { cn } from "@/lib/utils";

type ResearchEditorProps = {
  projectId: string;
  title: string;
  initialContent: Record<string, unknown> | null;
  selectedSources: SourceSummary[];
  onSaveStatusChange?: (status: "idle" | "saving" | "saved" | "error") => void;
  onEditorReady?: (editor: ReturnType<typeof useEditor>) => void;
  onWordCountChange?: (count: number) => void;
  className?: string;
};

const editorProseClass =
  "prose prose-invert max-w-none min-h-[480px] px-8 py-7 focus:outline-none text-on-dark prose-headings:text-on-dark prose-p:text-on-dark-soft prose-strong:text-on-dark [&_h1]:font-[family-name:var(--font-display)] [&_h1]:text-3xl [&_h1]:tracking-tight [&_h1]:text-on-dark [&_h2]:font-[family-name:var(--font-display)] [&_h2]:text-2xl [&_h2]:text-on-dark [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-on-dark [&_.citation-chip]:inline-flex [&_.citation-chip]:bg-primary/18 [&_.citation-chip]:px-1.5 [&_.citation-chip]:py-0.5 [&_.citation-chip]:font-mono [&_.citation-chip]:text-xs [&_.citation-chip]:text-primary [&_.citation-chip-enter]:animate-citation-pop [&_.comment-mark]:bg-[#e8a55a]/18 [&_.comment-mark]:underline [&_.comment-mark]:decoration-[#e8a55a] [&_.comment-mark]:decoration-dashed [&_.comment-mark]:underline-offset-4 [&_.is-empty:before]:text-on-dark-soft";

function pulseCitationChip(editor: NonNullable<ReturnType<typeof useEditor>>) {
  requestAnimationFrame(() => {
    const chips = editor.view.dom.querySelectorAll('[data-type="citation-chip"]');
    const lastChip = chips[chips.length - 1];
    lastChip?.classList.add("citation-chip-enter");
    window.setTimeout(() => lastChip?.classList.remove("citation-chip-enter"), 450);
  });
}

export function ResearchEditor({
  projectId,
  title,
  initialContent,
  selectedSources,
  onSaveStatusChange,
  onEditorReady,
  onWordCountChange,
  className,
}: ResearchEditorProps) {
  const saveTimeoutRef = useRef<number | null>(null);
  const hasSeededRef = useRef(false);
  const [isReady, setIsReady] = useState(false);

  const updateDocument = useUpdateProjectDocument(projectId);
  const createCitation = useCreateDocumentCitation(projectId);

  const extensions = useMemo(() => createEditorExtensions("Begin your research draft…"), []);

  const reportWordCount = useCallback(
    (currentEditor: NonNullable<ReturnType<typeof useEditor>>) => {
      onWordCountChange?.(
        currentEditor.getText().trim().split(/\s+/).filter(Boolean).length,
      );
    },
    [onWordCountChange],
  );

  const editor = useEditor({
    extensions,
    content: initialContent ?? createDefaultDocumentContent(title),
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: editorProseClass,
        spellcheck: "true",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      if (!hasSeededRef.current) {
        return;
      }

      reportWordCount(currentEditor);
      onSaveStatusChange?.("saving");

      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = window.setTimeout(async () => {
        try {
          await updateDocument.mutateAsync({
            editorState: currentEditor.getJSON() as Record<string, unknown>,
          });
          onSaveStatusChange?.("saved");
        } catch {
          onSaveStatusChange?.("error");
        }
      }, 800);
    },
  });

  useEffect(() => {
    if (!editor || hasSeededRef.current) {
      return;
    }

    if (initialContent) {
      editor.commands.setContent(initialContent);
    } else {
      editor.commands.setContent(createDefaultDocumentContent(title));
    }

    hasSeededRef.current = true;
    setIsReady(true);
    reportWordCount(editor);
    onEditorReady?.(editor);
  }, [editor, initialContent, onEditorReady, reportWordCount, title]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const handleInsertCitation = useCallback(
    async (source: SourceSummary) => {
      if (!editor) {
        return;
      }

      try {
        const citation = await createCitation.mutateAsync({
          sourceId: source.id,
          cslJson: sourceToCslJson(source),
          range: { from: editor.state.selection.from, to: editor.state.selection.to },
        });

        editor
          .chain()
          .focus()
          .insertCitationChip({
            citationId: citation.id,
            sourceId: source.id,
            label: citation.label,
          })
          .run();

        pulseCitationChip(editor);
      } catch {
        onSaveStatusChange?.("error");
      }
    },
    [createCitation, editor, onSaveStatusChange],
  );

  const handleAddComment = useCallback(
    (text: string) => {
      if (!editor || !text.trim()) {
        return;
      }

      const { from, to } = editor.state.selection;
      if (from === to) {
        return;
      }

      const commentId = crypto.randomUUID();
      editor
        .chain()
        .focus()
        .setComment({
          commentId,
          text: text.trim(),
          createdAt: new Date().toISOString(),
          resolved: false,
        })
        .run();
    },
    [editor],
  );

  if (!editor) {
    return <div className="h-full animate-pulse bg-surface-dark-elevated" />;
  }

  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden bg-surface-dark-elevated shadow-[0_24px_80px_rgba(0,0,0,0.35)] ring-1 ring-white/10",
        className,
      )}
    >
      <EditorToolbar
        editor={editor}
        selectedSources={selectedSources}
        onInsertCitation={handleInsertCitation}
        onAddComment={handleAddComment}
        isCitationPending={createCitation.isPending}
      />
      <div className="min-h-0 flex-1 overflow-y-auto" data-editor-scroll-root>
        {isReady ? <EditorContent editor={editor} /> : null}
      </div>
    </div>
  );
}
