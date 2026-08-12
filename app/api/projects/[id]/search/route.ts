import { NextResponse } from "next/server";

import { OwnershipError, assertProjectOwner } from "@/lib/auth/ownership";
import { requireVerifiedApiSession } from "@/lib/auth/session";
import { logInfo, logWarn } from "@/lib/logger";
import {
  RateLimitExceededError,
  SEARCH_RATE_LIMIT,
  buildSearchRateLimitKey,
  consumeRateLimit,
} from "@/lib/rate-limit";
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
    await consumeRateLimit({
      key: buildSearchRateLimitKey(session.user.id),
      limit: SEARCH_RATE_LIMIT.limit,
      windowMs: SEARCH_RATE_LIMIT.windowMs,
    });

    const project = await assertProjectOwner(id, session.user.id);
    const query = parsed.data.query?.trim() || project.topic;

    logInfo("search-api", "request.start", {
      projectId: id,
      userId: session.user.id,
      skipCache: Boolean(parsed.data.skipCache),
      channels: parsed.data.channels ?? ["web", "academic", "github"],
    });

    const result = await aggregateSearch({
      query,
      channels: parsed.data.channels,
      projectId: id,
      skipCache: parsed.data.skipCache,
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof OwnershipError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    if (error instanceof RateLimitExceededError) {
      logWarn("search-api", "request.rate_limited", { userId: session.user.id, projectId: id });
      return NextResponse.json(
        { error: error.message },
        {
          status: 429,
          headers: { "Retry-After": String(error.retryAfterSeconds) },
        },
      );
    }

    if (error instanceof Error && error.message.includes("timed out")) {
      return NextResponse.json({ error: error.message }, { status: 504 });
    }

    logWarn("search-api", "request.failed", {
      projectId: id,
      userId: session.user.id,
      message: error instanceof Error ? error.message : "Unknown search error",
    });

    return NextResponse.json({ error: "Unable to run search." }, { status: 500 });
  }
}
