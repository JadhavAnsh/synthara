"use client";

import { motion, useReducedMotion } from "motion/react";

import type { DocumentComment } from "@/lib/editor/document-utils";
import { cn } from "@/lib/utils";

type CommentPanelProps = {
  comments: DocumentComment[];
  onSelect: (comment: DocumentComment) => void;
};

export function CommentPanel({ comments, onSelect }: CommentPanelProps) {
  const reduceMotion = useReducedMotion();
  const openComments = comments.filter((comment) => !comment.resolved);

  if (!openComments.length) {
    return (
      <div className="border-t border-white/10 px-4 py-4 text-xs leading-5 text-on-dark-soft">
        Select text in the draft, then add a note from the toolbar.
      </div>
    );
  }

  return (
    <div className="border-t border-white/10">
      <p className="px-4 pt-4 text-xs font-medium uppercase tracking-wide text-on-dark-soft">
        Comments ({openComments.length})
      </p>
      <ul className="max-h-44 space-y-1.5 overflow-y-auto px-2 py-3">
        {openComments.map((comment, index) => (
          <motion.li
            key={comment.commentId}
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30, delay: index * 0.04 }}
          >
            <button
              type="button"
              onClick={() => onSelect(comment)}
              className={cn(
                "w-full px-3 py-2.5 text-left transition-colors hover:bg-[#e8a55a]/12",
              )}
            >
              <p className="line-clamp-2 text-xs font-medium text-on-dark">{comment.text}</p>
              <p className="mt-1 line-clamp-1 text-xs text-on-dark-soft">
                &ldquo;{comment.excerpt}&rdquo;
              </p>
            </button>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
