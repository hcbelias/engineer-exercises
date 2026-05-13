// Typed primitives for the saga orchestrator pattern.
//
// A saga is a sequence of steps where each step has a corresponding
// compensation (undo) action. If any step fails after earlier steps
// have succeeded, the compensation actions run in REVERSE order to
// restore consistency.
//
// This is a common pattern for distributed transactions where a single
// atomic database transaction isn't available.

export interface SagaStep<T = unknown> {
  name: string;
  execute: () => Promise<T>;
  compensate: () => Promise<void>;
}

export type SagaResult<T> =
  | { success: true; data: T }
  | { success: false; failedStep: string; error: Error; compensationErrors: Error[] };
