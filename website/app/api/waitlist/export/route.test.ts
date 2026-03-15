import { describe, expect, it } from "vitest";

process.env.WAITLIST_ADMIN_TOKEN = "revcast-admin-token";

import { upsertWaitlistSignup } from "../../../../lib/license-store";
import { GET } from "./route";

describe("GET /api/waitlist/export", () => {
  it("rejects unauthorized export access", async () => {
    const response = await GET(
      new Request("https://revcast.example/api/waitlist/export"),
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Unauthorized." });
  });

  it("returns a csv export for authorized requests", async () => {
    const email = `export-${Date.now()}@example.com`;

    await upsertWaitlistSignup({
      email,
      interest: "pro_monthly",
      source: "landing_page",
    });

    const response = await GET(
      new Request(
        "https://revcast.example/api/waitlist/export?token=revcast-admin-token",
      ),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain("text/csv");

    const csv = await response.text();
    expect(csv).toContain("email,interest,source,created_at,updated_at");
    expect(csv).toContain(email);
    expect(csv).toContain("pro_monthly");
  });
});
