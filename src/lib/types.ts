export type ProjectId = string;

export type ProjectInput = {
  name: string;
  secretKey: string;
  dashboardUrl?: string;
};

export type StripeProject = {
  id: ProjectId;
  name: string;
  secretKey: string;
  dashboardUrl: string;
  createdAt: string;
  updatedAt: string;
  isDemo?: boolean;
};

export type RevenueSnapshot = {
  currency: string;
  todayRevenue: number;
  todayRevenueContext: string;
  todayRevenueDelta?: number | null;
  mrr: number;
  mrrContext: string;
  newCustomers: number;
  newCustomersContext: string;
  failedPaymentsCount: number;
  revenueAtRisk: number;
  generatedAt: string;
};

export type FailedPayment = {
  id: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  retryAt: string | null;
  status: "retrying" | "final";
  reason: string;
  stripeUrl: string;
  reviewed: boolean;
};
