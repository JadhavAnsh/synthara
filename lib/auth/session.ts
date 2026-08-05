import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

import { auth, type Session } from "@/lib/auth";

export async function getServerSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

export async function requireServerSession() {
  const session = await getServerSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  return session;
}

export async function requireVerifiedSession() {
  const session = await getServerSession();

  if (!session) {
    redirect("/sign-in");
  }

  if (!session.user.emailVerified) {
    redirect("/verify-email");
  }

  return session;
}

type VerifiedApiResult =
  | { session: Session }
  | { response: NextResponse };

export async function requireVerifiedApiSession(): Promise<VerifiedApiResult> {
  const session = await getServerSession();

  if (!session) {
    return {
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  if (!session.user.emailVerified) {
    return {
      response: NextResponse.json(
        { error: "Email verification required" },
        { status: 403 },
      ),
    };
  }

  return { session };
}
