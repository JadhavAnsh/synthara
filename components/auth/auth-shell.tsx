import Link from "next/link";
import type { ReactNode } from "react";
import { SyntharaMark } from "@/components/brand/synthara-mark";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-canvas lg:grid lg:grid-cols-[0.9fr_1.1fr]">
      <aside className="flex flex-col bg-surface-dark px-6 py-6 text-on-dark sm:px-12 lg:min-h-dvh lg:px-16 lg:py-10">
        <Link href="/" className="flex w-fit items-center gap-3 text-2xl"><SyntharaMark /><span className="font-[family-name:var(--font-display)]">Synthara</span></Link>
        <div className="my-auto hidden max-w-lg py-20 lg:block">
          <p className="font-[family-name:var(--font-display)] text-6xl leading-[1.05] tracking-tight">Good research begins with a question.</p>
          <p className="mt-8 max-w-sm text-base leading-8 text-on-dark-soft">Bring your sources, ideas, and writing into one considered workspace.</p>
          <div className="mt-14 space-y-5 border-t border-white/15 pt-8 text-sm text-on-dark-soft">
            <p>Discover evidence across disciplines.</p><p>Keep every source within reach.</p><p>Write with context, not guesswork.</p>
          </div>
        </div>
        <Link href="/" className="mt-6 hidden w-fit py-2 text-sm text-on-dark-soft hover:text-on-dark lg:block">Back to the overview</Link>
      </aside>
      <main id="main-content" className="auth-fields flex items-center justify-center px-6 py-12 sm:px-12 lg:py-16">{children}</main>
    </div>
  );
}
