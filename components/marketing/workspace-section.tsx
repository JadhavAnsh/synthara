import {
  Reveal,
} from "@/components/marketing/motion-primitives";
import { WorkspaceMockup } from "@/components/marketing/workspace-mockup";
import type { LandingPageContent } from "@/lib/cms/landing-content";

type WorkspaceSectionProps = {
  content: LandingPageContent["workspace"];
};

export function WorkspaceSection({ content }: WorkspaceSectionProps) {
  return (
    <section id="workspace" className="border-b border-hairline bg-surface-card">
      <div className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-10 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal>
            <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-ink sm:text-4xl">
              {content.headline}
            </h2>
            <p className="mt-5 max-w-lg leading-8 text-body">{content.body}</p>
            <ul className="mt-8 space-y-3">
              {content.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-3 text-sm text-body-strong">
                  <span
                    aria-hidden
                    className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
                  />
                  {highlight}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="overflow-hidden rounded-lg border border-white/10 bg-surface-dark">
              <WorkspaceMockup />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
