import { NextResponse } from "next/server";
import { z } from "zod";

import { getEmailConfig } from "@/lib/email/config";
import { sendCustomEmail, sendTemplatedEmail } from "@/lib/email";
import { requireVerifiedApiSession } from "@/lib/auth/session";
import { customEmailSchema, emailFieldSchema } from "@/lib/validation/email";

const templatedEmailSchema = z.discriminatedUnion("template", [
  z.object({
    to: emailFieldSchema,
    subject: z.string().trim().min(1).max(200).optional(),
    template: z.literal("verification"),
    templateData: z.object({
      verificationUrl: z.string().url(),
      recipientName: z.string().optional(),
    }),
  }),
  z.object({
    to: emailFieldSchema,
    subject: z.string().trim().min(1).max(200).optional(),
    template: z.literal("welcome"),
    templateData: z.object({
      recipientName: z.string().min(1),
      dashboardUrl: z.string().url(),
    }),
  }),
]);

const customBodyEmailSchema = z.object({
  to: emailFieldSchema,
  subject: z.string().trim().min(1).max(200),
  html: z.string().trim().min(1),
  text: z.string().trim().min(1).optional(),
});

export async function POST(request: Request) {
  const authResult = await requireVerifiedApiSession();

  if ("response" in authResult) {
    return authResult.response;
  }

  const body = await request.json();

  if (body.template) {
    const parsed = templatedEmailSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    try {
      const result = await sendTemplatedEmail({
        to: parsed.data.to,
        template: parsed.data.template,
        data: parsed.data.templateData,
        subject: parsed.data.subject,
      });

      return NextResponse.json({ success: true, id: result?.id ?? null });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to send email.";

      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  const parsed = customBodyEmailSchema.safeParse(body);

  if (!parsed.success) {
    const fallback = customEmailSchema.safeParse(body);

    return NextResponse.json(
      {
        error: "Validation failed",
        issues: (fallback.success ? {} : fallback.error.flatten().fieldErrors) ||
          parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    const result = await sendCustomEmail({
      to: parsed.data.to,
      subject: parsed.data.subject,
      html: parsed.data.html,
      text: parsed.data.text,
      tags: [{ name: "category", value: "custom" }],
    });

    return NextResponse.json({ success: true, id: result?.id ?? null });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to send email.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  const config = getEmailConfig();

  return NextResponse.json({
    configured: Boolean(config.apiKey),
    from: config.from,
    templates: ["verification", "welcome"],
  });
}
