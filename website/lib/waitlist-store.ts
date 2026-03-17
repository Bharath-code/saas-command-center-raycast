import { neon } from "@neondatabase/serverless";

import type { WaitlistInterest } from "./content";

export type StoredWaitlistSignup = {
  createdAt: string;
  email: string;
  id: string;
  interest: WaitlistInterest;
  source: string;
  updatedAt: string;
};

type WaitlistRow = {
  created_at: string;
  email: string;
  id: string;
  interest: WaitlistInterest;
  source: string;
  updated_at: string;
};

let waitlistSql:
  | ReturnType<typeof neon>
  | null = null;
let initializedPromise: Promise<void> | null = null;

function getWaitlistConnectionString() {
  const connectionString =
    process.env.NEON_DATABASE_URL?.trim() || process.env.POSTGRES_URL?.trim();

  if (!connectionString) {
    throw new Error("Missing NEON_DATABASE_URL for waitlist storage.");
  }

  return connectionString;
}

function getWaitlistSql() {
  if (!waitlistSql) {
    waitlistSql = neon(getWaitlistConnectionString());
  }

  return waitlistSql;
}

export async function ensureWaitlistStore() {
  if (!initializedPromise) {
    const sql = getWaitlistSql();

    initializedPromise = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS waitlist_signups (
          id TEXT PRIMARY KEY,
          email TEXT NOT NULL UNIQUE,
          interest TEXT NOT NULL,
          source TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL
        )
      `;

      await sql`
        CREATE INDEX IF NOT EXISTS waitlist_signups_interest_idx
        ON waitlist_signups(interest)
      `;
    })();
  }

  await initializedPromise;
}

export async function upsertWaitlistSignup(input: {
  email: string;
  interest: WaitlistInterest;
  source: string;
}) {
  await ensureWaitlistStore();

  const sql = getWaitlistSql();
  const now = new Date().toISOString();
  const normalizedEmail = input.email.toLowerCase();
  const id = `wait_${normalizedEmail}`;

  await sql`
    INSERT INTO waitlist_signups (
      id,
      email,
      interest,
      source,
      created_at,
      updated_at
    ) VALUES (
      ${id},
      ${normalizedEmail},
      ${input.interest},
      ${input.source},
      ${now},
      ${now}
    )
    ON CONFLICT (email) DO UPDATE SET
      interest = EXCLUDED.interest,
      source = EXCLUDED.source,
      updated_at = EXCLUDED.updated_at
  `;
}

export async function getWaitlistSignupByEmail(email: string) {
  await ensureWaitlistStore();

  const sql = getWaitlistSql();
  const rows = (await sql`
    SELECT
      created_at,
      email,
      id,
      interest,
      source,
      updated_at
    FROM waitlist_signups
    WHERE email = ${email.toLowerCase()}
    LIMIT 1
  `) as WaitlistRow[];

  const row = rows[0];

  if (!row) {
    return null;
  }

  return {
    createdAt: row.created_at,
    email: row.email,
    id: row.id,
    interest: row.interest,
    source: row.source,
    updatedAt: row.updated_at,
  } satisfies StoredWaitlistSignup;
}

export async function listWaitlistSignups() {
  await ensureWaitlistStore();

  const sql = getWaitlistSql();
  const rows = (await sql`
    SELECT
      created_at,
      email,
      id,
      interest,
      source,
      updated_at
    FROM waitlist_signups
    ORDER BY updated_at DESC, created_at DESC
  `) as WaitlistRow[];

  return rows.map((row) => ({
    createdAt: row.created_at,
    email: row.email,
    id: row.id,
    interest: row.interest,
    source: row.source,
    updatedAt: row.updated_at,
  })) satisfies StoredWaitlistSignup[];
}
