import { Reveal } from "@/components/marketing/motion-primitives";
import { WorkflowStepCard } from "@/components/marketing/workflow-step-card";
import type { LandingPageContent } from "@/lib/cms/landing-content";

type WorkflowSectionProps = {
  content: LandingPageContent["workflow"];
};

export function WorkflowSection({ content }: WorkflowSectionProps) {
  return (
    <section id="workflow" className="border-b border-hairline bg-canvas">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-24 sm:px-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16 lg:px-12">
        <Reveal>
          <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-ink sm:text-4xl">
            {content.headline}
          </h2>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2">
          {content.steps.map((step, index) => (
            <WorkflowStepCard
              key={step.title}
              title={step.title}
              description={step.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
