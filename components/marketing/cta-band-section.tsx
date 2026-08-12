import Link from "next/link";

import {
  MotionPress,
  Reveal,
} from "@/components/marketing/motion-primitives";
import { Button } from "@/components/ui/button";
import type { LandingPageContent } from "@/lib/cms/landing-content";

type CtaBandSectionProps = {
  content: LandingPageContent["cta"];
};

export function CtaBandSection({ content }: CtaBandSectionProps) {
  return (
    <section className="bg-canvas">
      <div className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-10 lg:px-12">
        <Reveal>
          <div className="rounded-lg bg-primary px-8 py-12 sm:px-12 sm:py-16">
            <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-primary-foreground sm:text-4xl">
              {content.headline}
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-primary-foreground/90">
              {content.body}
            </p>
            <MotionPress className="mt-8 inline-flex">
              <Button
                className="bg-canvas text-ink hover:bg-canvas/90"
                size="lg"
                render={<Link href={content.ctaHref} />}
              >
                {content.ctaLabel}
              </Button>
            </MotionPress>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
