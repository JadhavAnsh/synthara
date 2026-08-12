export type EmailConfig = {
  apiKey: string | undefined;
  from: string;
  replyTo: string | undefined;
  appName: string;
  appUrl: string;
};

export function getEmailConfig(): EmailConfig {
  return {
    apiKey: process.env.RESEND_API_KEY,
    from: process.env.RESEND_FROM_EMAIL ?? "Synthara <onboarding@resend.dev>",
    replyTo: process.env.RESEND_REPLY_TO,
    appName: process.env.MAIL_APP_NAME ?? "Synthara",
    appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  };
}

export function isEmailDeliveryConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}
