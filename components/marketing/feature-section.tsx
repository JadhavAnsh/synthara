import { Reveal } from "@/components/marketing/motion-primitives";
import type { LandingPageContent } from "@/lib/cms/landing-content";

type FeatureSectionProps = {
  content: LandingPageContent["features"];
};


export function FeatureSection({ content }: FeatureSectionProps) {
  return (
    <section id="features" className="border-b border-hairline bg-surface-soft">
      <div className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-10 lg:px-12">
        <Reveal className="max-w-2xl">
          <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-ink sm:text-4xl">
            {content.headline}
          </h2>
        </Reveal>

        <div className="mt-12 divide-y divide-hairline border-y border-hairline">
          {content.items.map((feature) => (
            <div key={feature.title} className="grid gap-4 py-8 md:grid-cols-[1fr_1.2fr] md:gap-16">
              <h3 className="text-3xl text-ink">{feature.title}</h3>
              <p className="max-w-xl text-base leading-8 text-body">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
