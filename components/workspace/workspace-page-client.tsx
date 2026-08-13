"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Editor } from "@tiptap/react";

import { ResearchEditor } from "@/components/editor/research-editor";
import { AssistantShell } from "@/components/workspace/assistant-shell";
import { CommentPanel } from "@/components/workspace/comment-panel";
import { DocumentOutline, scrollEditorToHeading } from "@/components/workspace/document-outline";
import { SourcePicker } from "@/components/workspace/source-picker";
import { WorkspaceHeader } from "@/components/workspace/workspace-header";
import { WorkspaceLayout } from "@/components/workspace/workspace-layout";
import { WorkspaceLoading } from "@/components/workspace/workspace-loading";
import { useEditorScrollSpy } from "@/hooks/use-editor-scroll-spy";
import { useProjectDocument, useUpdateSourceSelection } from "@/hooks/use-project-document";
import { useProjectSources } from "@/hooks/use-project-sources";
import { useProject } from "@/hooks/use-projects";
import type { CitationStyle } from "@/lib/validation/project";
import {
  extractCommentsFromEditor,
  extractOutlineFromEditor,
} from "@/lib/editor/document-utils";

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
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-surface-dark">
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
        assistant={<AssistantShell projectId={projectId} selectedCount={selectedIds.length} />}
      />
    </div>
  );
}
