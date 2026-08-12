import { NextResponse } from "next/server";

import { OwnershipError, assertProjectOwner } from "@/lib/auth/ownership";
import { requireVerifiedApiSession } from "@/lib/auth/session";
import { aggregateSearch } from "@/lib/search/aggregator";
import { searchRequestSchema } from "@/lib/validation/search";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const maxDuration = 40;

export async function POST(request: Request, context: RouteContext) {
  const authResult = await requireVerifiedApiSession();
  if ("response" in authResult) {
    return authResult.response;
  }
  const { session } = authResult;
  const { id } = await context.params;

  const body = await request.json();
  const parsed = searchRequestSchema.safeParse(body);

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
    const project = await assertProjectOwner(id, session.user.id);
    const query = parsed.data.query?.trim() || project.topic;

    const result = await aggregateSearch({
      query,
      channels: parsed.data.channels,
      projectId: id,
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof OwnershipError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    if (error instanceof Error && error.message.includes("timed out")) {
      return NextResponse.json({ error: error.message }, { status: 504 });
    }

    return NextResponse.json({ error: "Unable to run search." }, { status: 500 });
  }
}
