import { getContentstackEntries } from "@/lib/cms/contentstack";

type LandingPageEntry = {
  hero_headline?: string;
  hero_body?: string;
  primary_cta_label?: string;
};

const defaultContent = {
  eyebrow: "AI research assistant SaaS",
  headline: "Research discovery, drafting, and citations in one workspace.",
  body: "Synthara is designed around a dual-pane research flow: source discovery on one side, an AI-assisted editor on the other, and citation data that follows the document from outline to export.",
  ctaLabel: "Get started",
};

export async function getLandingPageContent() {
  try {
    const entries = await getContentstackEntries<LandingPageEntry>("landing_page");

    if (!entries.length) {
      return defaultContent;
    }

    const entry = entries[0];

    return {
      eyebrow: defaultContent.eyebrow,
      headline: entry.hero_headline || defaultContent.headline,
      body: entry.hero_body || defaultContent.body,
      ctaLabel: entry.primary_cta_label || defaultContent.ctaLabel,
    };
  } catch {
    return defaultContent;
  }
}
