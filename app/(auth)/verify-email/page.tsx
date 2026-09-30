import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { VerifyEmailPanel } from "@/components/auth/verify-email-panel";

export default function Page() {
  return <AuthShell><Suspense fallback={<p role="status" className="text-sm text-muted-foreground">Loading your workspace…</p>}><VerifyEmailPanel /></Suspense></AuthShell>;
}
