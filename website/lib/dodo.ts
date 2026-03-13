import DodoPayments from "dodopayments";

import type { PaidPlan } from "./content";

const paidProductIds = {
  pro: process.env.DODO_PRODUCT_ID_PRO,
} satisfies Record<PaidPlan, string | undefined>;

const productPlanEntries: Array<[string, PaidPlan]> = Object.entries(
  paidProductIds,
).flatMap(([plan, productId]) =>
  productId ? [[productId, plan as PaidPlan]] : [],
);

const productPlanMap = new Map<string, PaidPlan>(productPlanEntries);

export function getDodoClient() {
  const apiKey = process.env.DODO_PAYMENTS_API_KEY;

  if (!apiKey) {
    throw new Error("Missing DODO_PAYMENTS_API_KEY.");
  }

  return new DodoPayments({
    bearerToken: apiKey,
    webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_KEY ?? null,
    environment:
      process.env.DODO_PAYMENTS_ENVIRONMENT === "live_mode"
        ? "live_mode"
        : "test_mode",
  });
}

export function getPaidProductId(plan: PaidPlan) {
  return paidProductIds[plan];
}

export function getPlanForProduct(productId: string) {
  return productPlanMap.get(productId) ?? null;
}
