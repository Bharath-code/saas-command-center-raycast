import { beforeEach, describe, expect, it, vi } from "vitest";

import type { WaitlistInterest } from "./content";

type WaitlistRecord = {
  created_at: string;
  email: string;
  id: string;
  interest: WaitlistInterest;
  source: string;
  updated_at: string;
};

const { neonMock, records, sqlMock } = vi.hoisted(() => {
  const rows = new Map<string, WaitlistRecord>();

  const mock = vi.fn(async (strings: TemplateStringsArray, ...values: unknown[]) => {
    const statement = strings.join(" ").replace(/\s+/g, " ").trim().toLowerCase();

    if (statement.startsWith("create table if not exists waitlist_signups")) {
      return [];
    }

    if (statement.startsWith("create index if not exists waitlist_signups_interest_idx")) {
      return [];
    }

    if (statement.startsWith("insert into waitlist_signups")) {
      const [id, email, interest, source, createdAt, updatedAt] = values as [
        string,
        string,
        WaitlistInterest,
        string,
        string,
        string,
      ];
      const existing = rows.get(email);

      rows.set(email, {
        created_at: existing?.created_at ?? createdAt,
        email,
        id: existing?.id ?? id,
        interest,
        source,
        updated_at: updatedAt,
      });

      return [];
    }

    if (statement.includes("from waitlist_signups where email =")) {
      const [email] = values as [string];
      const row = rows.get(email);
      return row ? [{ ...row }] : [];
    }

    if (statement.includes("from waitlist_signups order by updated_at desc")) {
      return [...rows.values()]
        .sort((left, right) => right.updated_at.localeCompare(left.updated_at))
        .map((row) => ({ ...row }));
    }

    throw new Error(`Unhandled SQL in test: ${statement}`);
  });

  return {
    neonMock: vi.fn(() => mock),
    records: rows,
    sqlMock: mock,
  };
});

vi.mock("@neondatabase/serverless", () => ({
  neon: neonMock,
}));

import {
  getWaitlistSignupByEmail,
  listWaitlistSignups,
  upsertWaitlistSignup,
} from "./waitlist-store";

describe("waitlist-store", () => {
  beforeEach(() => {
    records.clear();
    sqlMock.mockClear();
    process.env.NEON_DATABASE_URL = "postgres://revcast:test@example.neon.tech/revcast";
    delete process.env.POSTGRES_URL;
  });

  it("stores and reads a waitlist signup", async () => {
    await upsertWaitlistSignup({
      email: "Founder@Example.com",
      interest: "general",
      source: "landing_page",
    });

    await expect(
      getWaitlistSignupByEmail("founder@example.com"),
    ).resolves.toMatchObject({
      email: "founder@example.com",
      interest: "general",
      source: "landing_page",
    });
  });

  it("upserts duplicate emails and keeps one record", async () => {
    const email = "repeat@example.com";

    await upsertWaitlistSignup({
      email,
      interest: "general",
      source: "landing_page",
    });

    await upsertWaitlistSignup({
      email: email.toUpperCase(),
      interest: "pro_yearly",
      source: "pricing_card",
    });

    await expect(getWaitlistSignupByEmail(email)).resolves.toMatchObject({
      email,
      interest: "pro_yearly",
      source: "pricing_card",
    });

    await expect(listWaitlistSignups()).resolves.toHaveLength(1);
  });

  it("lists signups in newest-first order", async () => {
    await upsertWaitlistSignup({
      email: "first@example.com",
      interest: "free",
      source: "landing_page",
    });

    await new Promise((resolve) => setTimeout(resolve, 5));

    await upsertWaitlistSignup({
      email: "second@example.com",
      interest: "pro_monthly",
      source: "pricing_card",
    });

    await expect(listWaitlistSignups()).resolves.toMatchObject([
      { email: "second@example.com" },
      { email: "first@example.com" },
    ]);
  });
});
