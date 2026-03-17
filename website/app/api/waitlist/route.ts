import { NextResponse } from "next/server";

import type { WaitlistInterest } from "../../../lib/content";
import { upsertWaitlistSignup } from "../../../lib/waitlist-store";

export const runtime = "nodejs";

function isWaitlistInterest(value: unknown): value is WaitlistInterest {
  return (
    value === "general" ||
    value === "free" ||
    value === "pro_monthly" ||
    value === "pro_yearly" ||
    value === "pro_lifetime"
  );
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as
      | {
          email?: unknown;
          interest?: unknown;
          source?: unknown;
        }
      | null;

    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const interest = body?.interest;
    const source =
      typeof body?.source === "string" && body.source.trim()
        ? body.source.trim()
        : "landing_page";

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 },
      );
    }

    if (typeof interest !== "undefined" && !isWaitlistInterest(interest)) {
      return NextResponse.json(
        { error: "Choose a valid plan interest." },
        { status: 400 },
      );
    }

    await upsertWaitlistSignup({
      email,
      interest: isWaitlistInterest(interest) ? interest : "general",
      source,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to join waitlist", error);

    return NextResponse.json(
      { error: "Unable to join the waitlist right now. Please try again." },
      { status: 500 },
    );
  }
}
