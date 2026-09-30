"use client";

import { motion, useReducedMotion } from "motion/react";

import type { OutlineHeading } from "@/lib/editor/document-utils";
import { cn } from "@/lib/utils";

type DocumentOutlineProps = {
  headings: OutlineHeading[];
  activeHeadingId: string | null;
  onSelect: (heading: OutlineHeading) => void;
};

export function DocumentOutline({ headings, activeHeadingId, onSelect }: DocumentOutlineProps) {
  const reduceMotion = useReducedMotion();

  if (!headings.length) {
    return (
      <div className="px-4 py-4 text-xs leading-5 text-on-dark-soft">
        Add H1–H3 headings to build a live outline as you write.
      </div>
    );
  }

  return (
    <nav aria-label="Document outline" className="relative space-y-0.5 px-2 py-3">
      {headings.map((heading) => {
        const isActive = heading.id === activeHeadingId;

        return (
          <button
            key={heading.id}
            type="button"
            onClick={() => onSelect(heading)}
            className={cn(
              "relative block w-full truncate rounded-md px-3 py-2 text-left text-xs transition-colors",
              heading.level === 1 && "font-medium",
              heading.level === 2 && "pl-5",
              heading.level === 3 && "pl-7",
              isActive
                ? "bg-primary/15 text-primary"
                : "text-on-dark-soft hover:bg-white/6 hover:text-on-dark",
            )}
          >
            {isActive ? (
              <motion.span
                layoutId={reduceMotion ? undefined : "outline-active"}
                className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            ) : null}
            {heading.text}
          </button>
        );
      })}
    </nav>
  );
}

export { scrollEditorToHeading } from "@/components/workspace/document-outline-scroll";
