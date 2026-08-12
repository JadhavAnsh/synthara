import { DualPane } from "@/components/marketing/dual-pane";
import {
  HoverLift,
  Reveal,
} from "@/components/marketing/motion-primitives";
import { WorkspaceMockup } from "@/components/marketing/workspace-mockup";
import type { LandingPageContent } from "@/lib/cms/landing-content";

type WorkspaceSectionProps = {
  content: LandingPageContent["workspace"];
};

export function WorkspaceSection({ content }: WorkspaceSectionProps) {
  return (
    <section id="workspace" className="border-b border-hairline bg-surface-soft">
      <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10 sm:py-24 lg:px-12">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-medium text-primary">{content.eyebrow}</p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl tracking-tight text-ink sm:text-4xl">
            {content.headline}
          </h2>
          <p className="mt-5 max-w-lg leading-8 text-body">{content.body}</p>
        </Reveal>

        <Reveal className="mt-10" delay={0.08}>
          <HoverLift className="overflow-hidden rounded-lg border border-white/10 bg-surface-dark">
            <WorkspaceMockup />
          </HoverLift>
        </Reveal>
      </div>
    </section>
  );
}
