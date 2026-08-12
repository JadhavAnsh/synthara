import { ProductMockup } from "@/components/marketing/product-mockup";
import { Reveal } from "@/components/marketing/motion-primitives";
import type { LandingPageContent } from "@/lib/cms/landing-content";

type ProductPreviewSectionProps = {
  content: LandingPageContent["productPreview"];
};

export function ProductPreviewSection({ content }: ProductPreviewSectionProps) {
  return (
    <section className="border-b border-hairline bg-surface-card">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 sm:px-10 sm:py-24 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-12">
        <Reveal>
          <p className="text-sm font-medium text-primary">{content.eyebrow}</p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl tracking-tight text-ink sm:text-4xl">
            {content.headline}
          </h2>
          <p className="mt-5 max-w-lg leading-8 text-body">{content.body}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <ProductMockup variant="section" />
        </Reveal>
      </div>
    </section>
  );
}
