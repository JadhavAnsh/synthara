import type { EmailTemplateRenderResult } from "@/lib/email/types";

import { renderVerificationEmail } from "./verification";
import { renderWelcomeEmail } from "./welcome";

export const emailTemplates = {
  verification: renderVerificationEmail,
  welcome: renderWelcomeEmail,
} as const;

export type EmailTemplateId = keyof typeof emailTemplates;

export function renderEmailTemplate<T extends EmailTemplateId>(
  template: T,
  data: Parameters<(typeof emailTemplates)[T]>[0],
): EmailTemplateRenderResult {
  return emailTemplates[template](data as never);
}
