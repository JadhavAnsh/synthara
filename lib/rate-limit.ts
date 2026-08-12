import { connectDB } from "@/lib/db/mongoose";
import { RateLimitBucket } from "@/lib/db/models/rate-limit-bucket";
import { logWarn } from "@/lib/logger";

export class RateLimitExceededError extends Error {
  readonly retryAfterSeconds: number;

  constructor(message: string, retryAfterSeconds: number) {
    super(message);
    this.name = "RateLimitExceededError";
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

type ConsumeRateLimitInput = {
  key: string;
  limit: number;
  windowMs: number;
};

export async function consumeRateLimit(input: ConsumeRateLimitInput) {
  try {
    await connectDB();

    const now = Date.now();
    const windowStartMs = Math.floor(now / input.windowMs) * input.windowMs;
    const bucketKey = `${input.key}:${windowStartMs}`;
    const expiresAt = new Date(windowStartMs + input.windowMs);

    const bucket = await RateLimitBucket.findOneAndUpdate(
      { key: bucketKey },
      {
        $inc: { count: 1 },
        $setOnInsert: { expiresAt },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).lean();

    if (!bucket || bucket.count > input.limit) {
      const retryAfterSeconds = Math.max(1, Math.ceil((expiresAt.getTime() - now) / 1000));
      throw new RateLimitExceededError(
        "Too many search requests. Please wait before searching again.",
        retryAfterSeconds,
      );
    }
  } catch (error) {
    if (error instanceof RateLimitExceededError) {
      throw error;
    }

    logWarn("rate-limit", "bucket.failed", {
      key: input.key,
      message: error instanceof Error ? error.message : "Unknown rate limit error",
    });
  }
}

export const SEARCH_RATE_LIMIT = {
  limit: 30,
  windowMs: 60 * 60 * 1000,
} as const;

export function buildSearchRateLimitKey(userId: string) {
  return `search:${userId}`;
}
