export type LandingFeature = {
  title: string;
  description: string;
};

export type LandingWorkflowStep = {
  title: string;
  description: string;
};

export type LandingPageContent = {
  hero: {
    eyebrow: string;
    headline: string;
    body: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
  };
  features: {
    eyebrow: string;
    headline: string;
    items: LandingFeature[];
  };
  workflow: {
    eyebrow: string;
    headline: string;
    steps: LandingWorkflowStep[];
  };
  productPreview: {
    eyebrow: string;
    headline: string;
    body: string;
  };
  workspace: {
    eyebrow: string;
    headline: string;
    body: string;
  };
  cta: {
    headline: string;
    body: string;
    ctaLabel: string;
    ctaHref: string;
  };
};

export const defaultLandingContent: LandingPageContent = {
  hero: {
    eyebrow: "AI research assistant",
    headline: "Research discovery, drafting, and citations in one workspace.",
    body:
      "Synthara pairs source discovery with an AI-assisted editor. Search credible references, draft with evidence-aware suggestions, and keep citation metadata attached from outline to export.",
    primaryCtaLabel: "Get started free",
    primaryCtaHref: "/sign-up",
    secondaryCtaLabel: "Sign in",
    secondaryCtaHref: "/sign-in",
  },
  features: {
    eyebrow: "Why Synthara",
    headline: "Built for evidence-first research",
    items: [
      {
        title: "Unified source discovery",
        description:
          "Search web, academic papers, and code references from a single research question. Results arrive with normalized metadata ready for citation.",
      },
      {
        title: "Honest AI drafting",
        description:
          "Draft sections with a Gemini-backed assistant that flags missing evidence instead of inventing claims. Stay credible through every revision.",
      },
      {
        title: "Citations that follow the doc",
        description:
          "Selected sources stay linked to your outline, sections, and export formats — IEEE or Harvard — without re-entering metadata by hand.",
      },
    ],
  },
  workflow: {
    eyebrow: "Product flow",
    headline: "From question to cited document",
    steps: [
      {
        title: "Ask a research question",
        description:
          "Start with a topic or hypothesis. Synthara scopes the search across web, academic, and code sources.",
      },
      {
        title: "Select credible sources",
        description:
          "Review ranked results, pin the references that matter, and keep author, date, and URL metadata normalized.",
      },
      {
        title: "Draft with context",
        description:
          "Write in the editor while the assistant suggests structure and phrasing grounded in your selected sources.",
      },
      {
        title: "Export with citations",
        description:
          "Publish or export with citation styles applied — ready for submission, sharing, or CMS templates.",
      },
    ],
  },
  productPreview: {
    eyebrow: "Workspace",
    headline: "Dual-pane research, one continuous flow",
    body:
      "Sources on the left, your document on the right. Every paragraph stays tied to the evidence behind it so you can audit claims before you ship.",
  },
  workspace: {
    eyebrow: "Workspace",
    headline: "Sources and drafting, side by side",
    body:
      "The double-pane workspace keeps discovery on the left and your document on the right — with citations that stay attached from outline to export.",
  },
  cta: {
    headline: "Start your first research project",
    body: "Create an account, verify your email, and open a project in minutes. No credit card required for development.",
    ctaLabel: "Create free account",
    ctaHref: "/sign-up",
  },
};
