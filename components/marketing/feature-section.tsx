import {
  HoverLift,
  Reveal,
  Stagger,
  StaggerChild,
} from "@/components/marketing/motion-primitives";
import type { LandingPageContent } from "@/lib/cms/landing-content";

type FeatureSectionProps = {
  content: LandingPageContent["features"];
};

export function FeatureSection({ content }: FeatureSectionProps) {
  return (
    <section id="features" className="border-b border-hairline bg-surface-soft">
      <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10 sm:py-24 lg:px-12">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-medium text-primary">{content.eyebrow}</p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl tracking-tight text-ink sm:text-4xl">
            {content.headline}
          </h2>
        </Reveal>

        <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {content.items.map((feature, index) => (
            <StaggerChild key={feature.title}>
              <HoverLift className="h-full rounded-lg bg-surface-card p-8">
                <span className="inline-flex rounded-full bg-canvas px-3 py-1 text-xs font-medium text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 text-lg font-medium text-ink">{feature.title}</h3>
                <p className="mt-3 leading-7 text-body">{feature.description}</p>
              </HoverLift>
            </StaggerChild>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
