import fs from "node:fs";
import path from "node:path";

import { createClient, type Client } from "@libsql/client";
import type DodoPayments from "dodopayments";
import type { Customer } from "dodopayments/resources/customers/customers";
import type { LicenseKey } from "dodopayments/resources/license-keys";
import type { Payment } from "dodopayments/resources/payments";
import type { Subscription } from "dodopayments/resources/subscriptions";

import type { PaidPlan } from "./content";
import { getPlanForProduct } from "./dodo";

export type StoredLicense = {
  activationsLimit: number | null;
  createdAt: string;
  customerEmail: string;
  customerId: string;
  customerName: string;
  dodoLicenseKeyId: string;
  dodoPaymentId: string | null;
  dodoProductId: string;
  dodoSubscriptionId: string | null;
  expiresAt: string | null;
  instancesCount: number;
  licenseStatus: string;
  plan: PaidPlan;
  subscriptionStatus: string | null;
  updatedAt: string;
};

let client: Client | null = null;
let initialized = false;

function getDefaultDatabaseUrl() {
  const dataDirectory = path.join(process.cwd(), ".data");
  fs.mkdirSync(dataDirectory, { recursive: true });
  return `file:${path.join(dataDirectory, "revcast.db")}`;
}

function ensureDatabaseDirectory(databaseUrl: string) {
  if (!databaseUrl.startsWith("file:")) {
    return;
  }

  const filePath = databaseUrl.slice("file:".length);
  const absolutePath = path.isAbsolute(filePath)
    ? filePath
    : path.join(process.cwd(), filePath);

  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
}

function getDatabaseClient() {
  if (!client) {
    const databaseUrl =
      process.env.LIBSQL_DATABASE_URL || process.env.DATABASE_URL || getDefaultDatabaseUrl();
    ensureDatabaseDirectory(databaseUrl);

    client = createClient({
      url: databaseUrl,
      authToken: process.env.DATABASE_AUTH_TOKEN,
    });
  }

  return client;
}

export async function ensureLicenseStore() {
  if (initialized) {
    return;
  }

  const db = getDatabaseClient();

  await db.batch(
    [
      `CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        dodo_customer_id TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        full_name TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS licenses (
        id TEXT PRIMARY KEY,
        dodo_license_key_id TEXT NOT NULL UNIQUE,
        customer_id TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        customer_name TEXT NOT NULL,
        dodo_product_id TEXT NOT NULL,
        dodo_payment_id TEXT,
        dodo_subscription_id TEXT,
        plan TEXT NOT NULL,
        license_status TEXT NOT NULL,
        subscription_status TEXT,
        activations_limit INTEGER,
        instances_count INTEGER NOT NULL DEFAULT 0,
        expires_at TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (customer_id) REFERENCES customers(id)
      )`,
      `CREATE TABLE IF NOT EXISTS webhook_events (
        id TEXT PRIMARY KEY,
        event_type TEXT NOT NULL,
        processed_at TEXT NOT NULL
      )`,
      `CREATE INDEX IF NOT EXISTS licenses_customer_email_idx ON licenses(customer_email)`,
      `CREATE INDEX IF NOT EXISTS licenses_customer_id_idx ON licenses(customer_id)`,
      `CREATE INDEX IF NOT EXISTS licenses_subscription_id_idx ON licenses(dodo_subscription_id)`,
    ].map((statement) => ({ sql: statement })),
    "write",
  );

  initialized = true;
}

export async function markWebhookProcessed(webhookId: string, eventType: string) {
  await ensureLicenseStore();

  const db = getDatabaseClient();
  const existing = await db.execute({
    sql: "SELECT id FROM webhook_events WHERE id = ? LIMIT 1",
    args: [webhookId],
  });

  if (existing.rows.length > 0) {
    return false;
  }

  await db.execute({
    sql: "INSERT INTO webhook_events (id, event_type, processed_at) VALUES (?, ?, ?)",
    args: [webhookId, eventType, new Date().toISOString()],
  });

  return true;
}

export async function upsertCustomer(input: {
  dodoCustomerId: string;
  email: string;
  fullName: string;
}) {
  await ensureLicenseStore();

  const now = new Date().toISOString();
  const id = `cust_${input.dodoCustomerId}`;

  await getDatabaseClient().execute({
    sql: `INSERT INTO customers (id, dodo_customer_id, email, full_name, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(dodo_customer_id) DO UPDATE SET
        email = excluded.email,
        full_name = excluded.full_name,
        updated_at = excluded.updated_at`,
    args: [id, input.dodoCustomerId, input.email.toLowerCase(), input.fullName, now, now],
  });

  return id;
}

export async function upsertLicense(input: {
  activationsLimit: number | null;
  customerEmail: string;
  customerId: string;
  customerName: string;
  dodoLicenseKeyId: string;
  dodoPaymentId: string | null;
  dodoProductId: string;
  dodoSubscriptionId: string | null;
  expiresAt: string | null;
  instancesCount: number;
  licenseStatus: string;
  plan: PaidPlan;
  subscriptionStatus: string | null;
}) {
  await ensureLicenseStore();

  const now = new Date().toISOString();
  const id = `lic_${input.dodoLicenseKeyId}`;

  await getDatabaseClient().execute({
    sql: `INSERT INTO licenses (
      id,
      dodo_license_key_id,
      customer_id,
      customer_email,
      customer_name,
      dodo_product_id,
      dodo_payment_id,
      dodo_subscription_id,
      plan,
      license_status,
      subscription_status,
      activations_limit,
      instances_count,
      expires_at,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(dodo_license_key_id) DO UPDATE SET
      customer_id = excluded.customer_id,
      customer_email = excluded.customer_email,
      customer_name = excluded.customer_name,
      dodo_product_id = excluded.dodo_product_id,
      dodo_payment_id = excluded.dodo_payment_id,
      dodo_subscription_id = excluded.dodo_subscription_id,
      plan = excluded.plan,
      license_status = excluded.license_status,
      subscription_status = excluded.subscription_status,
      activations_limit = excluded.activations_limit,
      instances_count = excluded.instances_count,
      expires_at = excluded.expires_at,
      updated_at = excluded.updated_at`,
    args: [
      id,
      input.dodoLicenseKeyId,
      input.customerId,
      input.customerEmail.toLowerCase(),
      input.customerName,
      input.dodoProductId,
      input.dodoPaymentId,
      input.dodoSubscriptionId,
      input.plan,
      input.licenseStatus,
      input.subscriptionStatus,
      input.activationsLimit,
      input.instancesCount,
      input.expiresAt,
      now,
      now,
    ],
  });
}

export async function updateCustomerFromPayment(payment: Payment) {
  await upsertCustomer({
    dodoCustomerId: payment.customer.customer_id,
    email: payment.customer.email,
    fullName: payment.customer.name,
  });
}

export async function updateCustomerFromSubscription(subscription: Subscription) {
  await upsertCustomer({
    dodoCustomerId: subscription.customer.customer_id,
    email: subscription.customer.email,
    fullName: subscription.customer.name,
  });
}

export async function updateLicenseSubscriptionStatus(subscription: Subscription) {
  await ensureLicenseStore();

  const plan = getPlanForProduct(subscription.product_id);

  if (!plan) {
    return;
  }

  const customerId = await upsertCustomer({
    dodoCustomerId: subscription.customer.customer_id,
    email: subscription.customer.email,
    fullName: subscription.customer.name,
  });

  await getDatabaseClient().execute({
    sql: `UPDATE licenses
      SET
        subscription_status = ?,
        plan = ?,
        customer_id = ?,
        customer_email = ?,
        customer_name = ?,
        dodo_product_id = ?,
        updated_at = ?
      WHERE dodo_subscription_id = ?`,
    args: [
      subscription.status,
      plan,
      customerId,
      subscription.customer.email.toLowerCase(),
      subscription.customer.name,
      subscription.product_id,
      new Date().toISOString(),
      subscription.subscription_id,
    ],
  });
}

export async function syncLicenseKeyRecord(
  dodoClient: DodoPayments,
  licenseKeyId: string,
  subscriptionStatus?: string | null,
) {
  const licenseKey = await dodoClient.licenseKeys.retrieve(licenseKeyId);
  return syncLicenseKeyData(dodoClient, licenseKey, subscriptionStatus);
}

export async function syncLicenseKeyData(
  dodoClient: DodoPayments,
  licenseKey: LicenseKey,
  subscriptionStatus?: string | null,
) {
  const plan = getPlanForProduct(licenseKey.product_id);

  if (!plan) {
    return null;
  }

  const customer = await dodoClient.customers.retrieve(licenseKey.customer_id);
  const customerId = await upsertCustomer({
    dodoCustomerId: customer.customer_id,
    email: customer.email,
    fullName: customer.name,
  });

  await upsertLicense({
    activationsLimit: licenseKey.activations_limit ?? null,
    customerEmail: customer.email,
    customerId,
    customerName: customer.name,
    dodoLicenseKeyId: licenseKey.id,
    dodoPaymentId: licenseKey.payment_id ?? null,
    dodoProductId: licenseKey.product_id,
    dodoSubscriptionId: licenseKey.subscription_id ?? null,
    expiresAt: licenseKey.expires_at ?? null,
    instancesCount: licenseKey.instances_count,
    licenseStatus: licenseKey.status,
    plan,
    subscriptionStatus: subscriptionStatus ?? null,
  });

  return {
    customer,
    licenseKey,
    plan,
  };
}

export async function getStoredLicense(licenseKeyId: string) {
  await ensureLicenseStore();

  const result = await getDatabaseClient().execute({
    sql: `SELECT
      activations_limit,
      created_at,
      customer_email,
      customer_id,
      customer_name,
      dodo_license_key_id,
      dodo_payment_id,
      dodo_product_id,
      dodo_subscription_id,
      expires_at,
      instances_count,
      license_status,
      plan,
      subscription_status,
      updated_at
    FROM licenses
    WHERE dodo_license_key_id = ?
    LIMIT 1`,
    args: [licenseKeyId],
  });

  const row = result.rows[0];

  if (!row) {
    return null;
  }

  return {
    activationsLimit: row.activations_limit as number | null,
    createdAt: row.created_at as string,
    customerEmail: row.customer_email as string,
    customerId: row.customer_id as string,
    customerName: row.customer_name as string,
    dodoLicenseKeyId: row.dodo_license_key_id as string,
    dodoPaymentId: (row.dodo_payment_id as string | null) ?? null,
    dodoProductId: row.dodo_product_id as string,
    dodoSubscriptionId: (row.dodo_subscription_id as string | null) ?? null,
    expiresAt: (row.expires_at as string | null) ?? null,
    instancesCount: Number(row.instances_count),
    licenseStatus: row.license_status as string,
    plan: row.plan as PaidPlan,
    subscriptionStatus: (row.subscription_status as string | null) ?? null,
    updatedAt: row.updated_at as string,
  } satisfies StoredLicense;
}

export async function getStoredLicenseByEmail(email: string) {
  await ensureLicenseStore();

  const result = await getDatabaseClient().execute({
    sql: `SELECT
      activations_limit,
      created_at,
      customer_email,
      customer_id,
      customer_name,
      dodo_license_key_id,
      dodo_payment_id,
      dodo_product_id,
      dodo_subscription_id,
      expires_at,
      instances_count,
      license_status,
      plan,
      subscription_status,
      updated_at
    FROM licenses
    WHERE customer_email = ?
    ORDER BY updated_at DESC
    LIMIT 1`,
    args: [email.toLowerCase()],
  });

  const row = result.rows[0];

  if (!row) {
    return null;
  }

  return {
    activationsLimit: row.activations_limit as number | null,
    createdAt: row.created_at as string,
    customerEmail: row.customer_email as string,
    customerId: row.customer_id as string,
    customerName: row.customer_name as string,
    dodoLicenseKeyId: row.dodo_license_key_id as string,
    dodoPaymentId: (row.dodo_payment_id as string | null) ?? null,
    dodoProductId: row.dodo_product_id as string,
    dodoSubscriptionId: (row.dodo_subscription_id as string | null) ?? null,
    expiresAt: (row.expires_at as string | null) ?? null,
    instancesCount: Number(row.instances_count),
    licenseStatus: row.license_status as string,
    plan: row.plan as PaidPlan,
    subscriptionStatus: (row.subscription_status as string | null) ?? null,
    updatedAt: row.updated_at as string,
  } satisfies StoredLicense;
}

export async function getCustomerById(customerId: string) {
  await ensureLicenseStore();

  const result = await getDatabaseClient().execute({
    sql: `SELECT dodo_customer_id, email, full_name FROM customers WHERE id = ? LIMIT 1`,
    args: [customerId],
  });

  const row = result.rows[0];

  if (!row) {
    return null;
  }

  return {
    dodoCustomerId: row.dodo_customer_id as string,
    email: row.email as string,
    fullName: row.full_name as string,
  };
}

export async function getCustomerForLicense(licenseKeyId: string) {
  const license = await getStoredLicense(licenseKeyId);

  if (!license) {
    return null;
  }

  const customer = await getCustomerById(license.customerId);

  if (!customer) {
    return null;
  }

  return {
    customer,
    license,
  };
}
