"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const channels = ["Web", "Academic", "Code"] as const;
type Channel = (typeof channels)[number];

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

const channelStyles: Record<Channel, string> = {
  Web: "bg-surface-dark-elevated text-on-dark-soft",
  Academic: "bg-primary/20 text-on-dark",
  Code: "bg-chart-2/20 text-on-dark",
};

const CYCLE_MS = 3200;

export function ProductMockup() {
  const reduceMotion = useReducedMotion();
  const [activeChannel, setActiveChannel] = useState<Channel>("Web");
  const intervalRef = useRef<number | null>(null);

  const filteredResults = useMemo(
    () => results.filter((result) => result.channel === activeChannel),
    [activeChannel],
  );

  const startCycle = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }
    if (reduceMotion) return;

    intervalRef.current = window.setInterval(() => {
      setActiveChannel((current) => {
        const index = channels.indexOf(current);
        return channels[(index + 1) % channels.length];
      });
    }, CYCLE_MS);
  }, [reduceMotion]);

  const selectChannel = useCallback(
    (channel: Channel) => {
      setActiveChannel(channel);
      startCycle();
    },
    [startCycle],
  );

  useEffect(() => {
    startCycle();
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [startCycle]);

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-surface-dark shadow-lg">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <motion.span
          aria-hidden
          className="size-2 rounded-full bg-chart-2"
          animate={reduceMotion ? undefined : { opacity: [1, 0.35, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
        <p className="font-mono text-xs text-on-dark-soft">
          transformer attention mechanisms
          {!reduceMotion ? (
            <motion.span
              aria-hidden
              className="ml-0.5 inline-block w-[2px] translate-y-px bg-primary"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
              style={{ height: "0.85em" }}
            />
          ) : null}
        </p>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-2">
          {channels.map((channel) => {
            const isActive = channel === activeChannel;

            return (
              <button
                key={channel}
                type="button"
                onClick={() => selectChannel(channel)}
                className={
                  isActive
                    ? "relative rounded-md px-2.5 py-1 text-xs font-medium text-primary-foreground"
                    : "relative rounded-md border border-white/10 px-2.5 py-1 text-xs font-medium text-on-dark-soft transition-colors hover:border-white/20 hover:text-on-dark"
                }
              >
                {isActive ? (
                  <motion.span
                    layoutId="product-channel-tab"
                    className="absolute inset-0 rounded-md bg-primary"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                ) : null}
                <span className="relative z-10">{channel}</span>
              </button>
            );
          })}
        </div>

        <ul className="mt-4 space-y-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {filteredResults.map((result, index) => (
              <motion.li
                key={`${activeChannel}-${result.title}`}
                layout
                initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -6, scale: 0.98 }}
                transition={{
                  type: "spring",
                  stiffness: 480,
                  damping: 32,
                  delay: index * 0.05,
                }}
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
                        y: -1,
                      }
                }
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
          </AnimatePresence>
        </ul>

        <motion.p
          className="mt-4 text-xs text-on-dark-soft"
          key={activeChannel}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {filteredResults.length} sources in {activeChannel.toLowerCase()} · metadata normalized
          for citation
        </motion.p>
      </div>
    </div>
  );
}
