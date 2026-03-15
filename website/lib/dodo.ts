import DodoPayments from "dodopayments";

import type { CheckoutPlan, PaidPlan } from "./content";

function readProductId(name: string) {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

const checkoutProductIds = {
  pro_monthly:
    readProductId("DODO_PRODUCT_ID_PRO_MONTHLY") ??
    readProductId("DODO_PRODUCT_ID_PRO") ??
    "pdt_0NaX3Qbg4H3qcW40qknXx",
  pro_yearly: readProductId("DODO_PRODUCT_ID_PRO_YEARLY"),
  pro_lifetime:
    readProductId("DODO_PRODUCT_ID_PRO_LIFETIME") ??
    "pdt_0NaX3jMsqOYHw6lOgwCYz",
} satisfies Record<CheckoutPlan, string | undefined>;

const checkoutPlanToPaidPlan = {
  pro_monthly: "pro",
  pro_yearly: "pro",
  pro_lifetime: "pro",
} satisfies Record<CheckoutPlan, PaidPlan>;

const productPlanEntries: Array<[string, PaidPlan]> = Object.entries(
  checkoutProductIds,
).flatMap(([plan, productId]) =>
  productId
    ? [[productId, checkoutPlanToPaidPlan[plan as CheckoutPlan]]]
    : [],
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

export function getCheckoutProductId(plan: CheckoutPlan) {
  return checkoutProductIds[plan];
}

export function getPlanForProduct(productId: string) {
  return productPlanMap.get(productId) ?? null;
}
