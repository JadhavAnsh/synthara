import {
  HoverLift,
  Reveal,
  Stagger,
  StaggerChild,
} from "@/components/marketing/motion-primitives";
import type { LandingPageContent } from "@/lib/cms/landing-content";

type WorkflowSectionProps = {
  content: LandingPageContent["workflow"];
};

export function WorkflowSection({ content }: WorkflowSectionProps) {
  return (
    <section id="workflow" className="border-b border-hairline bg-canvas">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 sm:px-10 sm:py-24 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16 lg:px-12">
        <Reveal>
          <p className="text-sm font-medium text-primary">{content.eyebrow}</p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl tracking-tight text-ink sm:text-4xl">
            {content.headline}
          </h2>
        </Reveal>

        <Stagger className="grid gap-4 sm:grid-cols-2">
          {content.steps.map((step, index) => (
            <StaggerChild key={step.title}>
              <HoverLift className="h-full rounded-lg border border-hairline bg-canvas p-6">
                <span className="text-sm font-semibold text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-medium text-ink">{step.title}</h3>
                <p className="mt-2 leading-7 text-body">{step.description}</p>
              </HoverLift>
            </StaggerChild>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
