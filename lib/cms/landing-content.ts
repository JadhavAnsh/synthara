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
    headline: string;
    body: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
  };
  features: {
    headline: string;
    items: LandingFeature[];
  };
  workflow: {
    headline: string;
    steps: LandingWorkflowStep[];
  };
  workspace: {
    headline: string;
    body: string;
    highlights: string[];
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
    headline: "Research discovery, drafting, and citations in one workspace.",
    body:
      "Synthara pairs source discovery with an AI-assisted editor. Search credible references, draft with evidence-aware suggestions, and keep citation metadata attached from outline to export.",
    primaryCtaLabel: "Get started free",
    primaryCtaHref: "/sign-up",
    secondaryCtaLabel: "Sign in",
    secondaryCtaHref: "/sign-in",
  },
  features: {
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
          "Draft sections with an assistant that flags missing evidence instead of inventing claims. Stay credible through every revision.",
      },
      {
        title: "Citations that follow the doc",
        description:
          "Selected sources stay linked to your outline, sections, and export formats — IEEE or Harvard — without re-entering metadata by hand.",
      },
    ],
  },
  workflow: {
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
  workspace: {
    headline: "Sources and drafting, side by side",
    body:
      "The dual-pane workspace keeps discovery on the left and your document on the right. Every claim stays tied to its source — with missing evidence surfaced before you export.",
    highlights: [
      "IEEE and Harvard export styles",
      "Missing-evidence flags inline",
      "Source metadata stays linked",
    ],
  },
  cta: {
    headline: "Start your first research project",
    body: "Create an account, verify your email, and open a project in minutes. No credit card required.",
    ctaLabel: "Get started free",
    ctaHref: "/sign-up",
  },
};
