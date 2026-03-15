export type PaidPlan = "pro";
export type CheckoutPlan = "pro_monthly" | "pro_yearly" | "pro_lifetime";
export type WaitlistInterest = "general" | "free" | CheckoutPlan;
export type LaunchStage = "prelaunch" | "live";

export const siteConfig = {
  name: "Revcast",
  headline: "Stay close to Stripe revenue without living in Stripe.",
  description:
    "Revcast is a Raycast extension for Stripe-backed SaaS founders who want revenue snapshots, failed-payment review, project switching, and a faster daily operating loop.",
  shortDescription: "Revenue answers without dashboard drag.",
  supportEmail:
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() || "kumarbharath63@gmail.com",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000",
  installUrl: process.env.NEXT_PUBLIC_RAYCAST_INSTALL_URL?.trim() || "#pricing",
  launchStage: "prelaunch" as LaunchStage,
};

export const navigation = [
  { href: "#waitlist", label: "Waitlist" },
  { href: "#product", label: "Product" },
  { href: "#pricing", label: "Pricing" },
  { href: "#roadmap", label: "Roadmap" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
] as const;

export const prelaunchNotice = {
  label: "Raycast review in progress",
  detail:
    "Revcast has been submitted to the Raycast Store. Join the waitlist for launch updates and launch pricing access.",
} as const;

export const waitlistConfig = {
  eyebrow: "Prelaunch access",
  title: "Join the Revcast launch waitlist",
  description:
    "Leave your email and I will let you know when Revcast is ready to install from the Raycast Store.",
  finePrint:
    "Product updates only. No spam, no fake urgency, and no manipulative launch tactics.",
  submitLabel: "Join the waitlist",
  pendingLabel: "Joining...",
  successMessage:
    "You are on the list. I will email you when Revcast is approved and launch pricing is ready.",
  source: "landing_page" as const,
} as const;

export const waitlistInterestLabels: Record<WaitlistInterest, string> = {
  general: "General",
  free: "Free",
  pro_monthly: "Pro Monthly",
  pro_yearly: "Pro Yearly",
  pro_lifetime: "Lifetime",
} as const;

export const trustSignals = [
  "Local-first Stripe workflow",
  "Works with Stripe test and live keys",
  "Demo mode included",
  "Founder support",
] as const;

export const problemPoints = [
  "You keep opening Stripe for the same founder checks: revenue today, MRR right now, and whether failed payments need attention.",
  "Failed invoices are easy to miss when recovery work lives inside dashboard noise.",
  "Switching between projects should not require more browser tabs, re-logins, or mental overhead.",
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
      "Open `failed` to inspect invoices with money at risk, copy customer emails, and jump into Stripe only when deeper action is needed.",
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
      "Set up once from Raycast with a test key, live key, or demo data if you want to explore first.",
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

export const pricingIntro = {
  eyebrow: "Pricing",
  title: "Clear launch pricing, with the free plan still fully visible.",
  description:
    "The free plan is for founders who want the core daily workflow. Pro is for multi-workspace operators who want a tighter command center. Launch pricing may increase after the first release window, but the value has to stay real.",
} as const;

export const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    cadence: "",
    description:
      "For founders who want the core Revcast workflow without paying before they have used it.",
    features: [
      "Revenue snapshot command",
      "Failed payment review",
      "Demo mode access",
      "One local Stripe project",
    ],
    ctaLabel: "Join free waitlist",
    liveCtaLabel: "Install free on Raycast",
    kind: "link" as const,
    waitlistInterest: "free" as WaitlistInterest,
    note: "A good fit if you want to start with one product and the everyday essentials.",
  },
  {
    name: "Pro Monthly",
    price: "$5",
    cadence: "/mo",
    description:
      "For founders who want unlimited local workspaces and a faster paid workflow once Revcast launches.",
    features: [
      "Unlimited local Stripe projects",
      "Device license activation",
      "Billing portal access",
      "Priority roadmap access",
    ],
    ctaLabel: "Join monthly waitlist",
    liveCtaLabel: "Start monthly",
    kind: "checkout" as const,
    checkoutPlan: "pro_monthly" as CheckoutPlan,
    waitlistInterest: "pro_monthly" as WaitlistInterest,
    featured: true,
    note: "Launch price. This may increase after the first public release window.",
  },
  {
    name: "Pro Yearly",
    price: "$49",
    cadence: "/yr",
    description:
      "For founders who already know they want the lower annual price once yearly checkout opens.",
    features: [
      "Everything in Pro Monthly",
      "Lower annual effective price",
      "Priority roadmap access",
      "Yearly billing when checkout is live",
    ],
    ctaLabel: "Join yearly waitlist",
    liveCtaLabel: "Start yearly",
    kind: "checkout" as const,
    checkoutPlan: "pro_yearly" as CheckoutPlan,
    waitlistInterest: "pro_yearly" as WaitlistInterest,
    note: "Yearly pricing is visible now, but checkout opens after the Raycast approval window.",
  },
  {
    name: "Lifetime",
    price: "$59",
    cadence: " one-time",
    description:
      "For founders who prefer one clean early-adopter purchase instead of another monthly software bill.",
    features: [
      "Unlimited local Stripe projects",
      "Device license activation",
      "No recurring subscription",
      "Priority roadmap access",
    ],
    ctaLabel: "Join lifetime waitlist",
    liveCtaLabel: "Buy lifetime",
    kind: "checkout" as const,
    checkoutPlan: "pro_lifetime" as CheckoutPlan,
    waitlistInterest: "pro_lifetime" as WaitlistInterest,
    note: "Lifetime is positioned as an early-adopter offer and may not stay at the same price after launch.",
  },
] as const;

export const roadmapItems = [
  {
    title: "Saved snapshots and quick compare",
    description:
      "Pin a revenue snapshot and compare your current numbers without leaving the fast command flow.",
  },
  {
    title: "Deeper failed-payment workflow",
    description:
      "More recovery context around retry timing, failed invoices, and follow-up actions inside the `failed` view.",
  },
  {
    title: "Light churn and retention indicators",
    description:
      "Simple founder-friendly signals like recent churn and net-new movement without becoming a heavy analytics suite.",
  },
  {
    title: "Better multi-workspace ergonomics",
    description:
      "Faster project switching, clearer workspace context, and improved handling for operators running multiple Stripe businesses.",
  },
  {
    title: "Performance-focused Pro quality-of-life",
    description:
      "Faster refresh, prefetching, and more focused filtering that make the extension even more useful in the daily loop.",
  },
] as const;

export const faqItems = [
  {
    question: "What exactly can I do with Revcast today?",
    answer:
      "Revcast ships four focused commands. `rev` gives you the revenue snapshot, `failed` shows invoices with money at risk, `projects` manages local Stripe workspaces, and `license` handles Pro activation and billing actions. It stays intentionally opinionated around the founder checks that happen all day.",
  },
  {
    question: "Why is there a waitlist right now?",
    answer:
      "Revcast has already been submitted to the Raycast Store for approval. While that review is pending, the landing page is collecting interest so I can email founders as soon as the listing is live. The waitlist is there to keep launch communication clean and honest, not to fake scarcity.",
  },
  {
    question: "Do I need a live Stripe account to try it later?",
    answer:
      "No. You can start with demo mode right away, and you can also connect a Stripe test key if you want to validate the workflow before using live data.",
  },
  {
    question: "Does Revcast store my Stripe keys on your server?",
    answer:
      "The extension is local-first. Stripe project credentials stay in the Raycast extension on your device, and the hosted website is used for waitlist capture, checkout, and license APIs.",
  },
  {
    question: "What does the free plan include?",
    answer:
      "The free plan is meant to stay useful. It covers the core Revcast workflow: one local Stripe project, revenue snapshots, failed-payment review, and demo mode so you can understand the product before paying.",
  },
  {
    question: "What does Pro unlock beyond the free plan?",
    answer:
      "Pro is for founders operating more than one workspace on the same machine and wanting the full licensed workflow. It unlocks unlimited local Stripe projects, license activation, billing management, and future Pro-focused quality-of-life improvements.",
  },
  {
    question: "How does payment and licensing work?",
    answer:
      "Checkout is handled through Dodo Payments on the website, then the purchased plan is activated from the `license` command inside Raycast. Monthly and lifetime are already defined, while yearly is visible on the launch page and will open when yearly checkout is wired.",
  },
] as const;

export const finalCta = {
  eyebrow: "Prelaunch",
  title: "Join the launch list if Revcast fits the way you already work.",
  description:
    "The goal is simple: help Stripe-backed founders check revenue faster, catch money at risk earlier, and stay focused. If that is valuable to you, join the waitlist and pick the plan you want me to reserve interest for.",
  primaryLabel: "Join the launch waitlist",
  secondaryLabel: "Email Bharath",
} as const;

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
