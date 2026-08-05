"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore, selectIsAuthenticated } from "@/stores/auth-store";

type TopNavProps = {
  className?: string;
  variant?: "marketing" | "app";
};

export function TopNav({ className, variant = "marketing" }: TopNavProps) {
  const router = useRouter();
  const status = useAuthStore((state) => state.status);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const session = useAuthStore((state) => state.session);

  async function handleSignOut() {
    await authClient.signOut();
    useAuthStore.getState().reset();
    router.push("/");
    router.refresh();
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-16 border-b border-hairline bg-canvas",
        className,
      )}
    >
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6 sm:px-10 lg:px-12">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-xl tracking-tight text-ink"
        >
          Synthara
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground sm:flex">
          {variant === "marketing" ? (
            <>
              <Link href="#overview" className="hover:text-ink">
                Overview
              </Link>
              <Link href="#docs" className="hover:text-ink">
                Plan
              </Link>
            </>
          ) : (
            <Link href="/projects" className="hover:text-ink">
              Projects
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {status === "loading" ? (
            <span className="text-xs text-muted-foreground">Loading...</span>
          ) : isAuthenticated ? (
            <>
              {variant === "app" && session?.user.email ? (
                <span className="hidden text-xs text-muted-foreground sm:inline">
                  {session.user.email}
                </span>
              ) : null}
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                Sign out
              </Button>
              <Button size="sm" render={<Link href="/projects" />}>
                Projects
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" render={<Link href="/sign-in" />}>
                Sign in
              </Button>
              <Button size="sm" render={<Link href="/sign-up" />}>
                Get started
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
