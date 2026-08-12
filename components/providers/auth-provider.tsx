"use client";

import { useEffect } from "react";

import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/stores/auth-store";

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const { data: session, isPending, refetch } = authClient.useSession();
  const setSession = useAuthStore((state) => state.setSession);
  const setStatus = useAuthStore((state) => state.setStatus);

  useEffect(() => {
    if (isPending) {
      setStatus("loading");
      return;
    }

    if (session) {
      setSession(session);
      setStatus("authenticated");
      return;
    }

    setSession(null);
    setStatus("unauthenticated");
  }, [isPending, session, setSession, setStatus]);

  useEffect(() => {
    const onFocus = () => {
      void refetch();
    };

    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refetch]);

  return children;
}
