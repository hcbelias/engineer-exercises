import type { Request, Response } from "express";
import { idempotencyStore } from "../idempotency/idempotency.store";
import { executeCheckout } from "../saga/checkout.saga";
import { ServiceError } from "../types";
import { logger } from "../observability/logger";
import crypto from "node:crypto";

// TODO: Implement the checkout request handler.
//
// This is the entry point for POST /checkout.
//
// Requirements:
//
// 1. Extract Idempotency-Key header
//    - If missing: return 400 Bad Request with { error: "Idempotency-Key header is required" }
//
// 2. Parse and validate the request body:
//    - Required fields: orderId (string), userId (string), items (non-empty array)
//    - Return 400 if any are missing/invalid
//
// 3. Generate a correlationId for tracing this request through logs
//
// 4. Wrap the saga execution in idempotencyStore.getOrExecute(idempotencyKey, fn)
//    This ensures the saga runs at most once per idempotency key.
//
// 5. Handle the SagaResult:
//    - success: true  → 200 OK with the CheckoutResult
//    - success: false → map the error to the correct HTTP status:
//
//      failed step       | error type           | HTTP status
//      ------------------|----------------------|--------------------
//      reserveInventory  | non-retryable        | 409 Conflict
//      chargePayment     | non-retryable        | 402 Payment Required
//      any step          | retryable exhausted  | 503 Service Unavailable
//                        |                      | with Retry-After: 30 header
//      unexpected        | any                  | 500 Internal Server Error
//
// 6. Log the correlationId, idempotencyKey, and result/error at each major step.
//
// Discussion: Should this handler return 200 (synchronous) or 202 (async)?
// For this exercise, return 200 synchronously.
// Write a comment explaining the trade-off:
// - Sync (200): simpler client, but the HTTP request holds open for the saga duration (~300ms+)
// - Async (202): returns immediately with a jobId, client polls /checkout/status/:jobId
//   Better for long-running operations, but adds complexity on both sides.

export async function checkoutHandler(req: Request, res: Response): Promise<void> {
  const idempotencyKey = req.headers["idempotency-key"];

  // TODO: validate idempotency key
  if (!idempotencyKey || typeof idempotencyKey !== "string") {
    res.status(400).json({ error: "Idempotency-Key header is required" });
    return;
  }

  // TODO: validate request body
  const { orderId, userId, items } = req.body ?? {};
  if (!orderId || !userId || !Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: "Request body must include orderId, userId, and items[]" });
    return;
  }

  const correlationId = crypto.randomUUID();
  const log = logger.child({ correlationId, idempotencyKey, orderId });

  log.info("[checkout] request received");

  try {
    const result = await idempotencyStore.getOrExecute(idempotencyKey, () =>
      executeCheckout({ orderId, userId, items }, correlationId)
    );

    // TODO: handle saga result
    // - success: respond 200 with the CheckoutResult
    // - failure: map to the correct HTTP status based on which step failed and error type:
    //   reserveInventory non-retryable → 409, chargePayment non-retryable → 402,
    //   retryable exhausted → 503 with Retry-After header, unexpected → 500
    if (!result.success) {
      throw new Error("TODO: map saga failure to HTTP status");
    }

    log.info("[checkout] completed successfully");
    res.status(200).json(result.data);
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    log.error(`[checkout] unhandled error: ${error.message}`);

    res.status(500).json({ error: "Internal server error", correlationId });
  }
}
