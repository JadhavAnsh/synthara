import Link from "next/link";

import { cn } from "@/lib/utils";

type FooterProps = {
  className?: string;
};

const footerLinks = [
  { label: "Overview", href: "#overview" },
  { label: "Plan", href: "#docs" },
  { label: "Sign in", href: "/sign-in" },
  { label: "Projects", href: "/projects" },
];

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn("bg-surface-dark text-on-dark-soft", className)}>
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-12">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-[family-name:var(--font-display)] text-2xl text-on-dark">
              Synthara
            </p>
            <p className="mt-3 max-w-sm text-sm leading-6">
              Research discovery, drafting, and citations in one workspace.
            </p>
          </div>

          <ul className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm sm:grid-cols-1">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-on-dark">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-12 border-t border-white/10 pt-6 text-xs">
          &copy; {new Date().getFullYear()} Synthara. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
