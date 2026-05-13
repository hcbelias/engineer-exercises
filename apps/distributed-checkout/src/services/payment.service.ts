import { ServiceError } from "../types";

export interface ChargeResult {
  chargeId: string;
  amountUsd: number;
}

let failureRate = 0;

export function setPaymentFailureRate(rate: number): void {
  failureRate = rate;
}

export async function chargePayment(
  orderId: string,
  userId: string,
  amountUsd: number
): Promise<ChargeResult> {
  await new Promise((r) => setTimeout(r, 150)); // payments are slower

  if (Math.random() < failureRate) {
    const isTransient = Math.random() < 0.3; // payment failures are mostly non-retryable
    throw new ServiceError(
      isTransient
        ? "Payment gateway timeout"
        : `Payment declined for user ${userId}`,
      "payment",
      isTransient
    );
  }

  return {
    chargeId: `charge_${orderId}_${amountUsd}usd`,
    amountUsd,
  };
}

export async function refundPayment(chargeId: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 120));
  console.log(`[payment] refunded charge: ${chargeId}`);
}
