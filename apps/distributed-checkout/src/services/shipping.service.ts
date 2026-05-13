import { ServiceError } from "../types";

export interface ShipmentResult {
  shipmentId: string;
  estimatedDelivery: string;
}

let failureRate = 0;

export function setShippingFailureRate(rate: number): void {
  failureRate = rate;
}

export async function createShipment(
  orderId: string,
  userId: string
): Promise<ShipmentResult> {
  await new Promise((r) => setTimeout(r, 120));

  if (Math.random() < failureRate) {
    throw new ServiceError(
      "Shipping service temporarily unavailable",
      "shipping",
      true // shipping failures are typically transient
    );
  }

  const deliveryDays = 3 + Math.floor(Math.random() * 5);
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);

  return {
    shipmentId: `ship_${orderId}_${userId}`,
    estimatedDelivery: deliveryDate.toISOString().split("T")[0],
  };
}

export async function cancelShipment(shipmentId: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 80));
  console.log(`[shipping] cancelled shipment: ${shipmentId}`);
}
