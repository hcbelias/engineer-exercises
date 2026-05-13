import { ServiceError } from "../types";

interface RetryOptions {
  maxAttempts: number;
  baseDelayMs: number;
  maxDelayMs: number;
}

const DEFAULT_OPTIONS: RetryOptions = {
  maxAttempts: 3,
  baseDelayMs: 200,
  maxDelayMs: 5000,
};

// TODO: Implement withRetry
//
// A generic retry wrapper with exponential backoff + jitter.
//
// Formula:
//   delay = Math.min(baseDelayMs * 2^attempt, maxDelayMs)
//   delayWithJitter = delay * (0.5 + Math.random() * 0.5)
//   (jitter range: 50%–100% of delay)
//
// Why jitter? Without it, all retrying clients back off in sync, causing
// "retry storms" — the server gets hit by a wave of requests at the same
// time on each backoff interval. Jitter spreads them out.
//
// Rules:
// - Only retry if error.retryable === true (check instanceof ServiceError)
// - Non-ServiceError errors are always retried (unexpected — assume transient)
// - After maxAttempts, throw the LAST error
// - Attempt numbering: attempt 0 is the first try, attempt 1 is the first retry
//
// Usage:
//   const result = await withRetry(() => chargePayment(orderId, userId, amount), {
//     maxAttempts: 3,
//     baseDelayMs: 200,
//     maxDelayMs: 5000,
//   });

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: Error = new Error("No attempts made");

  for (let attempt = 0; attempt < opts.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));

      // TODO: check if retryable; throw immediately for non-retryable errors

      if (attempt < opts.maxAttempts - 1) {
        // TODO: calculate delay with exponential backoff + jitter and sleep
      }
    }
  }

  throw lastError;
}
