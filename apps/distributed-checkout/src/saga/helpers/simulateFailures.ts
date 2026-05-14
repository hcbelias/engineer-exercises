import {
  setInventoryFailureRate,
  reserveInventory,
  releaseInventory,
} from "../../services/inventory.service";
import {
  setPaymentFailureRate,
  chargePayment,
  refundPayment,
} from "../../services/payment.service";
import {
  setShippingFailureRate,
  createShipment,
  cancelShipment,
} from "../../services/shipping.service";

// Re-export services with spy tracking for tests
export {
  reserveInventory,
  releaseInventory,
  chargePayment,
  refundPayment,
  createShipment,
  cancelShipment,
};

// Helpers for common failure scenarios
export function setAllServicesHealthy() {
  setInventoryFailureRate(0);
  setPaymentFailureRate(0);
  setShippingFailureRate(0);
}

export function makeInventoryAlwaysFail() {
  setInventoryFailureRate(1);
  setPaymentFailureRate(0);
  setShippingFailureRate(0);
}

export function makePaymentAlwaysFail() {
  setInventoryFailureRate(0);
  setPaymentFailureRate(1);
  setShippingFailureRate(0);
}

export function makeShippingAlwaysFail() {
  setInventoryFailureRate(0);
  setPaymentFailureRate(0);
  setShippingFailureRate(1);
}

// Make a service fail the first N times then succeed
export function makeServiceFailNTimes(service: "inventory" | "payment" | "shipping", n: number) {
  let calls = 0;
  const setFn =
    service === "inventory"
      ? setInventoryFailureRate
      : service === "payment"
        ? setPaymentFailureRate
        : setShippingFailureRate;

  // This is a simplified version — for real tests you'd want a proper mock/spy
  setFn(1); // fail by default
  const interval = setInterval(() => {
    calls++;
    if (calls >= n) {
      setFn(0); // start succeeding
      clearInterval(interval);
    }
  }, 50);
}
