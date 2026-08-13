"use client";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

type SaveStatus = "idle" | "saving" | "saved" | "error";

type SaveIndicatorProps = {
  status: SaveStatus;
};

const LABELS: Record<SaveStatus, string> = {
  idle: "Draft",
  saving: "Saving",
  saved: "Saved",
  error: "Save failed",
};

export function SaveIndicator({ status }: SaveIndicatorProps) {
  const reduceMotion = useReducedMotion();
  const label = LABELS[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium",
        status === "idle" && "bg-white/5 text-on-dark-soft",
        status === "saving" && "bg-primary/15 text-primary",
        status === "saved" && "bg-[#5db8a6]/15 text-[#5db8a6]",
        status === "error" && "bg-destructive/15 text-destructive",
      )}
    >
      <motion.span
        aria-hidden
        className={cn(
          "size-1.5 rounded-full bg-current",
          status === "saved" && "bg-[#5db8a6]",
          status === "error" && "bg-destructive",
        )}
        animate={
          reduceMotion || status !== "saving"
            ? undefined
            : { opacity: [1, 0.35, 1], scale: [1, 0.85, 1] }
        }
        transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
      />
      {label}
    </span>
  );
}
