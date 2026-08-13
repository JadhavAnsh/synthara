"use client";

import { motion, useReducedMotion } from "motion/react";

export function WorkspaceLoading() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-surface-dark">
      <div className="border-b border-white/10 px-6 py-5">
        <div className="h-3 w-24 rounded bg-white/8" />
        <div className="mt-4 h-8 w-2/3 max-w-md rounded bg-white/10" />
        <div className="mt-3 h-6 w-32 rounded-full bg-white/8" />
      </div>
      <div className="flex min-h-0 flex-1 gap-0">
        <div className="hidden w-52 border-r border-white/10 bg-surface-dark-soft/50 lg:block">
          <div className="space-y-2 p-4">
            {[0, 1, 2, 3].map((item) => (
              <motion.div
                key={item}
                className="h-7 rounded bg-white/6"
                animate={reduceMotion ? undefined : { opacity: [0.45, 0.9, 0.45] }}
                transition={{ duration: 1.6, repeat: Infinity, delay: item * 0.12, ease: "easeInOut" }}
              />
            ))}
          </div>
        </div>
        <div className="flex-1 p-4">
          <motion.div
            className="h-full bg-surface-dark-elevated"
            animate={reduceMotion ? undefined : { opacity: [0.55, 0.85, 0.55] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  );
}
