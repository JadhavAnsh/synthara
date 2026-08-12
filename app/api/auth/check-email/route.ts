import { NextResponse } from "next/server";
import { z } from "zod";

import { checkEmailAvailability } from "@/lib/auth/check-email-availability";
import { emailFieldSchema } from "@/lib/validation/email";

const checkEmailSchema = z.object({
  email: emailFieldSchema,
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = checkEmailSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const result = await checkEmailAvailability(parsed.data.email);

  if (!result.available && "error" in result && result.error) {
    return NextResponse.json(
      { available: false, error: result.error },
      { status: 400 },
    );
  }

  return NextResponse.json({ available: result.available });
}
