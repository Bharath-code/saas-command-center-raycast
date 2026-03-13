Perfect. Now we are **deep in build layer.**
This is where product becomes real.

I’ll give you **clean engineering spec** — not vague talk.

You can literally start coding from this.

---

# ⚙️ Exact Stripe Metrics Service Utility Design

Goal:

👉 One reusable service that fetches + computes SaaS metrics.

Keep ALL Stripe logic here.
UI must never talk Stripe directly.

This gives future:

* testability
* reuse in web SaaS
* cleaner architecture

---

## 🧠 File Location

```ts
extension/lib/stripeMetricsService.ts
```

---

## ⭐ Responsibilities

This service should:

* fetch subscriptions
* compute MRR
* fetch payment intents
* compute today revenue
* fetch failed invoices
* compute revenue at risk

---

## 🧩 Service API Design

```ts
export async function getRevenueSnapshot(stripeKey: string) {
  return {
    mrr: number,
    todayRevenue: number,
    newCustomers: number,
    failedPaymentsCount: number,
    revenueAtRisk: number
  }
}
```

This becomes your **single source of truth.**

---

## 🥇 MRR Calculation Logic (Utility Function)

```ts
function calculateMRR(subscriptions) {
  return subscriptions.reduce((sum, sub) => {
    const amount = sub.plan.amount / 100

    if (sub.plan.interval === "year") {
      return sum + amount / 12
    }

    return sum + amount
  }, 0)
}
```

Keep normalization here.

---

## 🥈 Today Revenue Logic

Fetch:

```ts
GET /v1/payment_intents
```

Filter:

* created timestamp > startOfDay
* status === "succeeded"

---

## 🥉 Revenue at Risk Logic

Fetch:

```ts
GET /v1/invoices?status=open
```

Sum:

* amount_due

---

## 🟡 Performance Rule

Later:

* add caching
* debounce refresh
* batch Stripe calls

But NOT MVP.

---

# 🚨 Exact Failed Payments Screen UI Spec

Command:

👉 `failed`

Goal:

User instantly sees:

> “How much money is slipping.”

---

## 🎨 Layout Type

Use:

👉 `List`

Grouped by severity (future)

---

## ⭐ Header

```ts
⚠️ Failed Payments
3 customers • $84 at risk
```

---

## 🥇 List Item Structure

Example:

```ts
Title: John Doe — $29
Subtitle: Retry tomorrow
Accessory: Card Declined
```

---

## 🥈 Secondary Metadata

Use icon accessory:

* 🔁 retry pending
* ❌ final failure

---

## 🥉 Action Panel (VERY IMPORTANT)

When user selects item:

Actions:

```ts
🌐 Open in Stripe
📧 Copy Email
🔄 Retry Payment
✅ Mark Reviewed
```

Workflow lock-in starts here.

---

## 🟡 Empty State

```ts
🎉 No failed payments today.

Your revenue is safe.
```

This creates emotional relief.

---

# 🚀 Exact Onboarding UI Spec Inside Raycast

This is HUGE.

Most conversion lost here.

---

## 🧠 Onboarding Trigger

First run:

If no Stripe key stored → show onboarding screen.

---

## ⭐ Screen Type

Use:

👉 `Detail` View

Better for guided experience.

---

## 🟢 Screen Layout

### Title

```ts
Check your SaaS revenue instantly.
```

---

### Body

```
Connect your Stripe account to:

• See MRR from keyboard
• Catch failed payments early
• Stay in control of growth
```

---

## 🥇 Primary Action

```ts
🔗 Connect Stripe (takes 20 seconds)
```

---

## 🥈 Secondary Action

```ts
👀 View Demo Metrics
```

Critical for lowering resistance.

---

## 🥉 Input Flow

After clicking connect:

Show:

```ts
Paste your Stripe Secret Key
```

Below:

Small trust copy:

> Stored securely on your device.

---

## 🟡 Success Screen

After connect:

Show toast:

```ts
🎉 Stripe Connected
Type "rev" to see your metrics.
```

---

# ⭐ Engineering Golden Rule

Build:

* small
* composable
* keyboard-first

Do NOT build:

* modal heavy flows
* visual dashboards
* multi-step navigation

Raycast UX = speed.

---

# 🚀 Your Immediate Next Task (Very Clear)

Now you must:

1. Create `stripeMetricsService.ts`
2. Hardcode mock response
3. Render metrics in `rev` command
4. Run locally

Momentum unlocked.

---
