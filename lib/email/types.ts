export type EmailAddress = string;

export type SendEmailInput = {
  to: EmailAddress | EmailAddress[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  tags?: Array<{ name: string; value: string }>;
};

export type EmailTemplateRenderResult = {
  subject: string;
  html: string;
  text: string;
};

export type VerificationEmailData = {
  verificationUrl: string;
  recipientName?: string;
};

export type WelcomeEmailData = {
  recipientName: string;
  dashboardUrl: string;
};
