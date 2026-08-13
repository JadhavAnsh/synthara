"use client";

import type { Editor } from "@tiptap/react";
import { useState } from "react";

import type { SourceSummary } from "@/lib/api/sources";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type EditorToolbarProps = {
  editor: Editor;
  selectedSources: SourceSummary[];
  onInsertCitation: (source: SourceSummary) => void;
  onAddComment: (text: string) => void;
  isCitationPending: boolean;
};

export function EditorToolbar({
  editor,
  selectedSources,
  onInsertCitation,
  onAddComment,
  isCitationPending,
}: EditorToolbarProps) {
  const [commentDraft, setCommentDraft] = useState("");
  const hasSelection = editor.state.selection.from !== editor.state.selection.to;

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-white/10 bg-surface-dark-soft/90 px-4 py-2.5 backdrop-blur-sm">
      <div className="flex items-center gap-1">
        {[1, 2, 3].map((level) => (
          <Button
            key={level}
            type="button"
            size="sm"
            variant={editor.isActive("heading", { level }) ? "default" : "outline"}
            className={cn(
              "h-8 min-w-8 px-2 font-mono text-xs",
              !editor.isActive("heading", { level }) &&
                "border-white/10 bg-white/5 text-on-dark-soft hover:bg-white/10 hover:text-on-dark",
            )}
            onClick={() => editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 }).run()}
          >
            H{level}
          </Button>
        ))}
      </div>

      <div className="mx-1 h-5 w-px bg-white/10" />

      <Button
        type="button"
        size="sm"
        variant={editor.isActive("bold") ? "default" : "outline"}
        className={cn(
          "h-8 px-2.5 text-xs",
          !editor.isActive("bold") &&
            "border-white/10 bg-white/5 text-on-dark-soft hover:bg-white/10 hover:text-on-dark",
        )}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        Bold
      </Button>
      <Button
        type="button"
        size="sm"
        variant={editor.isActive("italic") ? "default" : "outline"}
        className={cn(
          "h-8 px-2.5 text-xs",
          !editor.isActive("italic") &&
            "border-white/10 bg-white/5 text-on-dark-soft hover:bg-white/10 hover:text-on-dark",
        )}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        Italic
      </Button>

      <div className="mx-1 h-5 w-px bg-white/10" />

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={!selectedSources.length || isCitationPending}
              className="h-8 border-primary/30 bg-primary/10 text-xs text-primary hover:bg-primary/15"
            />
          }
        >
          {isCitationPending ? "Inserting…" : "Insert citation"}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="max-w-sm">
          {selectedSources.map((source) => (
            <DropdownMenuItem key={source.id} onClick={() => onInsertCitation(source)}>
              <span className="line-clamp-2 text-sm">{source.title}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="ml-auto flex items-center gap-2">
        <input
          type="text"
          value={commentDraft}
          onChange={(event) => setCommentDraft(event.target.value)}
          placeholder={hasSelection ? "Note on selection…" : "Select text first…"}
          disabled={!hasSelection}
          className="h-8 w-40 rounded-md border border-white/10 bg-white/5 px-2.5 text-xs text-on-dark placeholder:text-on-dark-soft disabled:opacity-50 sm:w-52"
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={!hasSelection || !commentDraft.trim()}
          className="h-8 border-white/10 bg-white/5 text-xs text-on-dark-soft hover:bg-white/10 hover:text-on-dark"
          onClick={() => {
            onAddComment(commentDraft);
            setCommentDraft("");
          }}
        >
          Add note
        </Button>
      </div>
    </div>
  );
}
