import { NextResponse } from "next/server";

import { getDodoClient } from "../../../../lib/dodo";
import {
  markWebhookProcessed,
  syncLicenseKeyData,
  updateCustomerFromPayment,
  updateCustomerFromSubscription,
  updateLicenseSubscriptionStatus,
} from "../../../../lib/license-store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const webhookId = request.headers.get("webhook-id");
  const webhookSignature = request.headers.get("webhook-signature");
  const webhookTimestamp = request.headers.get("webhook-timestamp");

  if (!webhookId || !webhookSignature || !webhookTimestamp) {
    return NextResponse.json(
      { error: "Missing Dodo webhook headers." },
      { status: 400 },
    );
  }

  try {
    const dodo = getDodoClient();
    const event = dodo.webhooks.unwrap(rawBody, {
      headers: {
        "webhook-id": webhookId,
        "webhook-signature": webhookSignature,
        "webhook-timestamp": webhookTimestamp,
      },
    });

    const shouldProcess = await markWebhookProcessed(webhookId, event.type);

    if (!shouldProcess) {
      return NextResponse.json({ ok: true, deduplicated: true });
    }

    switch (event.type) {
      case "license_key.created":
        await syncLicenseKeyData(dodo, event.data);
        break;

      case "payment.succeeded":
      case "payment.failed":
      case "payment.processing":
      case "payment.cancelled":
        await updateCustomerFromPayment(event.data);
        break;

      case "subscription.active":
      case "subscription.renewed":
      case "subscription.updated":
      case "subscription.plan_changed":
      case "subscription.on_hold":
      case "subscription.failed":
      case "subscription.cancelled":
      case "subscription.expired":
        await updateCustomerFromSubscription(event.data);
        await updateLicenseSubscriptionStatus(event.data);
        break;

      default:
        break;
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to process Dodo webhook", error);

    return NextResponse.json(
      { error: "Webhook verification failed." },
      { status: 400 },
    );
  }
}
