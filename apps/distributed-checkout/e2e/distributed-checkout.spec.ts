import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3006";

const SAMPLE_BODY = {
  orderId: "order_e2e_001",
  userId: "user_e2e_1",
  items: [{ productId: "prod_a", quantity: 1, priceUsd: 29.99 }],
};

async function checkout(
  request: typeof import("@playwright/test").request,
  body: object,
  idempotencyKey: string,
) {
  return request.post(`${BASE}/checkout`, {
    data: body,
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
  });
}

test.describe("POST /checkout — happy path", () => {
  test("returns 200 with all IDs on success", async ({ request }) => {
    const key = `e2e-happy-${Date.now()}`;
    const res = await checkout(request, SAMPLE_BODY, key);

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({
      orderId: SAMPLE_BODY.orderId,
      reservationId: expect.any(String),
      chargeId: expect.any(String),
      shipmentId: expect.any(String),
      status: "completed",
    });
  });
});

test.describe("POST /checkout — validation", () => {
  test("returns 400 when Idempotency-Key header is missing", async ({ request }) => {
    const res = await request.post(`${BASE}/checkout`, {
      data: SAMPLE_BODY,
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/idempotency/i);
  });

  test("returns 400 when required fields are missing", async ({ request }) => {
    const res = await checkout(request, { userId: "u1" }, `e2e-validation-${Date.now()}`);
    expect(res.status()).toBe(400);
  });

  test("returns 400 when items is an empty array", async ({ request }) => {
    const res = await checkout(
      request,
      { ...SAMPLE_BODY, items: [] },
      `e2e-empty-items-${Date.now()}`,
    );
    expect(res.status()).toBe(400);
  });
});

test.describe("POST /checkout — idempotency", () => {
  test("same Idempotency-Key returns the same result on repeat calls", async ({ request }) => {
    const key = `e2e-idem-${Date.now()}`;

    const res1 = await checkout(request, SAMPLE_BODY, key);
    const res2 = await checkout(request, SAMPLE_BODY, key);

    expect(res1.status()).toBe(200);
    expect(res2.status()).toBe(200);

    const body1 = await res1.json();
    const body2 = await res2.json();

    // Both responses must be identical — saga only ran once
    expect(body1.reservationId).toBe(body2.reservationId);
    expect(body1.chargeId).toBe(body2.chargeId);
    expect(body1.shipmentId).toBe(body2.shipmentId);
  });
});

test.describe("GET /health", () => {
  test("server is reachable and healthy", async ({ request }) => {
    const res = await request.get(`${BASE}/health`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("ok");
  });
});
