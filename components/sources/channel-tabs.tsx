"use client";

import { motion, useReducedMotion } from "motion/react";

import type { ChannelSearchResult } from "@/lib/api/sources";
import { CHANNEL_LABELS } from "@/lib/validation/search";
import type { SearchChannel } from "@/lib/search/types";
import { cn } from "@/lib/utils";

const CHANNELS: SearchChannel[] = ["web", "academic", "github"];

const CHANNEL_ACCENT: Record<SearchChannel, string> = {
  web: "bg-primary",
  academic: "bg-[#5db8a6]",
  github: "bg-[#e8a55a]",
};

type ChannelTabsProps = {
  activeChannel: SearchChannel;
  onChange: (channel: SearchChannel) => void;
  channelResults: Array<ChannelSearchResult | undefined>;
  isLoading: boolean;
};

function tabMeta(result: ChannelSearchResult | undefined, isLoading: boolean) {
  if (isLoading) {
    return { label: "…", tone: "text-muted-foreground" as const };
  }

  if (!result) {
    return { label: "—", tone: "text-muted-foreground" as const };
  }

  if (result.status === "success") {
    return { label: String(result.results.length), tone: "text-ink" as const };
  }

  if (result.status === "empty") {
    return { label: "0", tone: "text-muted-foreground" as const };
  }

  return { label: "!", tone: "text-destructive" as const };
}

export function ChannelTabs({
  activeChannel,
  onChange,
  channelResults,
  isLoading,
}: ChannelTabsProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      role="tablist"
      aria-label="Source channels"
      className="flex gap-1 rounded-xl border border-hairline bg-surface-soft p-1"
    >
      {CHANNELS.map((channel, index) => {
        const isActive = activeChannel === channel;
        const meta = tabMeta(channelResults[index], isLoading);

        return (
          <button
            key={channel}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(channel)}
            className={cn(
              "relative flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive ? "text-ink" : "text-body hover:text-ink",
            )}
          >
            {isActive && !reduceMotion ? (
              <motion.span
                layoutId="channel-tab-highlight"
                className="absolute inset-0 rounded-lg border border-hairline bg-canvas shadow-[0_1px_2px_rgba(20,20,19,0.04)]"
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              />
            ) : isActive ? (
              <span className="absolute inset-0 rounded-lg border border-hairline bg-canvas shadow-[0_1px_2px_rgba(20,20,19,0.04)]" />
            ) : null}
            <span className={cn("relative z-10 size-1.5 shrink-0 rounded-full", CHANNEL_ACCENT[channel])} />
            <span className="relative z-10">{CHANNEL_LABELS[channel]}</span>
            <span className={cn("relative z-10 tabular-nums text-xs", meta.tone)}>{meta.label}</span>
          </button>
        );
      })}
    </div>
  );
}
