import { demoFailedPayments, demoRevenueSnapshot } from "./demo-data";
import { listCustomers, listOpenInvoices, listPaymentIntents, listSubscriptions, StripeInvoice, StripeSubscription } from "./stripe";
import { FailedPayment, RevenueSnapshot, StripeProject } from "./types";

const ACTIVE_SUBSCRIPTION_STATUSES = new Set(["active", "trialing", "past_due", "unpaid"]);

function getLocalDayBoundary(offsetInDays = 0) {
  const now = new Date();
  return Math.floor(new Date(now.getFullYear(), now.getMonth(), now.getDate() + offsetInDays).getTime() / 1000);
}

function calculateMRR(subscriptions: StripeSubscription[]) {
  return subscriptions.reduce((total, subscription) => {
    if (!ACTIVE_SUBSCRIPTION_STATUSES.has(subscription.status)) {
      return total;
    }

    const subscriptionMRR = subscription.items.data.reduce((sum, item) => {
      const recurring = item.price.recurring;
      const amount = item.price.unit_amount ?? 0;

      if (!recurring || !amount) {
        return sum;
      }

      const intervalCount = Math.max(recurring.interval_count, 1);

      switch (recurring.interval) {
        case "month":
          return sum + amount / intervalCount;
        case "year":
          return sum + amount / (12 * intervalCount);
        case "week":
          return sum + amount * (52 / 12 / intervalCount);
        case "day":
          return sum + amount * (365 / 12 / intervalCount);
        default:
          return sum;
      }
    }, 0);

    return total + subscriptionMRR;
  }, 0);
}

function sumSucceededPaymentIntents(paymentIntents: Array<{ status: string; amount: number; amount_received: number }>) {
  return paymentIntents.reduce((total, paymentIntent) => {
    if (paymentIntent.status !== "succeeded") {
      return total;
    }

    return total + (paymentIntent.amount_received || paymentIntent.amount);
  }, 0);
}

function calculatePercentDelta(currentValue: number, previousValue: number) {
  if (previousValue === 0) {
    return null;
  }

  return ((currentValue - previousValue) / previousValue) * 100;
}

function normalizeFailedInvoice(invoice: StripeInvoice, project: StripeProject): FailedPayment {
  const status = invoice.next_payment_attempt ? "retrying" : "final";

  return {
    id: invoice.id,
    customerName: invoice.customer_name || invoice.customer_email || "Unknown customer",
    customerEmail: invoice.customer_email || "No email on invoice",
    amount: invoice.amount_due,
    currency: invoice.currency || "usd",
    retryAt: invoice.next_payment_attempt ? new Date(invoice.next_payment_attempt * 1000).toISOString() : null,
    status,
    reason: invoice.payment_intent?.last_payment_error?.message || (status === "retrying" ? "Retry pending" : "Payment failed"),
    stripeUrl: invoice.hosted_invoice_url || `${project.dashboardUrl}/invoices/${invoice.id}`,
    reviewed: false,
  };
}

async function getLiveFailedPayments(project: StripeProject) {
  const invoices = await listOpenInvoices(project.secretKey);

  return invoices
    .filter((invoice) => invoice.amount_due > 0 && invoice.attempt_count > 0)
    .map((invoice) => normalizeFailedInvoice(invoice, project));
}

export async function getRevenueSnapshot(project: StripeProject): Promise<RevenueSnapshot> {
  if (project.isDemo) {
    return {
      ...demoRevenueSnapshot,
      generatedAt: new Date().toISOString(),
    };
  }

  const startOfToday = getLocalDayBoundary(0);
  const startOfTomorrow = getLocalDayBoundary(1);
  const startOfYesterday = getLocalDayBoundary(-1);

  const [subscriptions, todayPaymentIntents, yesterdayPaymentIntents, customers, failedPayments] = await Promise.all([
    listSubscriptions(project.secretKey),
    listPaymentIntents(project.secretKey, { gte: startOfToday, lt: startOfTomorrow }),
    listPaymentIntents(project.secretKey, { gte: startOfYesterday, lt: startOfToday }),
    listCustomers(project.secretKey, { gte: startOfToday, lt: startOfTomorrow }),
    getLiveFailedPayments(project),
  ]);

  const todayRevenue = sumSucceededPaymentIntents(todayPaymentIntents);
  const yesterdayRevenue = sumSucceededPaymentIntents(yesterdayPaymentIntents);
  const revenueAtRisk = failedPayments.reduce((total, payment) => total + payment.amount, 0);
  const currency =
    subscriptions[0]?.items.data[0]?.price.currency ||
    todayPaymentIntents[0]?.currency ||
    failedPayments[0]?.currency ||
    "usd";

  return {
    currency,
    todayRevenue,
    todayRevenueContext:
      todayRevenue > 0
        ? `${todayPaymentIntents.filter((paymentIntent) => paymentIntent.status === "succeeded").length} successful payments today`
        : "No successful payments yet today",
    todayRevenueDelta: calculatePercentDelta(todayRevenue, yesterdayRevenue),
    mrr: Math.round(calculateMRR(subscriptions)),
    mrrContext: `${subscriptions.filter((subscription) => ACTIVE_SUBSCRIPTION_STATUSES.has(subscription.status)).length} active subscriptions`,
    newCustomers: customers.length,
    newCustomersContext: "Today",
    failedPaymentsCount: failedPayments.length,
    revenueAtRisk,
    generatedAt: new Date().toISOString(),
  };
}

export async function getFailedPayments(project: StripeProject) {
  if (project.isDemo) {
    return demoFailedPayments.map((payment) => ({ ...payment }));
  }

  return getLiveFailedPayments(project);
}
