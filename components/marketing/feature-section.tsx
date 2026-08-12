import { Reveal } from "@/components/marketing/motion-primitives";
import { FeatureCard } from "@/components/marketing/feature-card";
import type { LandingPageContent } from "@/lib/cms/landing-content";

type FeatureSectionProps = {
  content: LandingPageContent["features"];
};

const featureIcons = ["search", "shield", "citation"] as const;

export function FeatureSection({ content }: FeatureSectionProps) {
  return (
    <section id="features" className="border-b border-hairline bg-surface-soft">
      <div className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-10 lg:px-12">
        <Reveal className="max-w-2xl">
          <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-ink sm:text-4xl">
            {content.headline}
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {content.items.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              icon={featureIcons[index] ?? "search"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
