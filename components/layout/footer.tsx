import Link from "next/link";

import { cn } from "@/lib/utils";

type FooterProps = {
  className?: string;
};

const linkGroups = [
  {
    heading: "Product",
    links: [
      { label: "Overview", href: "#overview" },
      { label: "Features", href: "#features" },
      { label: "Workflow", href: "#workflow" },
      { label: "Workspace", href: "#workspace" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Sign in", href: "/sign-in" },
      { label: "Get started", href: "/sign-up" },
    ],
  },
];

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn("bg-surface-dark text-on-dark-soft", className)}>
      <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10 sm:py-20 lg:px-12">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr] lg:gap-16">
          <div className="max-w-sm sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="size-2.5 rounded-full bg-primary" aria-hidden />
              <p className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-on-dark">
                Synthara
              </p>
            </div>
            <p className="mt-4 text-sm leading-6">
              Research discovery, drafting, and citations in one workspace.
            </p>
            <Link
              href="/sign-up"
              className="mt-7 inline-flex items-center gap-2 rounded-md border border-white/10 px-4 py-2 text-sm font-medium text-on-dark transition-colors hover:border-primary hover:bg-surface-dark-elevated"
            >
              Get started
              <svg
                aria-hidden
                className="size-3.5 text-primary"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 8h11" />
                <path d="m9 4 4 4-4 4" />
              </svg>
            </Link>
          </div>

          <nav className="col-span-2 grid grid-cols-2 gap-10 lg:gap-16">
            {linkGroups.map((group) => (
              <div key={group.heading}>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-on-dark">
                  {group.heading}
                </p>
                <ul className="mt-5 space-y-3 text-sm">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-block transition-colors hover:text-on-dark"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Synthara. All rights reserved.</p>
          <p className="text-on-dark-soft/70">
            Evidence-first research, from question to citation.
          </p>
        </div>
      </div>
    </footer>
  );
}
