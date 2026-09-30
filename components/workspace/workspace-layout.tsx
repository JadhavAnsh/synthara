"use client";

import { useState, type ReactNode } from "react";
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
  const [view, setView] = useState("write");

  return (
    <motion.div
      className="workspace-root flex min-h-0 flex-1 flex-col bg-surface-dark"
      data-view={view}
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
    >
      <nav aria-label="Workspace views" className="workspace-mobile-nav shrink-0 gap-1 border-b border-white/10 p-2">
        {[["write", "Writing"], ["sources", "Sources"], ["assistant", "Assistant"]].map(([id, label]) => (
          <button key={id} type="button" aria-pressed={view === id} onClick={() => setView(id)} className={`flex-1 rounded-md px-3 py-3 text-sm ${view === id ? "bg-canvas text-ink" : "text-on-dark-soft hover:bg-white/10"}`}>{label}</button>
        ))}
      </nav>
      <ResizablePanelGroup orientation="horizontal" className="workspace-panels min-h-0 flex-1">
        <ResizablePanel className="workspace-writing" defaultSize={68} minSize={45}>
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

        <ResizablePanel className="workspace-tools" defaultSize={32} minSize={24}>
          <div className="flex h-full min-h-0 flex-col border-l border-white/10">
            <div className="workspace-sources max-h-[40%] shrink-0 overflow-y-auto border-b border-white/10 bg-surface-dark-elevated p-4 max-md:max-h-none">
              {sourcePicker}
            </div>
            <div className="workspace-assistant min-h-0 flex-1">{assistant}</div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </motion.div>
  );
}
