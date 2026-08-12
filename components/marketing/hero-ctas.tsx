"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { MotionPress } from "@/components/marketing/motion-primitives";
import { Button } from "@/components/ui/button";
import type { LandingPageContent } from "@/lib/cms/landing-content";
import { useAuthStore, selectIsAuthenticated } from "@/stores/auth-store";

type HeroCtasProps = {
  content: LandingPageContent["hero"];
};

export function HeroCtas({ content }: HeroCtasProps) {
  const [hasMounted, setHasMounted] = useState(false);
  const status = useAuthStore((state) => state.status);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const showAuthenticated = hasMounted && status !== "loading" && isAuthenticated;

  const secondaryHref = showAuthenticated ? "/projects" : content.secondaryCtaHref;
  const secondaryLabel = showAuthenticated ? "Open projects" : content.secondaryCtaLabel;

  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <MotionPress className="inline-flex">
        <Button size="lg" render={<Link href={content.primaryCtaHref} />}>
          {content.primaryCtaLabel}
        </Button>
      </MotionPress>
      <MotionPress className="inline-flex">
        <Button variant="outline" size="lg" render={<Link href={secondaryHref} />}>
          {secondaryLabel}
        </Button>
      </MotionPress>
    </div>
  );
}
