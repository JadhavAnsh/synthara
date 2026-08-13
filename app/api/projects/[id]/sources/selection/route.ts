import { NextResponse } from "next/server";

import { OwnershipError, assertProjectOwner } from "@/lib/auth/ownership";
import { requireVerifiedApiSession } from "@/lib/auth/session";
import { connectDB } from "@/lib/db/mongoose";
import { Source } from "@/lib/db/models";
import { updateSourceSelectionSchema } from "@/lib/validation/document";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const authResult = await requireVerifiedApiSession();
  if ("response" in authResult) {
    return authResult.response;
  }
  const { session } = authResult;
  const { id } = await context.params;

  const body = await request.json();
  const parsed = updateSourceSelectionSchema.safeParse(body);

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
    await assertProjectOwner(id, session.user.id);
    await connectDB();

    const selectedIds = new Set(parsed.data.sourceIds);

    await Source.updateMany({ projectId: id }, { $set: { selected: false } });

    if (selectedIds.size > 0) {
      await Source.updateMany(
        { projectId: id, _id: { $in: [...selectedIds] } },
        { $set: { selected: true } },
      );
    }

    const sources = await Source.find({ projectId: id }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      sources: sources.map((source) => ({
        id: source._id.toString(),
        title: source.title,
        authors: source.authors,
        url: source.url,
        sourceType: source.sourceType,
        snippets: source.snippets,
        credibilitySignals: (source.credibilitySignals as Record<string, unknown>) ?? {},
        externalId: source.externalId,
        selected: Boolean(source.selected),
        createdAt: source.createdAt,
        updatedAt: source.updatedAt,
      })),
    });
  } catch (error) {
    if (error instanceof OwnershipError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "Unable to update source selection." }, { status: 500 });
  }
}
