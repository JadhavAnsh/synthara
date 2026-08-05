import { deliverEmail } from "@/lib/email/client";
import { renderEmailTemplate, type EmailTemplateId } from "@/lib/email/templates";
import type { SendEmailInput } from "@/lib/email/types";
import { assertValidEmail } from "@/lib/email/validate";

export async function sendEmail(input: SendEmailInput) {
  return deliverEmail(input);
}

type SendTemplatedEmailInput<T extends EmailTemplateId> = {
  to: string;
  template: T;
  data: Parameters<(typeof import("@/lib/email/templates").emailTemplates)[T]>[0];
  subject?: string;
  tags?: SendEmailInput["tags"];
};

export async function sendTemplatedEmail<T extends EmailTemplateId>(
  input: SendTemplatedEmailInput<T>,
) {
  const to = assertValidEmail(input.to);
  const rendered = renderEmailTemplate(input.template, input.data);

  return sendEmail({
    to,
    subject: input.subject ?? rendered.subject,
    html: rendered.html,
    text: rendered.text,
    tags: input.tags,
  });
}

export async function sendCustomEmail(input: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  tags?: SendEmailInput["tags"];
}) {
  return sendEmail({
    to: assertValidEmail(input.to),
    subject: input.subject,
    html: input.html,
    text: input.text,
    replyTo: input.replyTo,
    tags: input.tags,
  });
}
