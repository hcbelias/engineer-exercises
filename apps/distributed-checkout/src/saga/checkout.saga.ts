import type { CheckoutRequest, CheckoutResult } from "../types";
import type { SagaStep, SagaResult } from "./saga.types";
import { logger } from "../observability/logger";

// TODO: Implement the checkout saga orchestrator.
//
// A saga runs steps in sequence. If a step fails, it runs the compensation
// actions for all PREVIOUSLY SUCCEEDED steps in reverse order.
//
// Example:
//   Steps: [reserveInventory, chargePayment, createShipment]
//   If chargePayment fails:
//     - createShipment has NOT run, so no compensation needed for it
//     - reserveInventory succeeded, so releaseInventory MUST run
//   If createShipment fails:
//     - refundPayment MUST run
//     - releaseInventory MUST run (in that order — reverse of execution)
//
// Requirements:
// 1. Accept a typed array of SagaStep[]
// 2. Execute each step in order, collecting results
// 3. On failure: run compensations in reverse for all succeeded steps
//    - Collect compensation errors separately — don't let them throw
//      (a compensation failing means you have a bigger problem; log it)
// 4. Log each step start/success/failure with the correlationId
// 5. Return SagaResult<T>

export async function runSaga<T>(
  steps: SagaStep[],
  correlationId: string
): Promise<SagaResult<T>> {
  const log = logger.child({ correlationId });
  const succeeded: SagaStep[] = [];
  let lastResult: unknown;

  for (const step of steps) {
    log.info(`[saga] starting step: ${step.name}`);
    try {
      lastResult = await step.execute();
      succeeded.push(step);
      log.info(`[saga] step succeeded: ${step.name}`);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      log.error(`[saga] step failed: ${step.name} — ${error.message}`);

      // TODO: run compensations for all succeeded steps in reverse order
      const compensationErrors: Error[] = [];

      return {
        success: false,
        failedStep: step.name,
        error,
        compensationErrors,
      };
    }
  }

  return { success: true, data: lastResult as T };
}

// The specific checkout saga — wires up the three service calls.
//
// TODO: Implement executeCheckout
// It must run three steps in order:
//   1. reserveInventory — compensate with releaseInventory
//   2. chargePayment    — compensate with refundPayment
//   3. createShipment   — compensate with cancelShipment
//
// Steps must share intermediate results (e.g. reservationId, chargeId)
// so that later steps and compensations can reference them.

export async function executeCheckout(
  request: CheckoutRequest,
  correlationId: string
): Promise<SagaResult<CheckoutResult>> {
  // TODO: build and execute the saga steps
  throw new Error("TODO: implement executeCheckout");
}
