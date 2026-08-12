"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  const pathname = usePathname();
  const [hasMounted, setHasMounted] = useState(false);
  const status = useAuthStore((state) => state.status);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  useEffect(() => {
    setTimeout(() => {
      setHasMounted(true);
    }, 100);
  }, []);

  async function handleSignOut() {
    await authClient.signOut();
    useAuthStore.getState().reset();
    router.push("/");
    router.refresh();
  }

  const isProjectsRoute = pathname === "/projects" || pathname.startsWith("/projects/");

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-16 border-b border-hairline bg-canvas/95 backdrop-blur-sm",
        className,
      )}
    >
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6 sm:px-10 lg:px-12">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="size-2 rounded-full bg-primary" aria-hidden />
          <span className="font-[family-name:var(--font-display)] text-xl tracking-tight text-ink">
            Synthara
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium sm:flex">
          {variant === "marketing" ? (
            <>
              <Link href="#overview" className="text-body transition-colors hover:text-ink">
                Overview
              </Link>
              <Link href="#features" className="text-body transition-colors hover:text-ink">
                Features
              </Link>
              <Link href="#workflow" className="text-body transition-colors hover:text-ink">
                Workflow
              </Link>
              <Link href="#workspace" className="text-body transition-colors hover:text-ink">
                Workspace
              </Link>
            </>
          ) : (
            <Link
              href="/projects"
              aria-current={isProjectsRoute ? "page" : undefined}
              className={cn(
                "relative py-1 transition-colors",
                isProjectsRoute ? "text-ink" : "text-body hover:text-ink",
              )}
            >
              Projects
              {isProjectsRoute ? (
                <span
                  aria-hidden
                  className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-primary"
                />
              ) : null}
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {!hasMounted || status === "loading" ? (
            <span className="text-xs text-muted-soft">Loading…</span>
          ) : isAuthenticated ? (
            <>
              {variant === "app" ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden border-hairline bg-canvas text-body-strong hover:bg-surface-soft sm:inline-flex"
                  render={<Link href="/projects/new" />}
                >
                  New project
                </Button>
              ) : (
                <Button size="sm" render={<Link href="/projects" />}>
                  Projects
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="text-body hover:bg-surface-soft hover:text-ink"
                onClick={handleSignOut}
              >
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="text-body hover:bg-surface-soft hover:text-ink"
                render={<Link href="/sign-in" />}
              >
                Sign in
              </Button>
              <Button render={<Link href="/sign-up" />}>Get started</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
