/**
 * Isolated unit tests for withRetry.
 * These tests use no real services — just plain functions.
 */
import { describe, it, before } from "node:test";
import assert from "node:assert/strict";
import { withRetry } from "../../src/retry/withRetry";
import { ServiceError } from "../../src/types";

// Small delays so the suite runs in milliseconds
const FAST: Partial<{ maxAttempts: number; baseDelayMs: number; maxDelayMs: number }> = {
  maxAttempts: 3,
  baseDelayMs: 1,
  maxDelayMs: 5,
};

describe("withRetry — pure unit tests", () => {
  it("returns the resolved value immediately when fn succeeds on first try", async () => {
    const result = await withRetry(() => Promise.resolve(42));
    assert.equal(result, 42);
  });

  it("works with a synchronous-throw fn (fn that throws, not rejects)", async () => {
    let calls = 0;
    const result = await withRetry(() => {
      calls++;
      if (calls < 2) throw new Error("oops");
      return Promise.resolve("recovered");
    }, FAST);
    assert.equal(result, "recovered");
    assert.equal(calls, 2);
  });

  it("retries up to maxAttempts times on retryable ServiceError", async () => {
    let calls = 0;
    await assert.rejects(
      () =>
        withRetry(() => {
          calls++;
          throw new ServiceError("transient", "svc", true);
        }, FAST),
      ServiceError
    );
    assert.equal(calls, 3, "should have tried exactly maxAttempts times");
  });

  it("does not retry on non-retryable ServiceError — stops after 1 attempt", async () => {
    let calls = 0;
    const thrown = await assert.rejects(
      () =>
        withRetry(() => {
          calls++;
          throw new ServiceError("card declined", "payment", false);
        }, FAST),
      ServiceError
    );
    assert.equal(calls, 1);
    assert.equal((thrown as ServiceError).message, "card declined");
  });

  it("retries non-ServiceError errors (unexpected failures treated as transient)", async () => {
    let calls = 0;
    await assert.rejects(
      () =>
        withRetry(() => {
          calls++;
          throw new Error("random crash");
        }, FAST)
    );
    // Non-ServiceError should be retried, so we expect maxAttempts calls
    assert.equal(calls, 3);
  });

  it("re-throws the LAST error after exhausting all attempts", async () => {
    let attempt = 0;
    const thrown = await assert.rejects(
      () =>
        withRetry(() => {
          attempt++;
          throw new ServiceError(`attempt ${attempt} failed`, "svc", true);
        }, FAST),
      ServiceError
    );
    assert.equal((thrown as ServiceError).message, "attempt 3 failed");
  });

  it("succeeds on the final attempt (attempt N)", async () => {
    let calls = 0;
    const result = await withRetry(() => {
      calls++;
      if (calls < 3) throw new ServiceError("retry me", "svc", true);
      return Promise.resolve("finally!");
    }, FAST);
    assert.equal(result, "finally!");
    assert.equal(calls, 3);
  });

  it("uses custom maxAttempts option", async () => {
    let calls = 0;
    await assert.rejects(
      () =>
        withRetry(
          () => {
            calls++;
            throw new ServiceError("t", "s", true);
          },
          { maxAttempts: 5, baseDelayMs: 1, maxDelayMs: 2 }
        ),
      ServiceError
    );
    assert.equal(calls, 5);
  });
});
