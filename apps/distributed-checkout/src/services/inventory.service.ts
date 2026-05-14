import { ServiceError } from "../types";
import type { Item } from "../types";

export interface ReservationResult {
  reservationId: string;
}

let failureRate = 0;

// Configure how often this service fails (0.0 = never, 1.0 = always).
// Used by tests to simulate failure scenarios.
export function setInventoryFailureRate(rate: number): void {
  failureRate = rate;
}

export async function reserveInventory(orderId: string, items: Item[]): Promise<ReservationResult> {
  await new Promise((r) => setTimeout(r, 100)); // simulate network

  if (Math.random() < failureRate) {
    // Randomly pick retryable vs non-retryable to simulate both cases
    const isTransient = Math.random() < 0.5;
    throw new ServiceError(
      isTransient
        ? "Inventory service temporarily unavailable"
        : `Insufficient stock for order ${orderId}`,
      "inventory",
      isTransient,
    );
  }

  return {
    reservationId: `res_${orderId}_${items.length}items`,
  };
}

export async function releaseInventory(reservationId: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 80)); // simulate network
  // Compensation operations should not fail in a well-designed system,
  // but they can — your saga should handle this case.
  console.log(`[inventory] released reservation: ${reservationId}`);
}
