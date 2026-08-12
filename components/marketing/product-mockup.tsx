"use client";

import { motion, useReducedMotion } from "motion/react";

const channels = ["Web", "Academic", "Code"] as const;

const results = [
  {
    channel: "Academic" as const,
    title: "Attention is all you need",
    meta: "Vaswani et al. · arXiv · 2017",
  },
  {
    channel: "Web" as const,
    title: "Transformer architecture overview",
    meta: "Google Research · 2024",
  },
  {
    channel: "Code" as const,
    title: "pytorch/transformers",
    meta: "GitHub · 42k stars",
  },
  {
    channel: "Academic" as const,
    title: "BERT: Pre-training of deep bidirectional transformers",
    meta: "Devlin et al. · ACL · 2019",
  },
];

const channelStyles: Record<(typeof channels)[number], string> = {
  Web: "bg-surface-dark-elevated text-on-dark-soft",
  Academic: "bg-primary/20 text-on-dark",
  Code: "bg-chart-2/20 text-on-dark",
};

export function ProductMockup() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-surface-dark shadow-lg">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="size-2 rounded-full bg-chart-2" aria-hidden />
        <p className="font-mono text-xs text-on-dark-soft">
          transformer attention mechanisms
        </p>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-2">
          {channels.map((channel, index) => (
            <span
              key={channel}
              className={
                index === 0
                  ? "rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground"
                  : "rounded-md border border-white/10 px-2.5 py-1 text-xs font-medium text-on-dark-soft"
              }
            >
              {channel}
            </span>
          ))}
        </div>

        <ul className="mt-4 space-y-2">
          {results.map((result, index) => (
            <motion.li
              key={result.title}
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
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm leading-5 text-on-dark">{result.title}</p>
                <span
                  className={`shrink-0 rounded px-1.5 py-0.5 text-xs font-medium uppercase tracking-wide ${channelStyles[result.channel]}`}
                >
                  {result.channel}
                </span>
              </div>
              <p className="mt-1.5 font-mono text-xs text-on-dark-soft">{result.meta}</p>
            </motion.li>
          ))}
        </ul>

        <p className="mt-4 text-xs text-on-dark-soft">
          12 sources ranked · metadata normalized for citation
        </p>
      </div>
    </div>
  );
}
