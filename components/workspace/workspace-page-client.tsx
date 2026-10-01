"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Editor } from "@tiptap/react";
import { TextSelection } from "@tiptap/pm/state";

import { ResearchEditor } from "@/components/editor/research-editor";
import { AssistantShell } from "@/components/workspace/assistant-shell";
import { CommentPanel } from "@/components/workspace/comment-panel";
import { DocumentOutline, scrollEditorToHeading } from "@/components/workspace/document-outline";
import { SourcePicker } from "@/components/workspace/source-picker";
import { WorkspaceHeader } from "@/components/workspace/workspace-header";
import { WorkspaceLayout } from "@/components/workspace/workspace-layout";
import { WorkspaceLoading } from "@/components/workspace/workspace-loading";
import { useEditorScrollSpy } from "@/hooks/use-editor-scroll-spy";
import {
  useCreateDocumentCitation,
  useProjectDocument,
  useUpdateSourceSelection,
} from "@/hooks/use-project-document";
import { useProjectSources } from "@/hooks/use-project-sources";
import { useProject } from "@/hooks/use-projects";
import type { CitationStyle } from "@/lib/validation/project";
import { sourceToCslJson } from "@/lib/citations/source-to-csl";
import {
  extractCommentsFromEditor,
  extractOutlineFromEditor,
} from "@/lib/editor/document-utils";
import { parseDraftBlockStart } from "@/lib/editor/word-stream";

type WorkspacePageClientProps = {
  projectId: string;
};

export function WorkspacePageClient({ projectId }: WorkspacePageClientProps) {
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [editor, setEditor] = useState<Editor | null>(null);
  const [outlineTick, setOutlineTick] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  const { data: project, isLoading: projectLoading, isError: projectError, error } = useProject(projectId);
  const { data: document, isLoading: documentLoading } = useProjectDocument(projectId);
  const { data: sources = [], isLoading: sourcesLoading } = useProjectSources(projectId);
  const updateSelection = useUpdateSourceSelection(projectId);
  const createCitation = useCreateDocumentCitation(projectId);

  const selectedIds = useMemo(
    () => sources.filter((source) => source.selected).map((source) => source.id),
    [sources],
  );

  const selectedSources = useMemo(
    () => sources.filter((source) => selectedIds.includes(source.id)),
    [selectedIds, sources],
  );

  const headings = useMemo(() => {
    void outlineTick;
    return extractOutlineFromEditor(editor);
  }, [editor, outlineTick]);

  const comments = useMemo(() => {
    void outlineTick;
    return extractCommentsFromEditor(editor);
  }, [editor, outlineTick]);

  const activeHeadingId = useEditorScrollSpy(editor, headings);

  useEffect(() => {
    if (!editor) {
      return;
    }

    const handleUpdate = () => setOutlineTick((value) => value + 1);
    editor.on("update", handleUpdate);
    editor.on("selectionUpdate", handleUpdate);

    return () => {
      editor.off("update", handleUpdate);
      editor.off("selectionUpdate", handleUpdate);
    };
  }, [editor]);

  const handleToggleSource = useCallback(
    (sourceId: string, checked: boolean) => {
      const next = checked
        ? [...new Set([...selectedIds, sourceId])]
        : selectedIds.filter((id) => id !== sourceId);

      updateSelection.mutate(next);
    },
    [selectedIds, updateSelection],
  );

  const handleAssistantCitation = useCallback(
    async (source: (typeof selectedSources)[number]) => {
      if (!editor) {
        throw new Error("The editor is not ready.");
      }

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
    },
    [createCitation, editor],
  );

  const handleBeginWriting = useCallback(
    (action: "draft_document" | "draft_section" | "rewrite_section") => {
      if (!editor || editor.isDestroyed) {
        throw new Error("The editor is not ready.");
      }

      const { from, to } = editor.state.selection;
      if (action === "rewrite_section" && from === to) {
        throw new Error("Select text in the editor before rewriting it.");
      }

      let insertionPosition: number | null = null;
      editor.setEditable(false);

      return {
        append(text: string) {
          if (editor.isDestroyed) return;
          const pieces = action === "draft_document"
            ? text.replace(/\r/g, "").split(/(\n)/)
            : [text.replace(/\s+/g, " ")];

          for (const part of pieces) {
            if (part === "\n") {
              insertionPosition = null;
              continue;
            }
            if (!part) continue;

            const transaction = editor.state.tr;
            let chunk = part;
            if (insertionPosition === null) {
              if (action === "rewrite_section") {
                transaction.insertText(chunk, from, to);
                insertionPosition = from + chunk.length;
              } else {
                const parsed = action === "draft_document"
                  ? parseDraftBlockStart(chunk)
                  : { level: null, text: chunk };
                const block = parsed.level
                  ? editor.schema.nodes.heading.create({ level: parsed.level })
                  : editor.schema.nodes.paragraph.create();
                transaction.insert(transaction.doc.content.size, block);
                insertionPosition = transaction.doc.content.size - 1;
                chunk = parsed.text;
                if (chunk) {
                  transaction.insertText(chunk, insertionPosition);
                  insertionPosition += chunk.length;
                }
              }
            } else {
              transaction.insertText(chunk, insertionPosition);
              insertionPosition += chunk.length;
            }
            transaction
              .setSelection(TextSelection.create(transaction.doc, insertionPosition))
              .scrollIntoView();
            editor.view.dispatch(transaction);
          }
        },
        finish() {
          if (!editor.isDestroyed) editor.setEditable(true);
        },
      };
    },
    [editor],
  );

  if (projectLoading || documentLoading || sourcesLoading) {
    return <WorkspaceLoading />;
  }

  if (projectError || !project) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-surface-dark px-6">
        <div className="max-w-md px-6 py-8 text-center ring-1 ring-destructive/30">
          <p className="text-sm text-destructive">
            {error instanceof Error ? error.message : "Unable to load workspace."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div id="main-content" className="flex h-[calc(100dvh-4rem)] flex-col bg-surface-dark">
      <WorkspaceHeader
        projectId={projectId}
        title={project.title}
        citationStyle={project.citationStyle as CitationStyle}
        savedCount={sources.length}
        saveStatus={saveStatus}
        wordCount={wordCount}
      />

      <WorkspaceLayout
        outline={
          <>
            <DocumentOutline
              headings={headings}
              activeHeadingId={activeHeadingId}
              onSelect={(heading) => {
                if (editor) {
                  scrollEditorToHeading(editor, heading.pos);
                }
              }}
            />
            <CommentPanel
              comments={comments}
              onSelect={(comment) => {
                if (editor) {
                  editor.chain().focus().setTextSelection({ from: comment.from, to: comment.to }).run();
                }
              }}
            />
          </>
        }
        editor={
          <ResearchEditor
            key={projectId}
            projectId={projectId}
            title={project.title}
            initialContent={document?.editorState ?? null}
            selectedSources={selectedSources}
            onSaveStatusChange={setSaveStatus}
            onEditorReady={setEditor}
            onWordCountChange={setWordCount}
            className="h-full"
          />
        }
        sourcePicker={
          <SourcePicker
            projectId={projectId}
            sources={sources}
            selectedIds={selectedIds}
            onToggle={handleToggleSource}
            isUpdating={updateSelection.isPending}
          />
        }
        assistant={
          <AssistantShell
            key={projectId}
            projectId={projectId}
            selectedSources={selectedSources}
            getEditorSelection={() => {
              if (!editor) {
                return "";
              }
              const { from, to } = editor.state.selection;
              return from === to ? "" : editor.state.doc.textBetween(from, to, "\n");
            }}
            onInsertCitation={handleAssistantCitation}
            onBeginWriting={handleBeginWriting}
          />
        }
      />
    </div>
  );
}
