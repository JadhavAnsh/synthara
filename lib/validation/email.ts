import { z } from "zod";

import { validateEmailAddress } from "@/lib/email/validate";

export const emailFieldSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .superRefine((value, context) => {
    const result = validateEmailAddress(value);

    if (!result.valid) {
      context.addIssue({
        code: "custom",
        message: result.error,
      });
    }
  });

export const customEmailSchema = z
  .object({
    to: emailFieldSchema,
    subject: z.string().trim().min(1, "Subject is required").max(200),
    html: z.string().trim().min(1, "HTML body is required").optional(),
    text: z.string().trim().min(1, "Text body is required").optional(),
    template: z.enum(["verification", "welcome"]).optional(),
    templateData: z.record(z.string(), z.unknown()).optional(),
  })
  .refine((value) => Boolean(value.html || value.text || value.template), {
    message: "Provide html, text, or a template",
    path: ["html"],
  });

export type CustomEmailInput = z.infer<typeof customEmailSchema>;
