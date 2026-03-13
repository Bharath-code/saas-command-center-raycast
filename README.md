# SaaS Command Center

A Raycast extension for checking SaaS revenue from the keyboard. The MVP focuses on three commands:

- `rev`: revenue snapshot with today revenue, MRR, new customers, and failed payments
- `failed`: failed payment review workflow
- `projects`: local Stripe project management and project switching

## Features

- Local-first storage with Raycast `LocalStorage`
- Demo mode for trying the extension without a Stripe key
- Short-lived caching for Stripe responses to reduce duplicate API work
- Request cancellation and race protection when switching projects or refreshing quickly
- Typed service layer so UI components stay separated from Stripe logic

## Commands

### `rev`

Shows:

- Today revenue
- Monthly recurring revenue
- New customers
- Failed payments and revenue at risk

Actions:

- Refresh metrics
- Copy snapshot
- Open Stripe dashboard
- View failed payments

### `failed`

Shows all failed invoices that still have money at risk.

Actions:

- Open in Stripe
- Copy customer email
- Mark reviewed / unreviewed
- Refresh

### `projects`

Manages locally stored Stripe projects.

Actions:

- Add a project
- Set active project
- Open Stripe dashboard
- Remove a project
- Re-enable demo mode

## Demo Mode

If no Stripe project exists, onboarding offers `View Demo Metrics`. That creates a local demo project and serves data from [src/lib/demo-data.ts](/Users/bharath/Downloads/raycast-app/src/lib/demo-data.ts) instead of calling Stripe.

## Architecture

```text
Raycast Commands
  -> components/
  -> hooks/
  -> lib/storage.ts
  -> lib/stripe-metrics-service.ts
  -> Stripe REST API
```

Important files:

- [src/rev.tsx](/Users/bharath/Downloads/raycast-app/src/rev.tsx)
- [src/failed.tsx](/Users/bharath/Downloads/raycast-app/src/failed.tsx)
- [src/projects.tsx](/Users/bharath/Downloads/raycast-app/src/projects.tsx)
- [src/lib/stripe-metrics-service.ts](/Users/bharath/Downloads/raycast-app/src/lib/stripe-metrics-service.ts)
- [src/lib/storage.ts](/Users/bharath/Downloads/raycast-app/src/lib/storage.ts)

## Development

### Requirements

- Node.js
- npm
- Raycast app installed locally

### Install

```bash
npm install
```

### Run in Raycast

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

### Format

```bash
npm run format
```

### Test

```bash
npm run test
```

## Stripe Data Notes

The live snapshot currently computes:

- MRR from subscription prices normalized to monthly revenue
- Today revenue from successful `payment_intents`
- New customers from customers created today
- Failed payments and revenue at risk from open invoices with at least one payment attempt

This is intentionally MVP-oriented and local-first. There is no backend yet.

## Quality Guardrails

- Aborts in-flight Stripe requests when a newer request starts
- Ignores stale responses that resolve after a newer request
- Caches snapshot and failed-payment results briefly per project
- Unit tests cover MRR normalization and snapshot aggregation
- ESLint and Prettier are configured for local validation
