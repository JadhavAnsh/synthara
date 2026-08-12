"use client";

import { motion, useReducedMotion } from "motion/react";

import { DualPane } from "@/components/marketing/dual-pane";

const sources = [
  { title: "IPCC Sixth Assessment Report", meta: "2023 · gov" },
  { title: "Renewable transition pathways", meta: "Nature · 2024" },
];

export function WorkspaceMockup() {
  const reduceMotion = useReducedMotion();

  return (
    <>
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <motion.span
          className="size-2 rounded-full bg-primary"
          animate={reduceMotion ? undefined : { scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <p className="font-mono text-xs text-on-dark-soft">
          Renewable energy literature review
        </p>
      </div>

      <DualPane
        left={
          <>
            <p className="text-xs font-medium uppercase tracking-wider text-on-dark-soft">
              Sources
            </p>
            <ul className="mt-3 space-y-2">
              {sources.map((source, index) => (
                <motion.li
                  key={source.title}
                  className={
                    index === 0
                      ? "rounded-md border border-primary/40 bg-surface-dark-elevated p-3"
                      : "rounded-md border border-white/5 bg-surface-dark-soft/60 p-3"
                  }
                  whileHover={
                    reduceMotion
                      ? undefined
                      : {
                          borderColor: "rgba(204, 120, 92, 0.5)",
                          backgroundColor: "rgba(37, 35, 32, 0.9)",
                        }
                  }
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p className="text-xs leading-5 text-on-dark">{source.title}</p>
                  <p className="mt-1 font-mono text-xs text-on-dark-soft">
                    {source.meta}
                  </p>
                </motion.li>
              ))}
            </ul>
          </>
        }
        right={
          <>
            <p className="text-xs font-medium uppercase tracking-wider text-on-dark-soft">
              Document
            </p>
            <div className="mt-3 space-y-3">
              <p className="font-[family-name:var(--font-display)] text-lg leading-snug text-on-dark">
                Draft section
              </p>
              <p className="text-xs leading-6 text-on-dark-soft">
                Solar capacity is scaling faster than grid interconnection… This
                section summarizes the underlying drivers
              </p>
              <motion.div
                className="rounded-md border border-white/10 bg-surface-dark-soft p-3"
                whileHover={reduceMotion ? undefined : { scale: 1.01 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                <p className="font-mono text-xs leading-5 text-on-dark-soft">
                  <span className="text-[#5db8a6]">[1]</span> IEA, 2024. Renewables
                  report.
                  <br />
                  <span className="text-[#e8a55a]">Suggestion:</span> Add storage
                  cost trend from Nature.
                </p>
              </motion.div>
            </div>
          </>
        }
      />
    </>
  );
}
