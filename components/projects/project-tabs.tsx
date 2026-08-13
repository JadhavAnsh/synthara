"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

type ProjectTabsProps = {
  projectId: string;
  savedCount: number;
  variant?: "light" | "dark";
};

const tabs = [
  { slug: "", label: "Sources" },
  { slug: "workspace", label: "Workspace" },
] as const;

export function ProjectTabs({ projectId, savedCount, variant = "light" }: ProjectTabsProps) {
  const pathname = usePathname();
  const workspacePath = `/projects/${projectId}/workspace`;
  const isDark = variant === "dark";

  return (
    <nav
      aria-label="Project sections"
      className={cn(
        "flex items-center gap-1 p-1",
        isDark
          ? "rounded-xl bg-white/6 ring-1 ring-white/10"
          : "rounded-xl border border-hairline bg-surface-card",
      )}
    >
      {tabs.map((tab) => {
        const href = tab.slug ? `${`/projects/${projectId}`}/${tab.slug}` : `/projects/${projectId}`;
        const isActive = tab.slug
          ? pathname.startsWith(workspacePath)
          : pathname === `/projects/${projectId}` || pathname === `/projects/${projectId}/`;

        return (
          <Link
            key={tab.slug || "sources"}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? isDark
                  ? "bg-surface-dark-elevated text-on-dark shadow-sm ring-1 ring-white/10"
                  : "bg-canvas text-ink shadow-sm"
                : isDark
                  ? "text-on-dark-soft hover:bg-white/6 hover:text-on-dark"
                  : "text-body hover:bg-surface-soft hover:text-ink",
            )}
          >
            {tab.label}
            {tab.slug === "workspace" && savedCount === 0 ? (
              <span className={cn("ml-2 text-xs", isDark ? "text-on-dark-soft" : "text-body")}>
                (add sources first)
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
