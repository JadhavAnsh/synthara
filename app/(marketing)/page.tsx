import { MarketingShell } from "@/components/layout/marketing-shell";
import { getLandingPageContent } from "@/lib/cms/landing";

const workflow = [
  "Search web, academic, and code sources from one research question.",
  "Select credible sources and keep normalized metadata for citations.",
  "Draft sections with a Gemini-backed assistant that stays honest about missing evidence.",
  "Publish marketing, help, and research templates from Contentstack.",
];

const stack = [
  ["AI provider", "Google Gemini Developer API free tier for development"],
  ["CMS", "Contentstack Delivery API for editable pages and templates"],
  ["App", "Next.js App Router, React, Tailwind, shadcn/ui"],
  ["Data layer", "MongoDB with Better Auth and Mongoose domain models"],
];

export default async function Home() {
  const landing = await getLandingPageContent();

  return (
    <MarketingShell>
      <section className="border-b border-hairline bg-canvas">
        <div className="mx-auto flex min-h-[72vh] w-full max-w-6xl flex-col justify-between px-6 py-8 sm:px-10 lg:px-12">
          <div
            id="overview"
            className="grid gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-end"
          >
            <div className="max-w-2xl">
              <p className="mb-5 text-sm font-medium text-primary">
                {landing.eyebrow}
              </p>
              <h1 className="text-4xl leading-tight text-ink sm:text-6xl">
                {landing.headline}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-body">
                {landing.body}
              </p>
            </div>

            <div className="rounded-lg border border-hairline bg-canvas p-5 shadow-sm">
              <div className="border-b border-hairline pb-4">
                <p className="text-sm font-medium text-primary">Development setup</p>
                <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-ink">
                  Free-first integrations
                </h2>
              </div>
              <dl className="divide-y divide-hairline">
                {stack.map(([label, value]) => (
                  <div key={label} className="grid gap-2 py-4 sm:grid-cols-[8rem_1fr]">
                    <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
                    <dd className="text-sm leading-6 text-body-strong">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section
        id="docs"
        className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-12 sm:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:px-12"
      >
        <div>
          <p className="text-sm font-medium text-primary">Product flow</p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-ink">
            What this foundation enables
          </h2>
        </div>
        <ol className="grid gap-3 sm:grid-cols-2">
          {workflow.map((item, index) => (
            <li key={item} className="rounded-lg border border-hairline bg-surface-card p-5">
              <span className="text-sm font-semibold text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="mt-3 leading-7 text-body">{item}</p>
            </li>
          ))}
        </ol>
      </section>
    </MarketingShell>
  );
}
