import type { EmailTemplateRenderResult, VerificationEmailData } from "@/lib/email/types";

import { renderBaseEmail } from "./base";

export function renderVerificationEmail(
  data: VerificationEmailData,
): EmailTemplateRenderResult {
  const greeting = data.recipientName ? `Hi ${data.recipientName},` : "Hi there,";

  const { html, text } = renderBaseEmail({
    previewText: "Confirm your email to start using Synthara.",
    title: "Verify your email address",
    bodyHtml: `<p style="margin: 0 0 12px;">${greeting}</p>
      <p style="margin: 0 0 12px;">
        Confirm your email to access your research workspace, create projects, and use the assistant.
      </p>
      <p style="margin: 0;">
        This link expires soon. If you did not create a Synthara account, you can ignore this email.
      </p>`,
    ctaLabel: "Verify email",
    ctaUrl: data.verificationUrl,
    footerNote: "Synthara requires a verified email before project access is enabled.",
  });

  return {
    subject: "Verify your Synthara email address",
    html,
    text,
  };
}
