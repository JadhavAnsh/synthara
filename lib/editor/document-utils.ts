import type { Editor } from "@tiptap/react";

export type OutlineHeading = {
  id: string;
  level: number;
  text: string;
  pos: number;
};

export function extractOutlineFromEditor(editor: Editor | null): OutlineHeading[] {
  if (!editor) {
    return [];
  }

  const headings: OutlineHeading[] = [];

  editor.state.doc.descendants((node, pos) => {
    if (node.type.name !== "heading") {
      return;
    }

    const text = node.textContent.trim();
    if (!text) {
      return;
    }

    headings.push({
      id: `heading-${headings.length}-${node.attrs.level}`,
      level: node.attrs.level as number,
      text,
      pos,
    });
  });

  return headings;
}

export type DocumentComment = {
  commentId: string;
  text: string;
  createdAt: string;
  resolved: boolean;
  from: number;
  to: number;
  excerpt: string;
};

export function extractCommentsFromEditor(editor: Editor | null): DocumentComment[] {
  if (!editor) {
    return [];
  }

  const comments: DocumentComment[] = [];
  const seen = new Set<string>();

  editor.state.doc.descendants((node, pos) => {
    if (!node.isText) {
      return;
    }

    for (const mark of node.marks) {
      if (mark.type.name !== "commentMark") {
        continue;
      }

      const commentId = mark.attrs.commentId as string;
      if (!commentId || seen.has(commentId)) {
        continue;
      }

      seen.add(commentId);
      const from = pos;
      const to = pos + node.nodeSize;

      comments.push({
        commentId,
        text: mark.attrs.text as string,
        createdAt: mark.attrs.createdAt as string,
        resolved: Boolean(mark.attrs.resolved),
        from,
        to,
        excerpt: editor.state.doc.textBetween(from, to, " "),
      });
    }
  });

  return comments;
}
