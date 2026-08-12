"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuthStore, selectIsAuthenticated, selectIsEmailVerified } from "@/stores/auth-store";

type AuthGuardProps = {
  children: React.ReactNode;
  requireVerifiedEmail?: boolean;
};

export function AuthGuard({ children, requireVerifiedEmail = true }: AuthGuardProps) {
  const router = useRouter();
  const status = useAuthStore((state) => state.status);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isEmailVerified = useAuthStore(selectIsEmailVerified);

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (!isAuthenticated) {
      router.replace("/sign-in");
      return;
    }

    if (requireVerifiedEmail && !isEmailVerified) {
      router.replace("/verify-email");
    }
  }, [isAuthenticated, isEmailVerified, requireVerifiedEmail, router, status]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
        Checking your session...
      </div>
    );
  }

  if (!isAuthenticated || (requireVerifiedEmail && !isEmailVerified)) {
    return null;
  }

  return children;
}
