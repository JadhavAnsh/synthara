import { Node, mergeAttributes } from "@tiptap/core";

export type CitationChipOptions = {
  HTMLAttributes: Record<string, string>;
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    citationChip: {
      insertCitationChip: (attrs: {
        citationId: string;
        sourceId: string;
        label: string;
      }) => ReturnType;
    };
  }
}

export const CitationChip = Node.create<CitationChipOptions>({
  name: "citationChip",
  group: "inline",
  inline: true,
  atom: true,
  selectable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      citationId: { default: null },
      sourceId: { default: null },
      label: { default: "[?]" },
    };
  },

  parseHTML() {
    return [{ tag: 'span[data-type="citation-chip"]' }];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": "citation-chip",
        "data-citation-id": node.attrs.citationId,
        "data-source-id": node.attrs.sourceId,
        class: "citation-chip",
      }),
      node.attrs.label,
    ];
  },

  addCommands() {
    return {
      insertCitationChip:
        (attrs) =>
        ({ chain }) =>
          chain()
            .insertContent({
              type: this.name,
              attrs,
            })
            .run(),
    };
  },
});
