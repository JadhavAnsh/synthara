import { NextResponse } from "next/server";

import { processAllPendingSearchJobs } from "@/lib/search/queue";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const result = await processAllPendingSearchJobs();
  return NextResponse.json(result);
}
