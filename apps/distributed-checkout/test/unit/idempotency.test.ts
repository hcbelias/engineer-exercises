/**
 * Isolated unit tests for idempotencyStore.
 * Tests cover the four store states: new key, pending, completed, failed.
 */
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { idempotencyStore } from "../../src/idempotency/idempotency.store";

describe("idempotencyStore — pure unit tests", () => {
  beforeEach(() => {
    idempotencyStore.clear();
  });

  it("executes the function for a new key and returns its result", async () => {
    const result = await idempotencyStore.getOrExecute("key-new", () =>
      Promise.resolve("hello")
    );
    assert.equal(result, "hello");
  });

  it("executes the function exactly once for the same key (concurrent calls)", async () => {
    let callCount = 0;
    const fn = () => {
      callCount++;
      return Promise.resolve("concurrent-result");
    };

    const [a, b, c] = await Promise.all([
      idempotencyStore.getOrExecute("key-concurrent", fn),
      idempotencyStore.getOrExecute("key-concurrent", fn),
      idempotencyStore.getOrExecute("key-concurrent", fn),
    ]);

    assert.equal(a, "concurrent-result");
    assert.equal(b, "concurrent-result");
    assert.equal(c, "concurrent-result");
    assert.equal(callCount, 1, "fn must only be invoked once despite concurrent requests");
  });

  it("returns the cached result on subsequent sequential calls", async () => {
    let callCount = 0;
    const fn = () => {
      callCount++;
      return Promise.resolve({ orderId: "order_42" });
    };

    const first = await idempotencyStore.getOrExecute("key-seq", fn);
    const second = await idempotencyStore.getOrExecute("key-seq", fn);
    const third = await idempotencyStore.getOrExecute("key-seq", fn);

    assert.deepEqual(first, { orderId: "order_42" });
    assert.deepEqual(second, { orderId: "order_42" });
    assert.deepEqual(third, { orderId: "order_42" });
    assert.equal(callCount, 1);
  });

  it("stores errors and re-throws them on all subsequent calls without re-running fn", async () => {
    const originalError = new Error("downstream exploded");
    let callCount = 0;
    const fn = () => {
      callCount++;
      return Promise.reject(originalError);
    };

    // First call — should reject
    await assert.rejects(() => idempotencyStore.getOrExecute("key-fail", fn), {
      message: "downstream exploded",
    });

    // Second call — should also reject with the same stored error
    const secondErr = await assert.rejects(
      () => idempotencyStore.getOrExecute("key-fail", fn),
      {
        message: "downstream exploded",
      }
    );

    // fn must only have been called once
    assert.equal(callCount, 1);
    // The re-thrown error should be the same object (identity)
    assert.equal(secondErr, originalError);
  });

  it("different keys are independent — each triggers its own execution", async () => {
    let aCount = 0;
    let bCount = 0;

    await idempotencyStore.getOrExecute("key-a", () => {
      aCount++;
      return Promise.resolve("a");
    });
    await idempotencyStore.getOrExecute("key-b", () => {
      bCount++;
      return Promise.resolve("b");
    });

    assert.equal(aCount, 1);
    assert.equal(bCount, 1);
  });

  it("clear() resets the store so the same key triggers a fresh execution", async () => {
    let callCount = 0;
    const fn = () => {
      callCount++;
      return Promise.resolve("fresh");
    };

    await idempotencyStore.getOrExecute("key-reset", fn);
    assert.equal(callCount, 1);

    idempotencyStore.clear();

    await idempotencyStore.getOrExecute("key-reset", fn);
    assert.equal(callCount, 2, "after clear, fn should run again for the same key");
  });
});
