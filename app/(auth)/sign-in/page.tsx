import Link from "next/link";
import { Suspense } from "react";

import { AuthForm } from "@/components/auth/auth-form";
import { GuestGuard } from "@/components/auth/guest-guard";

export default function SignInPage() {
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
        <GuestGuard>
          <Suspense fallback={<p className="text-sm text-muted-foreground">Loading...</p>}>
            <AuthForm mode="sign-in" />
          </Suspense>
        </GuestGuard>
      </main>
    </div>
  );
}
