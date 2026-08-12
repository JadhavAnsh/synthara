import { getContentstackEntries } from "@/lib/cms/contentstack";
import {
  defaultLandingContent,
  type LandingPageContent,
} from "@/lib/cms/landing-content";

type LandingPageEntry = {
  hero_headline?: string;
  hero_body?: string;
  primary_cta_label?: string;
  primary_cta_url?: string;
  secondary_cta_label?: string;
  secondary_cta_url?: string;
};

export async function getLandingPageContent(): Promise<LandingPageContent> {
  const content: LandingPageContent = structuredClone(defaultLandingContent);

  try {
    const entries = await getContentstackEntries<LandingPageEntry>("landing_page");

    if (!entries.length) {
      return content;
    }

    const entry = entries[0];

    if (entry.hero_headline) {
      content.hero.headline = entry.hero_headline;
    }
    if (entry.hero_body) {
      content.hero.body = entry.hero_body;
    }
    if (entry.primary_cta_label) {
      content.hero.primaryCtaLabel = entry.primary_cta_label;
    }
    if (entry.primary_cta_url) {
      content.hero.primaryCtaHref = entry.primary_cta_url;
    }
    if (entry.secondary_cta_label) {
      content.hero.secondaryCtaLabel = entry.secondary_cta_label;
    }
    if (entry.secondary_cta_url) {
      content.hero.secondaryCtaHref = entry.secondary_cta_url;
    }
  } catch {
    // Fall back to coded defaults when Contentstack is not configured.
  }

  return content;
}
