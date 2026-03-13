export type PaidPlan = "pro" | "team";

export const siteConfig = {
  name: "Revcast",
  headline: "Your SaaS revenue. On command.",
  description:
    "Revcast puts MRR, revenue, and failed-payment visibility inside Raycast so founders can check the numbers that matter without leaving the keyboard.",
  shortDescription: "Revenue control without dashboard drag.",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() || "founder@revcast.app",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000",
  installUrl: process.env.NEXT_PUBLIC_RAYCAST_INSTALL_URL?.trim() || "#pricing",
};

export const navigation = [
  { href: "#product", label: "Product" },
  { href: "#workflow", label: "Workflow" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
] as const;

export const trustSignals = ["Founder-built", "Works with Stripe", "No extra dashboard"] as const;

export const problemPoints = [
  "Today’s revenue should not require a tab hunt.",
  "MRR checks should not break your shipping flow.",
  "Failed payments should not stay buried until churn shows up.",
] as const;

export const productFeatures = [
  {
    title: "Instant revenue snapshot",
    description:
      "See today’s revenue, MRR, new customers, and revenue at risk in one quick command-driven view.",
    tone: "neutral",
  },
  {
    title: "Failed payment visibility",
    description:
      "Review revenue at risk before it quietly turns into lost customers or missed recovery follow-up.",
    tone: "danger",
  },
  {
    title: "Project switching",
    description:
      "Move across Stripe workspaces from the keyboard instead of reopening dashboards and losing context.",
    tone: "neutral",
  },
] as const;

export const workflowSteps = [
  {
    step: "01",
    title: "Press cmd + space",
    description: "Open Raycast the same way you already start everything else.",
  },
  {
    step: "02",
    title: "Type rev",
    description: "Call up your revenue snapshot without opening Stripe.",
  },
  {
    step: "03",
    title: "Scan and move on",
    description: "Get the answer, close the command, and keep shipping.",
  },
] as const;

export const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    cadence: "",
    description: "Start with the fast revenue checks you run every day.",
    features: ["Revenue snapshot", "Failed payment list", "Local project switching"],
    ctaLabel: "Install free on Raycast",
    kind: "link" as const,
  },
  {
    name: "Pro",
    price: "$12",
    cadence: "/mo",
    description: "For founders who want tighter revenue visibility as the business grows.",
    features: ["Multi-workspace command center", "Priority roadmap access", "Trend view and faster refresh"],
    ctaLabel: "Unlock Pro",
    kind: "checkout" as const,
    plan: "pro" as PaidPlan,
    featured: true,
  },
  {
    name: "Team",
    price: "$29",
    cadence: "/mo",
    description: "For small teams that want shared visibility and proactive follow-up.",
    features: ["Shared revenue visibility", "Alerts and weekly digests", "Priority support"],
    ctaLabel: "Start Team",
    kind: "checkout" as const,
    plan: "team" as PaidPlan,
  },
] as const;

export const faqItems = [
  {
    question: "Why not just open Stripe?",
    answer:
      "Because this is faster. Revcast is built for the quick revenue checks that should not cost you context or momentum.",
  },
  {
    question: "Who is Revcast for?",
    answer: "Indie SaaS founders and lean teams who already use Stripe and spend a lot of time inside Raycast.",
  },
  {
    question: "Why Dodo Payments?",
    answer:
      "Dodo gives Revcast a clean hosted checkout and works well for India-based founders selling globally.",
  },
] as const;
