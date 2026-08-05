import { Resend } from "resend";

import { getEmailConfig, isEmailDeliveryConfigured } from "@/lib/email/config";
import type { SendEmailInput } from "@/lib/email/types";
import { assertValidEmail } from "@/lib/email/validate";

let resendClient: Resend | null = null;

function getResendClient() {
  const { apiKey } = getEmailConfig();

  if (!apiKey) {
    return null;
  }

  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }

  return resendClient;
}

function normalizeRecipients(to: SendEmailInput["to"]) {
  const recipients = Array.isArray(to) ? to : [to];
  return recipients.map((email) => assertValidEmail(email));
}

export async function deliverEmail(input: SendEmailInput) {
  const config = getEmailConfig();
  const to = normalizeRecipients(input.to);
  const client = getResendClient();

  if (!client) {
    console.log("[Synthara Mail] Resend is not configured. Email logged instead of sent.");
    console.log("[Synthara Mail] To:", to.join(", "));
    console.log("[Synthara Mail] Subject:", input.subject);
    console.log("[Synthara Mail] Text:", input.text ?? "(html only)");
    if (process.env.NODE_ENV === "development") {
      console.log("[Synthara Mail] HTML preview length:", input.html.length);
    }
    return { id: "dev-logged-email" };
  }

  const { data, error } = await client.emails.send({
    from: config.from,
    to,
    subject: input.subject,
    html: input.html,
    text: input.text,
    replyTo: input.replyTo ?? config.replyTo,
    tags: input.tags,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export { isEmailDeliveryConfigured };
