import { validateEmailAddress } from "@/lib/email/validate";
import { getMongoDb } from "@/lib/mongodb";

type EmailAvailabilityResult =
  | { available: true; normalized: string }
  | { available: false; normalized?: string; error?: string };

export async function checkEmailAvailability(
  email: string,
): Promise<EmailAvailabilityResult> {
  const validation = validateEmailAddress(email);

  if (!validation.valid) {
    return { available: false, error: validation.error };
  }

  const db = await getMongoDb();
  const existingUser = await db.collection("user").findOne(
    { email: validation.normalized },
    { projection: { _id: 1 } },
  );

  if (existingUser) {
    return { available: false, normalized: validation.normalized };
  }

  return { available: true, normalized: validation.normalized };
}
