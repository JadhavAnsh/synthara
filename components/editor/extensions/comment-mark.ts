import { Mark, mergeAttributes } from "@tiptap/core";

export type CommentMarkOptions = {
  HTMLAttributes: Record<string, string>;
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    commentMark: {
      setComment: (attrs: {
        commentId: string;
        text: string;
        createdAt: string;
        resolved: boolean;
      }) => ReturnType;
      unsetComment: () => ReturnType;
    };
  }
}

export const CommentMark = Mark.create<CommentMarkOptions>({
  name: "commentMark",
  inclusive: false,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      commentId: { default: null },
      text: { default: "" },
      createdAt: { default: null },
      resolved: { default: false },
    };
  },

  parseHTML() {
    return [{ tag: "mark[data-type='comment']" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "mark",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": "comment",
        class: "comment-mark",
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setComment:
        (attrs) =>
        ({ chain }) =>
          chain().setMark(this.name, attrs).run(),
      unsetComment:
        () =>
        ({ chain }) =>
          chain().unsetMark(this.name).run(),
    };
  },
});
