import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthForm } from "@/components/auth/auth-form";
import { GuestGuard } from "@/components/auth/guest-guard";

export default function Page() {
  return <AuthShell><Suspense fallback={<p role="status" className="text-sm text-muted-foreground">Loading your workspace…</p>}><GuestGuard><AuthForm mode="sign-up" /></GuestGuard></Suspense></AuthShell>;
}
