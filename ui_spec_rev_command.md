GOOD. Now we are in **pure build mode.**
No more strategy.
No more fear.

You are designing the **first user experience that creates belief.**

This matters a LOT.

Because Raycast = speed + clarity + keyboard joy.

Let’s design the UI like a serious product designer.

---

# 🎨 Exact First UI Layout Spec — `rev` Command

## 🧠 UX Goal

User should feel in **3 seconds:**

✅ “Oh nice… I can see my revenue instantly.”
✅ “This is faster than Stripe.”
✅ “I will use this daily.”

---

# 🧩 Screen Type

Use:

👉 `List` View (Raycast Native Pattern)

NOT grid.
NOT detail page first.

List = scanable + fast.

---

# ⭐ Layout Structure (Top → Bottom)

```
Header
Revenue Metrics
Revenue Risk Section
Quick Actions Footer
```

---

# 🟢 Section 1 — Header

### Title

```
💰 SaaS Snapshot
```

### Subtitle

```
Stripe • Project Alpha
```

If multiple projects later:

Subtitle updates dynamically.

---

# 🟡 Section 2 — Revenue Metrics Block

Each metric = List.Item

Order is VERY important psychologically.

---

## Item 1 — Today Revenue (Top Priority)

```
Title: 💵 Today Revenue
Accessory: $184
Subtitle: +12% vs yesterday
```

Why top:

Immediate dopamine.

---

## Item 2 — MRR

```
Title: 📈 Monthly Recurring Revenue
Accessory: $4,912
Subtitle: +2.1% this week
```

---

## Item 3 — New Customers

```
Title: 🟢 New Customers
Accessory: 6
Subtitle: Today
```

---

# 🔴 Section 3 — Revenue Risk (Painkiller Zone)

Separator:

```
--- Revenue Risk ---
```

---

## Failed Payments Item

```
Title: ⚠️ Failed Payments
Accessory: 3
Subtitle: $84 at risk
```

This is VERY important.

This drives conversion.

---

# ⚡ Action Panel Spec (Right Arrow Interaction)

When user selects any metric:

Open Action Panel.

Actions:

```
🔄 Refresh Metrics
📋 Copy Snapshot
🌐 Open Stripe Dashboard
📊 View Failed Payments
```

Later paid:

```
🔔 Enable Alerts (Pro)
```

---

# 🎯 Keyboard Optimization

User flow must be:

```
cmd + space
rev
enter
```

Then:

* arrow down
* enter action

Everything reachable in **< 2 seconds.**

---

# 🎨 Visual Density Rules

Raycast users prefer:

✅ tight layout
✅ no long descriptions
✅ strong emoji anchors
✅ numeric clarity

Avoid:

* paragraphs
* explanations
* fancy formatting

---

# 🧪 Empty State Spec (Very Important)

If Stripe not connected:

Show:

```
No revenue data yet.

Connect Stripe to see your SaaS snapshot instantly.
```

Action:

```
🔗 Connect Stripe
```

---

# ⏳ Loading State Spec

When fetching:

```
Fetching latest metrics…
```

Accessory:

spinner

Never freeze screen.

---

# 🧠 Psychological UX Tricks

### Trick 1 — Positive Color Words

Use:

* 🟢 growth
* ⚠️ risk

User brain scans emotionally.

---

### Trick 2 — Relative Context

Always show:

* vs yesterday
* vs last week

Numbers feel alive.

---

### Trick 3 — Micro Reward

After refresh:

Toast:

```
Metrics updated ✅
```

Tiny but powerful.

---

# ⭐ V1 Visual Hierarchy Summary

1. Today Revenue → dopamine
2. MRR → stability
3. Failed Payments → urgency
4. Actions → control

This sequence is intentional.

---

# 🚀 What You Should Build TODAY

Just:

* header
* 3 metrics
* failed payments item
* refresh action

Hardcode values.

Run extension.

Feel momentum.

---

