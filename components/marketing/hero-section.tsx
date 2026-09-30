import {
  Reveal,
  Stagger,
  StaggerChild,
} from "@/components/marketing/motion-primitives";
import { HeroCtas } from "@/components/marketing/hero-ctas";
import { ProductMockup } from "@/components/marketing/product-mockup";
import type { LandingPageContent } from "@/lib/cms/landing-content";

type HeroSectionProps = {
  content: LandingPageContent["hero"];
};

export function HeroSection({ content }: HeroSectionProps) {
  return (
    <section className="border-b border-hairline bg-canvas">
      <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-10 sm:py-24 lg:px-12 lg:py-28">
        <div
          id="overview"
          className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16"
        >
          <Stagger className="max-w-2xl">
            <StaggerChild>
              <h1 className="font-[family-name:var(--font-display)] text-5xl leading-[0.98] tracking-[-0.035em] text-ink sm:text-7xl lg:text-[5.5rem]">
                {content.headline}
              </h1>
            </StaggerChild>
            <StaggerChild>
              <p className="mt-6 max-w-xl text-lg leading-8 text-body">{content.body}</p>
            </StaggerChild>
            <StaggerChild>
              <HeroCtas content={content} />
            </StaggerChild>
          </Stagger>

          <Reveal delay={0.12}>
            <ProductMockup />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
