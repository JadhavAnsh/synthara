import { create } from "zustand";

import type { authClient } from "@/lib/auth-client";

export type Session = typeof authClient.$Infer.Session;
export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthStore = {
  session: Session | null;
  status: AuthStatus;
  setSession: (session: Session | null) => void;
  setStatus: (status: AuthStatus) => void;
  reset: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  session: null,
  status: "loading",
  setSession: (session) => set({ session }),
  setStatus: (status) => set({ status }),
  reset: () => set({ session: null, status: "unauthenticated" }),
}));

export const selectIsAuthenticated = (state: AuthStore) =>
  state.status === "authenticated" && !!state.session;

export const selectIsEmailVerified = (state: AuthStore) =>
  !!state.session?.user.emailVerified;
