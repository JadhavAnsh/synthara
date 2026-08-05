"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuthStore, selectIsAuthenticated } from "@/stores/auth-store";

type GuestGuardProps = {
  children: React.ReactNode;
};

export function GuestGuard({ children }: GuestGuardProps) {
  const router = useRouter();
  const status = useAuthStore((state) => state.status);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isEmailVerified = useAuthStore((state) => state.session?.user.emailVerified);

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (isAuthenticated && isEmailVerified) {
      router.replace("/projects");
    }
  }, [isAuthenticated, isEmailVerified, router, status]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (isAuthenticated && isEmailVerified) {
    return null;
  }

  return children;
}
