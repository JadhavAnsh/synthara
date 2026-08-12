import { NextResponse } from "next/server";

import { OwnershipError, assertProjectOwner } from "@/lib/auth/ownership";
import { requireVerifiedApiSession } from "@/lib/auth/session";
import { connectDB } from "@/lib/db/mongoose";
import { Source } from "@/lib/db/models";

type RouteContext = {
  params: Promise<{ id: string; sourceId: string }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  const authResult = await requireVerifiedApiSession();
  if ("response" in authResult) {
    return authResult.response;
  }
  const { session } = authResult;
  const { id, sourceId } = await context.params;

  try {
    await assertProjectOwner(id, session.user.id);
    await connectDB();

    const deleted = await Source.findOneAndDelete({
      _id: sourceId,
      projectId: id,
    });

    if (!deleted) {
      return NextResponse.json({ error: "Source not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof OwnershipError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "Unable to delete source." }, { status: 500 });
  }
}
