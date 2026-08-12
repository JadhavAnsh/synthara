import type { Metadata } from "next";

import { CtaBandSection } from "@/components/marketing/cta-band-section";
import { FeatureSection } from "@/components/marketing/feature-section";
import { HeroSection } from "@/components/marketing/hero-section";
import { WorkflowSection } from "@/components/marketing/workflow-section";
import { WorkspaceSection } from "@/components/marketing/workspace-section";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { getLandingPageContent } from "@/lib/cms/landing";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getLandingPageContent();

  return {
    title: "Synthara | AI Research Assistant",
    description: content.hero.body,
  };
}

export default async function Home() {
  const content = await getLandingPageContent();

  return (
    <MarketingShell>
      <HeroSection content={content.hero} />
      <FeatureSection content={content.features} />
      <WorkflowSection content={content.workflow} />
      <WorkspaceSection content={content.workspace} />
      <CtaBandSection content={content.cta} />
    </MarketingShell>
  );
}
