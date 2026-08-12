import mongoose from "mongoose";
import { NextResponse } from "next/server";

import { OwnershipError, assertProjectOwner } from "@/lib/auth/ownership";
import { requireVerifiedApiSession } from "@/lib/auth/session";
import { connectDB } from "@/lib/db/mongoose";
import { Source } from "@/lib/db/models";
import { addSourcesSchema } from "@/lib/validation/search";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function serializeSource(source: {
  _id: mongoose.Types.ObjectId;
  title: string;
  authors: string[];
  url: string;
  sourceType: string;
  snippets: string[];
  credibilitySignals: Record<string, unknown>;
  externalId: string;
  createdAt?: Date;
  updatedAt?: Date;
}) {
  return {
    id: source._id.toString(),
    title: source.title,
    authors: source.authors,
    url: source.url,
    sourceType: source.sourceType,
    snippets: source.snippets,
    credibilitySignals: source.credibilitySignals,
    externalId: source.externalId,
    createdAt: source.createdAt,
    updatedAt: source.updatedAt,
  };
}

export async function GET(_request: Request, context: RouteContext) {
  const authResult = await requireVerifiedApiSession();
  if ("response" in authResult) {
    return authResult.response;
  }
  const { session } = authResult;
  const { id } = await context.params;

  try {
    await assertProjectOwner(id, session.user.id);
    await connectDB();

    const sources = await Source.find({ projectId: id }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      sources: sources.map((source) =>
        serializeSource({
          ...source,
          _id: source._id,
          credibilitySignals: (source.credibilitySignals as Record<string, unknown>) ?? {},
        }),
      ),
    });
  } catch (error) {
    if (error instanceof OwnershipError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "Unable to fetch sources." }, { status: 500 });
  }
}

export async function POST(request: Request, context: RouteContext) {
  const authResult = await requireVerifiedApiSession();
  if ("response" in authResult) {
    return authResult.response;
  }
  const { session } = authResult;
  const { id } = await context.params;

  const body = await request.json();
  const parsed = addSourcesSchema.safeParse(body);

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

    const savedSources = [];

    for (const sourceInput of parsed.data.sources) {
      const source = await Source.findOneAndUpdate(
        {
          projectId: id,
          externalId: sourceInput.externalId,
        },
        {
          projectId: id,
          title: sourceInput.title,
          authors: sourceInput.authors,
          url: sourceInput.url,
          sourceType: sourceInput.sourceType,
          snippets: sourceInput.snippets,
          credibilitySignals: sourceInput.credibilitySignals,
          externalId: sourceInput.externalId,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      ).lean();

      if (source) {
        savedSources.push(
          serializeSource({
            ...source,
            _id: source._id,
            credibilitySignals: (source.credibilitySignals as Record<string, unknown>) ?? {},
          }),
        );
      }
    }

    return NextResponse.json({ sources: savedSources }, { status: 201 });
  } catch (error) {
    if (error instanceof OwnershipError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "Unable to save sources." }, { status: 500 });
  }
}
