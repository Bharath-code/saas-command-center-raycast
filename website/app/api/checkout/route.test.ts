import { beforeEach, describe, expect, it, vi } from "vitest";

const { createCheckoutSession, getPaidProductId } = vi.hoisted(() => ({
  createCheckoutSession: vi.fn(),
  getPaidProductId: vi.fn(),
}));

vi.mock("../../../lib/content", () => ({
  siteConfig: {
    siteUrl: "https://revcast.example",
  },
}));

vi.mock("../../../lib/dodo", () => ({
  getDodoClient: () => ({
    checkoutSessions: {
      create: createCheckoutSession,
    },
  }),
  getPaidProductId,
}));

import { POST } from "./route";

describe("POST /api/checkout", () => {
  beforeEach(() => {
    createCheckoutSession.mockReset();
    getPaidProductId.mockReset();
  });

  it("rejects unknown plans", async () => {
    const response = await POST(
      new Request("https://revcast.example/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan: "team" }),
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Please choose a valid plan.",
    });
    expect(getPaidProductId).not.toHaveBeenCalled();
  });

  it("rejects unmapped paid plans", async () => {
    getPaidProductId.mockReturnValue(undefined);

    const response = await POST(
      new Request("https://revcast.example/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan: "pro" }),
      }),
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Missing Dodo product ID for the pro plan.",
    });
  });

  it("creates a Dodo checkout session for Pro", async () => {
    getPaidProductId.mockReturnValue("prod_pro_123");
    createCheckoutSession.mockResolvedValue({
      checkout_url: "https://checkout.dodopayments.com/session/test",
    });

    const response = await POST(
      new Request("https://revcast.example/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan: "pro" }),
      }),
    );

    expect(createCheckoutSession).toHaveBeenCalledWith({
      product_cart: [{ product_id: "prod_pro_123", quantity: 1 }],
      return_url: "https://revcast.example/checkout/success?plan=pro",
    });
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      checkoutUrl: "https://checkout.dodopayments.com/session/test",
    });
  });
});
