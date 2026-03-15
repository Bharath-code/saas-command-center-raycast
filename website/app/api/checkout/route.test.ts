import { beforeEach, describe, expect, it, vi } from "vitest";

const { createCheckoutSession, getCheckoutProductId } = vi.hoisted(() => ({
  createCheckoutSession: vi.fn(),
  getCheckoutProductId: vi.fn(),
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
  getCheckoutProductId,
}));

import { POST } from "./route";

describe("POST /api/checkout", () => {
  beforeEach(() => {
    createCheckoutSession.mockReset();
    getCheckoutProductId.mockReset();
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
    expect(getCheckoutProductId).not.toHaveBeenCalled();
  });

  it("rejects unmapped paid plans", async () => {
    getCheckoutProductId.mockReturnValue(undefined);

    const response = await POST(
      new Request("https://revcast.example/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan: "pro_yearly" }),
      }),
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Missing Dodo product ID for the pro_yearly plan.",
    });
  });

  it("creates a Dodo checkout session for Pro Monthly", async () => {
    getCheckoutProductId.mockReturnValue("prod_pro_monthly_123");
    createCheckoutSession.mockResolvedValue({
      checkout_url: "https://checkout.dodopayments.com/session/test",
    });

    const response = await POST(
      new Request("https://revcast.example/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan: "pro_monthly" }),
      }),
    );

    expect(createCheckoutSession).toHaveBeenCalledWith({
      product_cart: [{ product_id: "prod_pro_monthly_123", quantity: 1 }],
      return_url: "https://revcast.example/checkout/success?plan=pro_monthly",
    });
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      checkoutUrl: "https://checkout.dodopayments.com/session/test",
    });
  });

  it("creates a Dodo checkout session for Lifetime", async () => {
    getCheckoutProductId.mockReturnValue("prod_pro_lifetime_123");
    createCheckoutSession.mockResolvedValue({
      checkout_url: "https://checkout.dodopayments.com/session/lifetime",
    });

    const response = await POST(
      new Request("https://revcast.example/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan: "pro_lifetime" }),
      }),
    );

    expect(createCheckoutSession).toHaveBeenCalledWith({
      product_cart: [{ product_id: "prod_pro_lifetime_123", quantity: 1 }],
      return_url:
        "https://revcast.example/checkout/success?plan=pro_lifetime",
    });
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      checkoutUrl: "https://checkout.dodopayments.com/session/lifetime",
    });
  });
});
