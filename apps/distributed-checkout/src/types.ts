export interface Item {
  productId: string;
  quantity: number;
  priceUsd: number;
}

export interface CheckoutRequest {
  orderId: string;
  userId: string;
  items: Item[];
}

export interface CheckoutResult {
  orderId: string;
  reservationId: string;
  chargeId: string;
  shipmentId: string;
  totalUsd: number;
  status: "completed";
}

// A typed error that downstream services throw.
// retryable: true means the caller SHOULD retry (transient failure — network blip, rate limit).
// retryable: false means the caller SHOULD NOT retry (business rule — insufficient stock, bad card).
export class ServiceError extends Error {
  readonly retryable: boolean;
  readonly service: string;

  constructor(message: string, service: string, retryable: boolean) {
    super(message);
    this.name = "ServiceError";
    this.service = service;
    this.retryable = retryable;
  }
}
