# Exercise 5 — Distributed Checkout System

Build the backend for a multi-step checkout flow that spans three downstream services. Handle partial failures correctly, support idempotent retries, and keep the system consistent.

## The problem

In distributed systems, you can't wrap three service calls in a single database transaction. When step 2 of 3 fails, you need to undo step 1. When a network error causes a client to retry, you must not charge the customer twice. When a service is temporarily down, you should retry with backoff — but not for business rule violations (card declined).

This exercise forces you to implement these patterns correctly from first principles.

## Architecture

```
POST /checkout
    │
    ▼
[idempotency check] ──already done──► return stored result
    │ new key
    ▼
[saga orchestrator]
    │
    ├─► 1. reserveInventory()   ◄── compensate: releaseInventory()
    │
    ├─► 2. chargePayment()      ◄── compensate: refundPayment()
    │
    └─► 3. createShipment()     ◄── compensate: cancelShipment()
```

If step 2 fails: `cancelShipment` is skipped (never ran), `refundPayment` runs, `releaseInventory` runs. Steps compensate in reverse order.

## What's pre-scaffolded

| File | Status |
|------|--------|
| `src/types.ts` | Done — `CheckoutRequest`, `CheckoutResult`, `ServiceError` with `retryable` flag |
| `src/services/*.service.ts` | Done — simulated services with configurable failure rates |
| `src/saga/saga.types.ts` | Done — typed `SagaStep<T>` and `SagaResult<T>` |
| `src/observability/logger.ts` | Done — structured JSON logger with child loggers |
| `src/routes/checkout.router.ts` | Done — mounts handler on POST /checkout |
| `src/index.ts` | Done — Express bootstrap |
| `src/saga/checkout.saga.ts` | Partial — **saga executor partial, `executeCheckout` is TODO** |
| `src/retry/withRetry.ts` | Partial — **delay and retry logic is TODO** |
| `src/idempotency/idempotency.store.ts` | Partial — **new-key execution path is TODO** |
| `src/handlers/checkout.handler.ts` | Partial — **saga result mapping and error responses are TODO** |
| `test/checkout.test.ts` | Stub — **all test bodies are TODO** |

## Your TODOs

### 1. `src/retry/withRetry.ts`
Implement retry logic with exponential backoff and jitter. Retries should not happen for errors that are non-retryable (e.g. a business rule violation like a declined card). After exhausting all attempts, the last error should propagate to the caller.

### 2. `src/idempotency/idempotency.store.ts`
Implement the new-key execution path: a request with a previously unseen idempotency key should execute the operation, store the result, and return it. Concurrent requests arriving with the same key before the first one completes must not trigger duplicate executions — they should wait and receive the same result.

### 3. `src/saga/checkout.saga.ts`
Implement the saga executor and the checkout saga. When a step fails, previously completed steps must be compensated in reverse order. Compensation errors should be collected and logged without interrupting the remaining compensations. Intermediate results from earlier steps (reservation ID, charge ID) must be accessible to later steps and their compensations.

### 4. `src/handlers/checkout.handler.ts`
Map saga outcomes to the correct HTTP responses and ensure the correlation ID flows through every log entry.

**HTTP status mapping**:

| Scenario | Status |
|----------|--------|
| Inventory unavailable (non-retryable) | `409 Conflict` |
| Payment declined (non-retryable) | `402 Payment Required` |
| Any service retryable but exhausted | `503 Service Unavailable` + `Retry-After: 30` header |
| Success | `200 OK` |

### 5. `test/checkout.test.ts`
Implement all test cases. Run with:
```bash
pnpm test
```

## How to run

```bash
# Start the server:
pnpm dev

# Test with curl:
curl -X POST http://localhost:3006/checkout \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: test-key-001" \
  -d '{"orderId":"order_1","userId":"user_1","items":[{"productId":"p1","quantity":1,"priceUsd":29.99}]}'

# Simulate a failure by setting a failure rate via a separate endpoint (add one if you like):
# or edit the service files directly in development
```

## Acceptance criteria

- [ ] Happy path: `POST /checkout` returns `200` with `orderId`, `reservationId`, `chargeId`, `shipmentId`
- [ ] Missing `Idempotency-Key` header returns `400`
- [ ] Same `Idempotency-Key` sent twice returns the same result (saga only ran once — verify in logs)
- [ ] Payment failure after inventory reservation: logs show `releaseInventory` was called
- [ ] Shipping failure: logs show both `refundPayment` and `releaseInventory` were called
- [ ] Non-retryable errors return `409` or `402` (not `500`)
- [ ] `pnpm test` passes all tests

## Discussion questions

1. **Saga vs. 2PC**: The saga pattern guarantees eventual consistency but NOT atomicity. What's the window of inconsistency, and when is that acceptable? What would you need for stricter guarantees?

2. **Retry jitter**: Explain what a "retry storm" is and why jitter prevents it. Sketch the retry timing for 1,000 clients all hitting a failure at the same time, without jitter vs. with jitter.

3. **Idempotency at scale**: Your store is in-memory. You add a second server instance. What breaks? What's the minimum change to fix it? (Consider Redis SETNX, Postgres advisory locks, or a unique constraint.)

4. **Orchestration vs. choreography**: Your saga is an orchestrator — one central coordinator calls each service. The alternative is choreography — services emit events and react to each other. Compare the two:
   - Which is easier to debug?
   - Which scales better?
   - Which handles failure better?
   - When would you choose one over the other?

5. **Observability**: You have structured logging with correlationIds. A checkout failed in production. Walk me through exactly how you would trace the failure using only logs. What additional instrumentation (metrics, tracing) would make this faster?

6. **Compensation failures**: Your saga logs compensation errors without throwing. But what if `releaseInventory` fails permanently? The customer was charged but the inventory was never released. How would you handle this in production? (Hint: dead-letter queue, alerting, human intervention)
