import Link from "next/link";

import {
  MotionPress,
  Reveal,
  Stagger,
  StaggerChild,
} from "@/components/marketing/motion-primitives";
import { ProductMockup } from "@/components/marketing/product-mockup";
import { Button } from "@/components/ui/button";
import type { LandingPageContent } from "@/lib/cms/landing-content";

type HeroSectionProps = {
  content: LandingPageContent["hero"];
};

export function HeroSection({ content }: HeroSectionProps) {
  return (
    <section className="border-b border-hairline bg-canvas">
      <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10 sm:py-24 lg:px-12">
        <div
          id="overview"
          className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16"
        >
          <Stagger className="max-w-2xl">
            <StaggerChild>
              <p className="text-sm font-medium text-primary">{content.eyebrow}</p>
            </StaggerChild>
            <StaggerChild>
              <h1 className="mt-5 font-[family-name:var(--font-display)] text-4xl leading-[1.05] tracking-tight text-ink sm:text-6xl">
                {content.headline}
              </h1>
            </StaggerChild>
            <StaggerChild>
              <p className="mt-6 max-w-xl text-lg leading-8 text-body">{content.body}</p>
            </StaggerChild>
            <StaggerChild>
              <div className="mt-8 flex flex-wrap gap-3">
                <MotionPress className="inline-flex">
                  <Button size="lg" render={<Link href={content.primaryCtaHref} />}>
                    {content.primaryCtaLabel}
                  </Button>
                </MotionPress>
                <MotionPress className="inline-flex">
                  <Button
                    variant="outline"
                    size="lg"
                    render={<Link href={content.secondaryCtaHref} />}
                  >
                    {content.secondaryCtaLabel}
                  </Button>
                </MotionPress>
              </div>
            </StaggerChild>
          </Stagger>

          <Reveal delay={0.12}>
            <ProductMockup variant="hero" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
