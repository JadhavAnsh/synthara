import { getEmailConfig } from "@/lib/email/config";
import { sendTemplatedEmail } from "@/lib/email/send";

type WelcomeEmailPayload = {
  to: string;
  recipientName: string;
};

export async function sendWelcomeEmailMessage({
  to,
  recipientName,
}: WelcomeEmailPayload) {
  const { appUrl } = getEmailConfig();

  return sendTemplatedEmail({
    to,
    template: "welcome",
    data: {
      recipientName,
      dashboardUrl: `${appUrl}/projects`,
    },
    tags: [{ name: "category", value: "welcome" }],
  });
}
