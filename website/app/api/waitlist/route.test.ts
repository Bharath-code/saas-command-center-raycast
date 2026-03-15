import { describe, expect, it, vi } from "vitest";

const { databaseUrl } = vi.hoisted(() => {
  const value = `file:./.data/test-waitlist-${Date.now()}.db`;
  process.env.DATABASE_URL = value;
  process.env.DATABASE_AUTH_TOKEN = "";
  return { databaseUrl: value };
});

import { getWaitlistSignupByEmail } from "../../../lib/license-store";
import { POST } from "./route";

describe("POST /api/waitlist", () => {
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

    expect(databaseUrl).toContain("test-waitlist");
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });

    await expect(getWaitlistSignupByEmail(email)).resolves.toMatchObject({
      email,
      interest: "general",
      source: "landing_page",
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
          interest: "pro_monthly",
        }),
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Enter a valid email address.",
    });
  });

  it("normalizes email casing before storage", async () => {
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

    await expect(
      getWaitlistSignupByEmail(email.toLowerCase()),
    ).resolves.toMatchObject({
      email: email.toLowerCase(),
      interest: "pro_lifetime",
    });
  });

  it("upserts duplicate emails and updates plan interest", async () => {
    const email = `duplicate-${Date.now()}@example.com`;

    await POST(
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

    const response = await POST(
      new Request("https://revcast.example/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.toUpperCase(),
          interest: "pro_yearly",
          source: "pricing_card",
        }),
      }),
    );

    expect(response.status).toBe(200);

    await expect(getWaitlistSignupByEmail(email)).resolves.toMatchObject({
      email,
      interest: "pro_yearly",
      source: "pricing_card",
    });
  });
});
