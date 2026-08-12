import type { EmailTemplateRenderResult, WelcomeEmailData } from "@/lib/email/types";

import { renderBaseEmail } from "./base";

export function renderWelcomeEmail(data: WelcomeEmailData): EmailTemplateRenderResult {
  const { html, text } = renderBaseEmail({
    previewText: "Your Synthara workspace is ready.",
    title: `Welcome, ${data.recipientName}`,
    bodyHtml: `<p style="margin: 0 0 12px;">
        Your account is verified and your research workspace is ready.
      </p>
      <p style="margin: 0;">
        Create a project with a topic and citation style, then continue into source discovery and drafting in upcoming phases.
      </p>`,
    ctaLabel: "Open projects",
    ctaUrl: data.dashboardUrl,
    footerNote: "Thanks for joining Synthara.",
  });

  return {
    subject: "Welcome to Synthara",
    html,
    text,
  };
}
