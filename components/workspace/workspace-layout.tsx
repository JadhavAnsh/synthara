"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

type WorkspaceLayoutProps = {
  outline: ReactNode;
  editor: ReactNode;
  sourcePicker: ReactNode;
  assistant: ReactNode;
};

export function WorkspaceLayout({
  outline,
  editor,
  sourcePicker,
  assistant,
}: WorkspaceLayoutProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="flex min-h-0 flex-1 flex-col bg-surface-dark"
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
    >
      <ResizablePanelGroup orientation="horizontal" className="min-h-0 flex-1">
        <ResizablePanel defaultSize={68} minSize={45}>
          <div className="flex h-full min-h-0">
            <aside className="hidden w-56 shrink-0 overflow-y-auto border-r border-white/10 bg-surface-dark-soft/80 lg:block">
              <p className="px-4 pt-5 text-xs font-medium uppercase tracking-wide text-on-dark-soft">
                Outline
              </p>
              {outline}
            </aside>
            <div className="min-w-0 flex-1 p-3 sm:p-4 lg:p-5">{editor}</div>
          </div>
        </ResizablePanel>

        <ResizableHandle
          withHandle
          className="bg-white/10 after:bg-white/10 data-[panel-group-direction=horizontal]:w-px"
        />

        <ResizablePanel defaultSize={32} minSize={24}>
          <div className="flex h-full min-h-0 flex-col border-l border-white/10">
            <div className="shrink-0 border-b border-white/10 bg-surface-dark-elevated/80 p-4 backdrop-blur-sm">
              {sourcePicker}
            </div>
            <div className="min-h-0 flex-1">{assistant}</div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </motion.div>
  );
}
