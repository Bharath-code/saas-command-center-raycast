export type PaidPlan = "pro";

export const siteConfig = {
  name: "Revcast",
  headline: "Stripe revenue in Raycast. No tab tax.",
  description:
    "Revcast is a Raycast extension for Stripe-backed SaaS founders who want revenue snapshot, failed-payment review, project switching, and Pro licensing without opening another dashboard.",
  shortDescription: "Revenue answers without dashboard drag.",
  supportEmail:
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() || "kumarbharath63@gmail.com",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000",
  installUrl: process.env.NEXT_PUBLIC_RAYCAST_INSTALL_URL?.trim() || "#pricing",
};

export const navigation = [
  { href: "#product", label: "Product" },
  { href: "#screens", label: "Screens" },
  { href: "#workflow", label: "Workflow" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
] as const;

export const trustSignals = [
  "Raycast-native workflow",
  "Works with Stripe test and live keys",
  "Demo mode included",
  "Founder support",
] as const;

export const problemPoints = [
  "You open Stripe for the same daily checks: today revenue, MRR, new customers, and revenue at risk.",
  "Failed invoices stay hidden behind notifications until the follow-up is already late.",
  "Switching between products or client workspaces should not cost another login and another context break.",
] as const;

export const productFeatures = [
  {
    title: "Revenue snapshot",
    description:
      "Run `rev` to see today revenue, MRR, new customers, failed payments, and revenue at risk in one Raycast view.",
    tone: "neutral",
  },
  {
    title: "Failed payment review",
    description:
      "Open `failed` to inspect invoices with money at risk, copy customer emails, and jump straight back into Stripe when needed.",
    tone: "danger",
  },
  {
    title: "Project switching",
    description:
      "Use `projects` to add, switch, or remove local Stripe workspaces without rebuilding your workflow around browser tabs.",
    tone: "neutral",
  },
  {
    title: "Local-first onboarding",
    description:
      "Start with demo data, connect a Stripe test key, or activate Pro from the `license` command when you are ready.",
    tone: "neutral",
  },
] as const;

export const screenshotShowcase = [
  {
    asset: "snapshot",
    command: "rev",
    title: "Revenue snapshot action",
    description:
      "The main command surfaces today revenue, MRR, new customers, failed payments, and quick actions in one glance.",
    alt: "Revcast revenue snapshot action inside Raycast showing SaaS metrics and command actions.",
  },
  {
    asset: "failed",
    command: "failed",
    title: "Failed payment queue",
    description:
      "Review invoices with money at risk, open the Stripe record, and keep recovery work visible instead of buried.",
    alt: "Revcast failed payments list in Raycast with invoice details and revenue at risk.",
  },
  {
    asset: "projects",
    command: "projects",
    title: "Project manager",
    description:
      "Add local Stripe projects, switch active workspaces, and keep multiple products organized from the keyboard.",
    alt: "Revcast projects command in Raycast showing multiple Stripe workspaces.",
  },
  {
    asset: "onboarding",
    command: "setup",
    title: "Fast onboarding",
    description:
      "New users can connect Stripe or jump into demo mode immediately, which makes the product easy to evaluate.",
    alt: "Revcast onboarding screen in Raycast offering Stripe setup and demo mode.",
  },
  {
    asset: "license",
    command: "license",
    title: "License and billing",
    description:
      "Pro customers can activate a device, refresh billing state, and manage the paid plan without leaving the app.",
    alt: "Revcast license and billing command in Raycast showing plan and activation status.",
  },
  {
    asset: "empty",
    command: "states",
    title: "Thoughtful empty states",
    description:
      "Even the quiet moments are handled clearly, so founders know what to do next instead of staring at a blank list.",
    alt: "Revcast empty state in Raycast explaining that there are no failed payments to review.",
  },
] as const;

export const workflowSteps = [
  {
    step: "01",
    title: "Add a Stripe project or start in demo",
    description:
      "Set up once from Raycast with a test key, live key, or demo data if you just want to explore first.",
  },
  {
    step: "02",
    title: "Run the command you need",
    description:
      "Jump between `rev`, `failed`, `projects`, and `license` based on the exact question you need answered.",
  },
  {
    step: "03",
    title: "Check the number and keep shipping",
    description:
      "Use Stripe only when deeper action is required. Everything else stays fast, local, and command-first.",
  },
] as const;

export const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    cadence: "",
    description:
      "The essential Revcast workflow for founders who want a faster daily revenue check.",
    features: [
      "Revenue snapshot command",
      "Failed payment review",
      "Demo mode access",
      "One local Stripe project",
    ],
    ctaLabel: "Install free on Raycast",
    kind: "link" as const,
  },
  {
    name: "Pro",
    price: "$12",
    cadence: "/mo",
    description:
      "For operators who manage multiple workspaces and want the full license, billing, and project-switching workflow.",
    features: [
      "Unlimited local Stripe projects",
      "Device license activation",
      "Billing portal access",
      "Priority roadmap access",
    ],
    ctaLabel: "Unlock Pro",
    kind: "checkout" as const,
    plan: "pro" as PaidPlan,
    featured: true,
  },
] as const;

export const faqItems = [
  {
    question: "What exactly can I do with Revcast today?",
    answer:
      "Revcast ships four focused commands. `rev` gives you the revenue snapshot, `failed` shows invoices with money at risk, `projects` manages local Stripe workspaces, and `license` handles Pro activation and billing actions. It is intentionally opinionated around the founder checks that happen all day.",
  },
  {
    question: "Do I need a live Stripe account to try it?",
    answer:
      "No. You can start with demo mode right away, and you can also connect a Stripe test key if you want to validate the real workflow before using live data. That makes Revcast useful both for evaluation and for building safely in test mode.",
  },
  {
    question: "Does Revcast store my Stripe keys on your server?",
    answer:
      "The extension is local-first. Stripe project credentials live in the Raycast extension on your device, and the hosted website is used for checkout plus license APIs. Revcast is designed so your everyday metric checks do not depend on a separate analytics backend.",
  },
  {
    question: "Why use this instead of just opening Stripe?",
    answer:
      "Stripe is still the right place for deeper billing work. Revcast is for the repeat questions that should take seconds, not a full dashboard detour: what landed today, what is current MRR, how many customers are new, and whether failed payments need attention.",
  },
  {
    question: "What does Pro unlock beyond the free plan?",
    answer:
      "Pro is built for founders operating more than one workspace on the same machine. It unlocks unlimited local Stripe projects, device-based license activation, billing management, and a more complete operating workflow for people who live in Raycast.",
  },
  {
    question: "How does payment and licensing work?",
    answer:
      "Checkout is handled through Dodo Payments on the website, then the purchased plan is activated from the `license` command inside Raycast. From there you can refresh status, open the billing portal, replace an activation, or release the current device when needed.",
  },
] as const;

export const contactLinks = [
  {
    label: "Email",
    value: "kumarbharath63@gmail.com",
    note: "Support, product feedback, and founder conversations.",
    href: "mailto:kumarbharath63@gmail.com",
  },
  {
    label: "Twitter",
    value: "@iam_pbk",
    note: "Shipping updates, thoughts, and direct messages.",
    href: "https://x.com/iam_pbk",
  },
  {
    label: "GitHub",
    value: "Bharath-code",
    note: "Code, issues, and the product build trail.",
    href: "https://github.com/Bharath-code",
  },
  {
    label: "Raycast ID",
    value: "bharath",
    note: "Search the creator profile directly inside Raycast.",
  },
] as const;
