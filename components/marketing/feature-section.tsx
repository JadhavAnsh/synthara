import {
  Reveal,
  Stagger,
  StaggerChild,
} from "@/components/marketing/motion-primitives";
import type { LandingPageContent } from "@/lib/cms/landing-content";

type FeatureSectionProps = {
  content: LandingPageContent["features"];
};

function FeatureIcon({ kind }: { kind: "search" | "shield" | "citation" }) {
  if (kind === "search") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" className="size-6 text-primary" fill="none">
        <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.75" />
        <path d="M16 16l4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        <path d="M8 11h6M11 8v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === "shield") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" className="size-6 text-primary" fill="none">
        <path
          d="M12 3.5 5 6.5v5.8c0 4.2 3 7.9 7 9.2 4-1.3 7-5 7-9.2V6.5L12 3.5Z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
        <path d="m9.5 12 1.8 1.8L15 10.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-6 text-primary" fill="none">
      <path d="M7 5.5v13M17 5.5v13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M10 9h4M10 15h2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="16" cy="15" r="1.25" fill="currentColor" />
    </svg>
  );
}

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

        <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {content.items.map((feature, index) => (
            <StaggerChild key={feature.title}>
              <div className="h-full rounded-lg bg-surface-card p-8">
                <FeatureIcon kind={featureIcons[index] ?? "search"} />
                <h3 className="mt-5 text-lg font-medium text-ink">{feature.title}</h3>
                <p className="mt-3 leading-7 text-body">{feature.description}</p>
              </div>
            </StaggerChild>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
