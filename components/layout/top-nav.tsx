"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { SyntharaMark } from "@/components/brand/synthara-mark";
import { NavLinkMotion } from "@/components/marketing/motion-primitives";
import { marketingNavLinks } from "@/components/marketing/marketing-nav-links";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const status = useAuthStore((state) => state.status);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  async function handleSignOut() {
    await authClient.signOut();
    useAuthStore.getState().reset();
    router.push("/");
    router.refresh();
  }

  const isProjectsRoute = pathname === "/projects" || pathname.startsWith("/projects/");
  const showAuthenticated =
    hasMounted && status !== "loading" && isAuthenticated;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-16 border-b border-hairline bg-canvas/95 backdrop-blur-sm",
        className,
      )}
    >
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-3 px-6 sm:px-10 lg:px-12">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <SyntharaMark size="sm" />
          <span className="truncate font-[family-name:var(--font-display)] text-xl tracking-tight text-ink">
            Synthara
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-8 text-sm font-medium sm:flex"
        >
          {variant === "marketing" ? (
            marketingNavLinks.map((link) => (
              <NavLinkMotion key={link.href} href={link.href}>
                {link.label}
              </NavLinkMotion>
            ))
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
          {variant === "marketing" ? (
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-body hover:bg-surface-soft hover:text-ink sm:hidden"
                    aria-label="Open menu"
                  />
                }
              >
                <HugeiconsIcon icon={Menu01Icon} strokeWidth={2} />
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[min(100%,20rem)] border-hairline bg-canvas p-0 text-ink"
              >
                <SheetHeader className="border-b border-hairline px-6 py-5">
                  <SheetTitle className="flex items-center gap-2 font-[family-name:var(--font-display)] text-lg font-normal text-ink">
                    <SyntharaMark size="sm" />
                    Synthara
                  </SheetTitle>
                </SheetHeader>
                <nav aria-label="Mobile" className="flex flex-col px-3 py-4">
                  {marketingNavLinks.map((link) => (
                    <SheetClose
                      key={link.href}
                      render={
                        <Link
                          href={link.href}
                          className="rounded-md px-3 py-3 text-base font-medium text-body transition-colors hover:bg-surface-soft hover:text-ink"
                        />
                      }
                    >
                      {link.label}
                    </SheetClose>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          ) : null}

          {showAuthenticated ? (
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
              <Button size="sm" render={<Link href="/sign-up" />}>
                Get started free
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
