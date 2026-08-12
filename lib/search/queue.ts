import mongoose from "mongoose";

import { connectDB } from "@/lib/db/mongoose";
import { SearchJob } from "@/lib/db/models/search-job";
import { logError, logInfo, logWarn } from "@/lib/logger";
import { setCachedChannelResult } from "@/lib/search/cache";
import { DEFAULT_SEARCH_TIMEOUT_MS, MAX_SEARCH_JOB_ATTEMPTS } from "@/lib/search/config";
import { mapSearchError } from "@/lib/search/errors";
import { normalizeSources } from "@/lib/search/normalize";
import { getSearchProvider } from "@/lib/search/providers";
import type { ChannelSearchResult, SearchChannel } from "@/lib/search/types";

const RETRY_BACKOFF_MS = [30_000, 120_000, 300_000];

export async function enqueueSearchJob(input: {
  projectId: string;
  query: string;
  channels: SearchChannel[];
  channel: SearchChannel;
  error: string;
}) {
  try {
    await connectDB();

    const projectId = new mongoose.Types.ObjectId(input.projectId);
    const existing = await SearchJob.findOne({
      projectId,
      query: input.query,
      channel: input.channel,
      status: { $in: ["pending", "processing"] },
    }).lean();

    if (existing) {
      logInfo("search-queue", "job.deduped", {
        projectId: input.projectId,
        channel: input.channel,
        query: input.query,
      });
      return;
    }

    await SearchJob.create({
      projectId,
      query: input.query,
      channels: input.channels,
      channel: input.channel,
      status: "pending",
      attempts: 0,
      maxAttempts: MAX_SEARCH_JOB_ATTEMPTS,
      lastError: input.error,
      runAfter: new Date(Date.now() + RETRY_BACKOFF_MS[0]),
    });

    logInfo("search-queue", "job.enqueued", {
      projectId: input.projectId,
      channel: input.channel,
      query: input.query,
    });
  } catch (error) {
    logWarn("search-queue", "job.enqueue_failed", {
      projectId: input.projectId,
      channel: input.channel,
      message: error instanceof Error ? error.message : "Unknown enqueue error",
    });
  }
}

async function runSearchJob(jobId: mongoose.Types.ObjectId): Promise<ChannelSearchResult | null> {
  const job = await SearchJob.findById(jobId);
  if (!job || job.status !== "pending" || job.runAfter > new Date()) {
    return null;
  }

  job.status = "processing";
  job.attempts += 1;
  await job.save();

  try {
    const provider = getSearchProvider(job.channel);
    const results = normalizeSources(
      await provider.search(job.query, {
        signal: AbortSignal.timeout(DEFAULT_SEARCH_TIMEOUT_MS),
      }),
    );
    const result: ChannelSearchResult = {
      channel: job.channel,
      status: results.length ? "success" : "empty",
      results,
    };

    job.status = "done";
    job.lastError = "";
    await job.save();

    await setCachedChannelResult(job.query, job.channel, result);

    logInfo("search-queue", "job.recovered", {
      projectId: String(job.projectId),
      channel: job.channel,
      query: job.query,
      status: result.status,
      resultCount: result.results.length,
    });

    return result;
  } catch (error) {
    const mapped = mapSearchError(error);
    job.lastError = mapped.message;

    if (job.attempts >= job.maxAttempts) {
      job.status = "failed";
      logWarn("search-queue", "job.failed", {
        projectId: String(job.projectId),
        channel: job.channel,
        query: job.query,
        attempts: job.attempts,
        message: mapped.message,
      });
    } else {
      job.status = "pending";
      const delay = RETRY_BACKOFF_MS[Math.min(job.attempts - 1, RETRY_BACKOFF_MS.length - 1)];
      job.runAfter = new Date(Date.now() + delay);
      logInfo("search-queue", "job.retry_scheduled", {
        projectId: String(job.projectId),
        channel: job.channel,
        query: job.query,
        attempts: job.attempts,
        delayMs: delay,
      });
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

    if (recovered.length > 0) {
      logInfo("search-queue", "jobs.processed", {
        projectId,
        recoveredCount: recovered.length,
      });
    }

    return recovered;
  } catch (error) {
    logError("search-queue", "jobs.process_failed", {
      projectId,
      message: error instanceof Error ? error.message : "Unknown queue processing error",
    });
    return [];
  }
}

// Future migration path: swap this inline processor for a Redis/BullMQ worker
// without changing API routes or UI contracts.
