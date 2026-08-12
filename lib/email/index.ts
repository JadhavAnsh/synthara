export { deliverEmail, isEmailDeliveryConfigured } from "@/lib/email/client";
export { getEmailConfig } from "@/lib/email/config";
export { sendWelcomeEmailMessage } from "@/lib/email/messages/welcome";
export { sendVerificationEmailMessage } from "@/lib/email/messages/verification";
export { sendCustomEmail, sendEmail, sendTemplatedEmail } from "@/lib/email/send";
export { renderEmailTemplate, emailTemplates } from "@/lib/email/templates";
export type { EmailTemplateId } from "@/lib/email/templates";
export {
  assertValidEmail,
  validateEmailAddress,
  type EmailValidationResult,
} from "@/lib/email/validate";
