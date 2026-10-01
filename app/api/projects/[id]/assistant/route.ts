import mongoose from "mongoose";
import { NextResponse } from "next/server";

import { streamGroundedAssistant } from "@/lib/ai/assistant";
import { getProjectAiUsage } from "@/lib/ai/usage";
import { OwnershipError, assertProjectOwner } from "@/lib/auth/ownership";
import { requireVerifiedApiSession } from "@/lib/auth/session";
import { connectDB } from "@/lib/db/mongoose";
import { Source } from "@/lib/db/models";
import { assistantRequestSchema } from "@/lib/validation/assistant";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const maxDuration = 120;

function errorResponse(error: unknown) {
  if (error instanceof OwnershipError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  return NextResponse.json(
    { error: error instanceof Error ? error.message : "Unable to run the assistant." },
    { status: 500 },
  );
}

export async function GET(_request: Request, context: RouteContext) {
  const authResult = await requireVerifiedApiSession();
  if ("response" in authResult) {
    return authResult.response;
  }

  const { id } = await context.params;

  try {
    await assertProjectOwner(id, authResult.session.user.id);
    const usage = await getProjectAiUsage(authResult.session.user.id, id);
    return NextResponse.json({ usage });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request, context: RouteContext) {
  const authResult = await requireVerifiedApiSession();
  if ("response" in authResult) {
    return authResult.response;
  }

  const { id } = await context.params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const parsed = assistantRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Unsupported or invalid assistant action.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    await assertProjectOwner(id, authResult.session.user.id);
    await connectDB();

    const usage = await getProjectAiUsage(authResult.session.user.id, id);
    if (usage.remainingTokens <= 0) {
      return NextResponse.json(
        { error: "The monthly development AI token budget has been reached." },
        { status: 429 },
      );
    }

    const selectedSources = await Source.find({ projectId: id, selected: true })
      .sort({ createdAt: -1 })
      .limit(12)
      .lean();

    if (selectedSources.length === 0) {
      return NextResponse.json(
        { error: "Select at least one project source before using the assistant." },
        { status: 409 },
      );
    }

    const sourceId = parsed.data.sourceId;
    if (sourceId && !mongoose.Types.ObjectId.isValid(sourceId)) {
      return NextResponse.json({ error: "Invalid source selection." }, { status: 400 });
    }

    const chosenSource = sourceId
      ? selectedSources.find((source) => source._id.toString() === sourceId)
      : undefined;
    const requiresChosenSource =
      parsed.data.action === "summarize_source" || parsed.data.action === "insert_citation";

    if (requiresChosenSource && !chosenSource) {
      return NextResponse.json(
        { error: "Choose a selected project source for this action." },
        { status: 409 },
      );
    }

    if (parsed.data.action === "rewrite_section" && !parsed.data.editorSelection) {
      return NextResponse.json(
        { error: "Select text in the editor before using Rewrite selection." },
        { status: 409 },
      );
    }

    const contextSources = chosenSource ? [chosenSource] : selectedSources;
    const result = streamGroundedAssistant({
      request: parsed.data,
      sources: contextSources.map((source) => ({
        id: source._id.toString(),
        title: source.title,
        authors: source.authors,
        url: source.url,
        sourceType: source.sourceType,
        snippets: source.snippets,
        credibilitySignals: (source.credibilitySignals as Record<string, unknown>) ?? {},
      })),
      userId: authResult.session.user.id,
      projectId: id,
    });

    return result.toTextStreamResponse({
      headers: {
        "Cache-Control": "no-store",
        "X-Synthara-Assistant-Action": parsed.data.action,
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
