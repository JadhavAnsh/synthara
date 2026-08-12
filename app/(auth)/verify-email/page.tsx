import Link from "next/link";
import { Suspense } from "react";

import { VerifyEmailPanel } from "@/components/auth/verify-email-panel";

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <header className="border-b border-hairline px-6 py-4 sm:px-10">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-xl text-ink"
        >
          Synthara
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <Suspense
          fallback={
            <div className="w-full max-w-md rounded-xl border border-hairline bg-surface-card/70 p-8 text-center shadow-sm">
              <p className="text-sm text-muted-soft">Loading...</p>
            </div>
          }
        >
          <VerifyEmailPanel />
        </Suspense>
      </main>
    </div>
  );
}
