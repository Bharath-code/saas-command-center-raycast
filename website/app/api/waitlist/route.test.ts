import { beforeEach, describe, expect, it, vi } from "vitest";

const { upsertWaitlistSignupMock } = vi.hoisted(() => ({
  upsertWaitlistSignupMock: vi.fn(),
}));

vi.mock("../../../lib/waitlist-store", () => ({
  upsertWaitlistSignup: upsertWaitlistSignupMock,
}));

import { POST } from "./route";

describe("POST /api/waitlist", () => {
  beforeEach(() => {
    upsertWaitlistSignupMock.mockReset();
  });

  it("accepts a valid email without a visible plan selection", async () => {
    const email = `founder-${Date.now()}@example.com`;

    const response = await POST(
      new Request("https://revcast.example/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });
    expect(upsertWaitlistSignupMock).toHaveBeenCalledWith({
      email,
      interest: "general",
      source: "landing_page",
    });
  });

  it("accepts hidden pricing interest from the page", async () => {
    const response = await POST(
      new Request("https://revcast.example/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "paid@example.com",
          interest: "pro_yearly",
          source: "pricing_card",
        }),
      }),
    );

    expect(response.status).toBe(200);
    expect(upsertWaitlistSignupMock).toHaveBeenCalledWith({
      email: "paid@example.com",
      interest: "pro_yearly",
      source: "pricing_card",
    });
  });

  it("rejects invalid emails", async () => {
    const response = await POST(
      new Request("https://revcast.example/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "not-an-email",
        }),
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Enter a valid email address.",
    });
    expect(upsertWaitlistSignupMock).not.toHaveBeenCalled();
  });

  it("normalizes email casing before persistence", async () => {
    const email = `Founder-${Date.now()}@Example.com`;

    const response = await POST(
      new Request("https://revcast.example/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          interest: "pro_lifetime",
        }),
      }),
    );

    expect(response.status).toBe(200);
    expect(upsertWaitlistSignupMock).toHaveBeenCalledWith({
      email: email.toLowerCase(),
      interest: "pro_lifetime",
      source: "landing_page",
    });
  });
});
