## Revcast pricing research (Raycast ecosystem)

### 1. What Revcast is offering today

- **Audience**: Individual Stripe-backed SaaS founders and small teams using Stripe as their primary billing system.
- **Core value**: Surface revenue, MRR, new customers, and failed payments directly inside Raycast with:
  - Local-first storage of Stripe projects and keys.
  - Demo mode (no Stripe key required to try it).
  - Short-lived caching, request cancellation, and race protection.
  - A typed service layer separating UI from Stripe logic.
- **Key commands and user-facing benefits**:
  - `rev`: at-a-glance revenue snapshot (today’s revenue, MRR, new customers, failed payments + revenue at risk) and quick navigation to Stripe.
  - `failed`: focused workflow for reviewing failed invoices and acting on revenue at risk.
  - `projects`: manages multiple Stripe projects locally, including demo mode, without any external backend.
  - `license`: device-based activation and billing actions for a Pro plan via Dodo-hosted checkout.
- **Monetization design**:
  - Optional **Pro plan** backed by **Dodo-hosted checkout** and device activation (license keys).
  - Website provides pricing, checkout, license activation, and portal, but Stripe credentials stay local to Raycast.

**Implication**: The paid value is not “access to Stripe” (free Raycast Stripe extension already does that) but **a faster, opinionated revenue cockpit** plus **license-based Pro features**.

---

### 2. Nearby products and how they price

#### 2.1 Raycast platform pricing (anchor)

Sources: Raycast pricing pages and blog (2026).

- **Raycast Free**:
  - Cost: $0.
  - Includes core launcher, developer tooling, custom extensions, 3‑month clipboard, limited AI usage.
- **Raycast Pro**:
  - Cost: around **$8–10 / month per user** (cheaper annually).
  - Adds unlimited/extended AI usage, cloud sync, custom themes.
- **Raycast Teams / Enterprise**:
  - Teams Pro around **$15 / user / month**, with collaboration and admin controls.

**Takeaway**: Raycast’s own premium anchor is roughly **$8–10/month** for “power-user” features. An individual extension that focuses on a single SaaS workflow typically needs to price **below or in the same psychological band** as Raycast Pro unless it’s clearly business-critical.

#### 2.2 Stripe Raycast extension

Sources: Stripe Raycast extension listing and repo.

- **Pricing**: Free extension in the Raycast Store.
- **Feature set**:
  - Quick access to Stripe dashboard, links, and entities.
  - Developer-oriented workflow for navigating Stripe from Raycast.

**Position vs Revcast**:

- Stripe extension is:
  - General dashboard/navigation helper.
  - Free, and “official-ish” feeling.
- Revcast is:
  - Focused **revenue analytics and at-risk revenue workflow**.
  - Adds **MRR normalization logic, snapshot aggregation, quality guardrails**, and opinionated FTUE.

**Takeaway**: We cannot charge purely for “a Stripe Raycast extension” because there is already a free one. We are charging for **better answers and workflows**, not basic Stripe access.

#### 2.3 Dodo Payments Raycast extension

Sources: Dodo Payments Raycast listing and docs.

- **Pricing**: Free extension.
- **Feature set**:
  - Management UI for Dodo: payments, subscriptions, customers, products, discounts, disputes, payouts, license keys.

**Position vs Revcast**:

- Dodo’s extension is a dashboard/CRM-style management surface for Dodo itself.
- Revcast uses Dodo only for **checkout + licensing**, while its core value is **Stripe revenue analytics inside Raycast**.

**Takeaway**: Dodo’s own Raycast extension being free reinforces that Revcast should not monetize “access to Dodo or Stripe” but the **higher-level SaaS founder workflow**.

#### 2.4 Adjacent products (non‑Raycast)

While there are no widely visible paid Raycast extensions specifically for Stripe revenue dashboards:

- SaaS analytics tools (Baremetrics, ChartMogul, ProfitWell) tend to start around **$50–100 / month** targeting larger teams and higher revenue bands.
- Simpler indie founder tools (indie dashboards, simple Stripe revenue widgets) often land in the **$5–20 / month** range or a **one‑time ~$29–59** payment when aimed at solo devs.

**Takeaway**: Revcast is closer to a **lightweight indie analytics tool** with strong UX, not a full-blown analytics platform. A fair price should feel like a **small expense next to Stripe revenue volume**, and well under the “heavy analytics” tools.

---

### 3. Are current features “Pro-plan-justified”?

Based on the README and code structure:

- **Strong Pro-justified features today**:
  - Holistic **revenue snapshot (`rev`)** with MRR normalization and aggregation logic.
  - **Failed payments workflow** that surfaces revenue at risk directly in Raycast.
  - **Multi-project support** (especially for agencies or founders with multiple Stripe accounts).
  - **Local-first design** (Stripe keys never leave Raycast; backend only for licensing/checkout).
  - **Quality guardrails**: request cancellation, race protection, caching.
  - **Device-based licensing** with Dodo (professional paid distribution vs hobby project).
- **Borderline / almost-enough for paid**:
  - Demo mode and onboarding are polished, but primarily a FTUE improvement.
  - No backend analytics or historical storage beyond Stripe itself; depends fully on Stripe’s data.

**Conclusion**: The current feature set **can justify a modest Pro price** aimed at solo founders/indies, especially given the time saved for frequent revenue checks. However, to confidently charge at the higher end (e.g. ≥$10/month), we likely need clearer **Pro-only delighters** beyond “you get to use it at all”.

---

### 4. Recommended pricing model

Given:

- Raycast Pro anchors user expectations at **~$8–10/month**.
- Competitor Stripe Raycast extension is **free**.
- Revcast is a focused, solo-founder‑friendly tool, not a full analytics platform.

**Recommended structure (v1 launch)**:

- **Free tier**:
  - Access to:
    - 1 Stripe project.
    - `rev` and `failed` commands with **rate-limited refresh** (e.g. every N minutes).
    - Demo mode.
  - No Dodo license required; this is “Revcast Lite”.
- **Revcast Pro** (licensed via Dodo):
  - **Price**: 
    - **$5 / month** (or **$49 / year**) as an initial anchor.
    - This is below Raycast Pro, feels accessible for solo founders, but high enough to signal seriousness.
  - Unlocks:
    - Unlimited projects.
    - Faster refresh cadence and maybe background-refresh capabilities.
    - Priority for new features and UX polish.

**Alternative for “once-and-done” buyers**:

- Offer a **lifetime license** at **$59–79** for early adopters.
  - Matches indie pricing norms.
  - Good fit for one‑person SaaS founders who dislike ongoing subscriptions for tools.

---

### 5. Feature gaps & suggested Pro differentiators

To make Pro clearly worth paying for and to defend the price point:

**High‑leverage Pro features to consider:**

1. **Saved revenue snapshots / quick compare**
  - Let users pin a snapshot (e.g., “start of month”) and compare current numbers in one glance.
  - This is lightweight but feels like “analytics”, not just display.
2. **Deeper failed payment workflow**
  - Add more metadata around retries, last attempt, and links to recommended actions.
  - Possibly small playbooks like: “copy email template for dunning follow‑up”.
3. **Simple churn / retention indicators**
  - A light‑touch calculation (customers cancelled in last 30 days, net new MRR vs churned MRR).
  - Keep this within the local‑first constraint, reading directly from Stripe.
4. **Multi‑workspace / multi‑Stripe‑account ergonomics**
  - Commands that quickly flip between projects and remember per‑project preferences.
  - Favor agencies or power users; this is very Pro‑feeling.
5. **Pro‑only quality‑of‑life enhancements**
  - Faster refresh intervals.
  - Background prefetch when Raycast opens.
  - More granular filters in `failed` (e.g., “high‑value failed invoices first”).

**Non‑goals for now (would push scope too far):**

- Full-blown cohort charts, ARPU/LTV modeling, or advanced dunning automation (those belong in heavy analytics apps).
- Complex team features; this is currently optimized for individual founders running Raycast locally.

---

### 6. Summary: Fair pricing & roadmap

- **Fair initial Pro price**:
  - **$5/month or $49/year** per user as a starting point.
  - Optionally, a **lifetime early‑adopter license** at **$59–79**.
- **Justification with current features**:
  - Already provides a polished, focused revenue cockpit with strong UX and local‑first privacy.
  - To feel “obviously worth it” for more users, we should add a few **Pro‑exclusive delighters** (multi‑project enhancements, richer failed-payment workflow, light churn indicators).
- **Next steps**:
  - Finalize tier boundaries (what’s Free vs Pro in the commands and license logic).
  - Implement pricing copy and comparison table on the website.
  - Iterate Pro features based on early user feedback and actual usage patterns.

