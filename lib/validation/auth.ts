import { z } from "zod";

import { emailFieldSchema } from "@/lib/validation/email";

export const signInSchema = z.object({
  email: emailFieldSchema,
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters"),
});

export const signUpSchema = signInSchema.extend({
  name: z
    .string()
    .trim()
    .max(80, "Name must be at most 80 characters")
    .optional(),
});

export const verifyEmailRequestSchema = z.object({
  email: emailFieldSchema,
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
