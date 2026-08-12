import mongoose from "mongoose";

import { connectDB } from "@/lib/db/mongoose";
import { SearchJob } from "@/lib/db/models/search-job";
import { DEFAULT_SEARCH_TIMEOUT_MS, MAX_SEARCH_JOB_ATTEMPTS } from "@/lib/search/config";
import { mapSearchError } from "@/lib/search/errors";
import { getSearchProvider } from "@/lib/search/providers";
import type { ChannelSearchResult, SearchChannel } from "@/lib/search/types";

const RETRY_BACKOFF_MS = [30_000, 120_000, 300_000];

export async function enqueueSearchJob(input: {
  projectId: string;
  query: string;
  channel: SearchChannel;
  error: string;
}) {
  try {
    await connectDB();

    await SearchJob.create({
      projectId: new mongoose.Types.ObjectId(input.projectId),
      query: input.query,
      channel: input.channel,
      status: "pending",
      attempts: 0,
      maxAttempts: MAX_SEARCH_JOB_ATTEMPTS,
      lastError: input.error,
      runAfter: new Date(Date.now() + RETRY_BACKOFF_MS[0]),
    });
  } catch {
    // Queue failures should not block the live search response.
  }
}

async function runSearchJob(jobId: mongoose.Types.ObjectId) {
  const job = await SearchJob.findById(jobId);
  if (!job || job.status !== "pending" || job.runAfter > new Date()) {
    return null;
  }

  job.status = "processing";
  job.attempts += 1;
  await job.save();

  try {
    const provider = getSearchProvider(job.channel);
    const results = await provider.search(job.query, {
      signal: AbortSignal.timeout(DEFAULT_SEARCH_TIMEOUT_MS),
    });
    job.status = "done";
    job.lastError = "";
    await job.save();

    return {
      channel: job.channel,
      status: results.length ? ("success" as const) : ("empty" as const),
      results,
    } satisfies ChannelSearchResult;
  } catch (error) {
    const mapped = mapSearchError(error);
    job.lastError = mapped.message;

    if (job.attempts >= job.maxAttempts) {
      job.status = "failed";
    } else {
      job.status = "pending";
      const delay = RETRY_BACKOFF_MS[Math.min(job.attempts - 1, RETRY_BACKOFF_MS.length - 1)];
      job.runAfter = new Date(Date.now() + delay);
    }

    await job.save();
    return null;
  }
}

export async function processPendingSearchJobs(projectId: string, limit = 3) {
  try {
    await connectDB();

    const jobs = await SearchJob.find({
      projectId: new mongoose.Types.ObjectId(projectId),
      status: "pending",
      runAfter: { $lte: new Date() },
    })
      .sort({ runAfter: 1 })
      .limit(limit);

    const recovered: ChannelSearchResult[] = [];

    for (const job of jobs) {
      const result = await runSearchJob(job._id);
      if (result) {
        recovered.push(result);
      }
    }

    return recovered;
  } catch {
    return [];
  }
}

// Future migration path: swap this inline processor for a Redis/BullMQ worker
// without changing API routes or UI contracts.
