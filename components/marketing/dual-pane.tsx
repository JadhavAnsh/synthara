import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type DualPaneProps = {
  left: ReactNode;
  right: ReactNode;
  className?: string;
};

export function DualPane({ left, right, className }: DualPaneProps) {
  return (
    <div
      className={cn(
        "grid divide-x divide-white/10 sm:grid-cols-[0.42fr_0.58fr]",
        className
      )}
    >
      <div className="p-4 sm:p-5">{left}</div>
      <div className="p-4 sm:p-5">{right}</div>
    </div>
  );
}