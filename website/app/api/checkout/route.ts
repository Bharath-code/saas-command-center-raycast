import { NextResponse } from "next/server";

import type { CheckoutPlan } from "../../../lib/content";
import { siteConfig } from "../../../lib/content";
import { getCheckoutProductId, getDodoClient } from "../../../lib/dodo";

export const runtime = "nodejs";

function isCheckoutPlan(value: unknown): value is CheckoutPlan {
  return (
    value === "pro_monthly" ||
    value === "pro_yearly" ||
    value === "pro_lifetime"
  );
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json().catch(() => null)) as {
      plan?: unknown;
    } | null;
    const plan = payload?.plan;

    if (!isCheckoutPlan(plan)) {
      return NextResponse.json(
        { error: "Please choose a valid plan." },
        { status: 400 },
      );
    }

    const productId = getCheckoutProductId(plan);

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
      {
        error:
          "Unable to start checkout right now. Please try again in a moment.",
      },
      { status: 500 },
    );
  }
}
