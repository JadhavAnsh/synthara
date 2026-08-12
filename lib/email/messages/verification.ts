import { sendTemplatedEmail } from "@/lib/email/send";

type VerificationEmailPayload = {
  to: string;
  url: string;
  recipientName?: string;
};

const recentVerificationSends = new Map<string, number>();
const DEDUPE_WINDOW_MS = 60_000;

export async function sendVerificationEmailMessage({
  to,
  url,
  recipientName,
}: VerificationEmailPayload) {
  const now = Date.now();
  const lastSentAt = recentVerificationSends.get(to);

  if (lastSentAt && now - lastSentAt < DEDUPE_WINDOW_MS) {
    console.log(
      `[Synthara Mail] Skipped duplicate verification email to ${to} within ${DEDUPE_WINDOW_MS}ms.`,
    );
    return { id: "deduped-verification-email" };
  }

  recentVerificationSends.set(to, now);

  return sendTemplatedEmail({
    to,
    template: "verification",
    data: {
      verificationUrl: url,
      recipientName,
    },
    tags: [{ name: "category", value: "verification" }],
  });
}
