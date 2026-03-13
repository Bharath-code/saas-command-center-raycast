import { NextResponse } from "next/server";
import DodoPayments from "dodopayments";

import type { PaidPlan } from "../../../lib/content";
import { siteConfig } from "../../../lib/content";

export const runtime = "nodejs";

const productIds: Record<PaidPlan, string | undefined> = {
  pro: process.env.DODO_PRODUCT_ID_PRO,
  team: process.env.DODO_PRODUCT_ID_TEAM,
};

function isPaidPlan(value: unknown): value is PaidPlan {
  return value === "pro" || value === "team";
}

function getDodoClient() {
  const apiKey = process.env.DODO_PAYMENTS_API_KEY;

  if (!apiKey) {
    throw new Error("Missing DODO_PAYMENTS_API_KEY.");
  }

  return new DodoPayments({
    bearerToken: apiKey,
    environment: process.env.DODO_PAYMENTS_ENVIRONMENT === "live_mode" ? "live_mode" : "test_mode",
  });
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json().catch(() => null)) as { plan?: unknown } | null;
    const plan = payload?.plan;

    if (!isPaidPlan(plan)) {
      return NextResponse.json({ error: "Please choose a valid plan." }, { status: 400 });
    }

    const productId = productIds[plan];

    if (!productId) {
      return NextResponse.json(
        { error: `Missing Dodo product ID for the ${plan} plan.` },
        { status: 500 },
      );
    }

    const session = await getDodoClient().checkoutSessions.create({
      product_cart: [{ product_id: productId, quantity: 1 }],
      return_url: `${siteConfig.siteUrl}/checkout/success?plan=${plan}`,
    });

    if (!session.checkout_url) {
      return NextResponse.json(
        { error: "Dodo did not return a checkout URL for this session." },
        { status: 502 },
      );
    }

    return NextResponse.json({ checkoutUrl: session.checkout_url });
  } catch (error) {
    console.error("Failed to create Dodo checkout session", error);

    return NextResponse.json(
      { error: "Unable to start checkout right now. Please try again in a moment." },
      { status: 500 },
    );
  }
}
