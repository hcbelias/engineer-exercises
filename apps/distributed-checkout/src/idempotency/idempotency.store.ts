// TODO: Implement an idempotency store.
//
// Idempotency ensures that retrying a request doesn't execute it twice.
// The client sends an Idempotency-Key header; the server stores the result
// of the first execution and returns it on subsequent requests with the same key.
//
// States:
//   "pending"   — the request is currently in flight
//   "completed" — the request finished successfully (result stored)
//   "failed"    — the request failed (error stored)
//
// Requirements:
// 1. getOrExecute(key, fn):
//    a. If key is "pending" → wait for it to complete (poll or use a promise)
//    b. If key is "completed" → return the stored result immediately
//    c. If key is "failed" → rethrow the stored error (allows explicit retry with same key)
//       (some APIs reset on failure; for this exercise always return stored error)
//    d. If key is unknown → mark as "pending", execute fn(), store result, return it
//
// 2. The store is in-memory (Map). Thread-safe because Node.js is single-threaded.
//
// 3. The "pending" wait in step (1a) is important — without it, if the same key
//    is received twice while the first is still executing, you'd run fn() twice.
//    Use a Map<key, Promise> to track in-flight operations.
//
// Discussion: This in-memory store breaks with multiple server instances.
// What would you use instead? (Redis SETNX, a database unique constraint, etc.)

type IdempotencyEntry<T> =
  | { status: "pending"; promise: Promise<T> }
  | { status: "completed"; result: T }
  | { status: "failed"; error: Error };

const store = new Map<string, IdempotencyEntry<unknown>>();

export const idempotencyStore = {
  getOrExecute<T>(key: string, fn: () => Promise<T>): Promise<T> {
    const existing = store.get(key) as IdempotencyEntry<T> | undefined;

    if (existing) {
      if (existing.status === "pending") return existing.promise;
      if (existing.status === "completed") return Promise.resolve(existing.result);
      if (existing.status === "failed") return Promise.reject(existing.error);
    }

    // TODO: implement the new-key path
    // Mark as pending immediately (before awaiting) so concurrent requests
    // with the same key share the same in-flight promise instead of running twice.
    throw new Error("TODO: implement new-key path in idempotencyStore.getOrExecute");
  },

  // Expose for testing
  clear() {
    store.clear();
  },
};
