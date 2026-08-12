export class SearchTimeoutError extends Error {
  constructor(message = "Search request timed out.") {
    super(message);
    this.name = "SearchTimeoutError";
  }
}

export class SearchRateLimitError extends Error {
  constructor(message = "Search provider rate limit reached.") {
    super(message);
    this.name = "SearchRateLimitError";
  }
}

export class SearchProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SearchProviderError";
  }
}

export function mapSearchError(error: unknown): { status: "timeout" | "rate_limited" | "error"; message: string } {
  if (error instanceof SearchTimeoutError) {
    return { status: "timeout", message: error.message };
  }

  if (error instanceof SearchRateLimitError) {
    return { status: "rate_limited", message: error.message };
  }

  if (error instanceof SearchProviderError) {
    return { status: "error", message: error.message };
  }

  if (error instanceof DOMException && error.name === "AbortError") {
    return { status: "timeout", message: "Search request timed out." };
  }

  if (error instanceof Error) {
    return { status: "error", message: error.message };
  }

  return { status: "error", message: "Unknown search error." };
}
