"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { DualPane } from "@/components/marketing/dual-pane";

const sources = [
  { title: "Attention is all you need", meta: "Vaswani et al. · 2017" },
  { title: "BERT: Pre-training of deep bidirectional transformers", meta: "Devlin et al. · 2019" },
];

export function WorkspaceMockup() {
  const reduceMotion = useReducedMotion();
  const [activeSource, setActiveSource] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;

    const id = window.setInterval(() => {
      setActiveSource((current) => (current + 1) % sources.length);
    }, 4000);

    return () => window.clearInterval(id);
  }, [reduceMotion]);

  return (
    <>
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <motion.span
            aria-hidden
            className="size-2 shrink-0 rounded-full bg-primary"
            animate={reduceMotion ? undefined : { scale: [1, 1.25, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <p className="truncate font-mono text-xs text-on-dark-soft">
            NLP survey · draft in progress
          </p>
        </div>
        <div className="flex shrink-0 gap-1.5">
          {["IEEE", "Harvard"].map((style, index) => (
            <motion.span
              key={style}
              className={
                index === 0
                  ? "rounded border border-primary/40 bg-primary/10 px-2 py-0.5 font-mono text-xs text-on-dark"
                  : "rounded border border-white/10 px-2 py-0.5 font-mono text-xs text-on-dark-soft"
              }
              whileHover={reduceMotion ? undefined : { scale: 1.04 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
            >
              {style}
            </motion.span>
          ))}
        </div>
      </div>

      <DualPane
        left={
          <>
            <p className="text-xs font-medium uppercase tracking-wider text-on-dark-soft">
              Sources
            </p>
            <ul className="mt-3 space-y-2">
              {sources.map((source, index) => {
                const isActive = index === activeSource;

                return (
                  <motion.li
                    key={source.title}
                    layout
                    className={
                      isActive
                        ? "rounded-md border border-primary/40 bg-surface-dark-elevated p-3"
                        : "rounded-md border border-white/5 bg-surface-dark-soft/60 p-3"
                    }
                    animate={
                      reduceMotion
                        ? undefined
                        : isActive
                          ? {
                              borderColor: "rgba(204, 120, 92, 0.55)",
                              backgroundColor: "rgba(37, 35, 32, 0.95)",
                            }
                          : {
                              borderColor: "rgba(255, 255, 255, 0.05)",
                              backgroundColor: "rgba(31, 30, 27, 0.6)",
                            }
                    }
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={
                      reduceMotion
                        ? undefined
                        : {
                            borderColor: "rgba(204, 120, 92, 0.5)",
                            backgroundColor: "rgba(37, 35, 32, 0.9)",
                            y: -1,
                          }
                    }
                  >
                    <p className="text-xs leading-5 text-on-dark">{source.title}</p>
                    <p className="mt-1 font-mono text-xs text-on-dark-soft">{source.meta}</p>
                  </motion.li>
                );
              })}
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
                Background
              </p>
              <p className="text-xs leading-6 text-on-dark-soft">
                Self-attention replaced recurrence in many sequence models, enabling parallel
                training at scale across long contexts.
              </p>
              <motion.div
                className="rounded-md border border-chart-3/40 bg-chart-3/10 p-3"
                animate={
                  reduceMotion
                    ? undefined
                    : {
                        borderColor: [
                          "rgba(232, 165, 90, 0.35)",
                          "rgba(232, 165, 90, 0.65)",
                          "rgba(232, 165, 90, 0.35)",
                        ],
                      }
                }
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <p className="text-xs font-medium text-chart-3">Missing evidence</p>
                <p className="mt-1 text-xs leading-5 text-on-dark-soft">
                  Claim about training cost lacks a pinned source. Add a citation or revise the
                  sentence.
                </p>
              </motion.div>
              <div className="rounded-md border border-white/10 bg-surface-dark-soft p-3">
                <p className="font-mono text-xs leading-5 text-on-dark-soft">
                  <motion.span
                    className="text-chart-2"
                    animate={reduceMotion ? undefined : { opacity: [1, 0.55, 1] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    [1]
                  </motion.span>{" "}
                  Vaswani et al., 2017.
                  <br />
                  <span className="text-chart-3">Suggestion:</span> Cite BERT paper for
                  bidirectional pre-training comparison.
                </p>
              </div>
            </div>
          </>
        }
      />
    </>
  );
}
