import { Suspense } from "react";
import Image from "next/image";

import emptyStateImage from "../../extensions/revcast/metadata/6-empty-state.png";
import failedPaymentsImage from "../../extensions/revcast/metadata/2-failed-payments.png";
import licenseImage from "../../extensions/revcast/metadata/5-license.png";
import onboardingImage from "../../extensions/revcast/metadata/4-onboarding.png";
import projectsImage from "../../extensions/revcast/metadata/3-projects.png";
import revenueSnapshotImage from "../../extensions/revcast/metadata/1-revenue-snapshot-action.png";
import { CheckoutButton } from "../components/CheckoutButton";
import { ScreenshotCarousel } from "../components/ScreenshotCarousel";
import { WaitlistForm } from "../components/WaitlistForm";
import {
  contactLinks,
  finalCta,
  faqItems,
  navigation,
  prelaunchNotice,
  pricingPlans,
  pricingIntro,
  problemPoints,
  productFeatures,
  roadmapItems,
  screenshotShowcase,
  siteConfig,
  trustSignals,
  waitlistConfig,
  workflowSteps,
} from "../lib/content";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: siteConfig.name,
  applicationCategory: "BusinessApplication",
  operatingSystem: "macOS",
  description: siteConfig.description,
  offers: [
    {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Starter plan",
    },
    {
      "@type": "Offer",
      price: "5",
      priceCurrency: "USD",
      description: "Pro Monthly plan",
    },
    {
      "@type": "Offer",
      price: "49",
      priceCurrency: "USD",
      description: "Pro Yearly plan",
    },
    {
      "@type": "Offer",
      price: "59",
      priceCurrency: "USD",
      description: "Lifetime plan",
    },
  ],
};

const screenshotAssets = {
  snapshot: revenueSnapshotImage,
  failed: failedPaymentsImage,
  projects: projectsImage,
  onboarding: onboardingImage,
  license: licenseImage,
  empty: emptyStateImage,
} as const;

export default function HomePage() {
  const screenshots = screenshotShowcase.map((shot) => ({
    ...shot,
    image: screenshotAssets[shot.asset],
  }));
  const isPrelaunch = siteConfig.launchStage === "prelaunch";
  const waitlistHref = (interest?: string) =>
    interest ? `/?interest=${interest}#waitlist` : "#waitlist";

  return (
    <main className="page-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="site-header">
        <a className="brand-mark" href="/">
          <span className="brand-mark__glyph">R</span>
          <span>revcast</span>
        </a>

        <nav className="site-nav" aria-label="Primary">
          {navigation.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <a
          className="button button-secondary button-compact"
          href={isPrelaunch ? waitlistHref() : "#pricing"}
        >
          {isPrelaunch ? "Join Waitlist" : "Unlock Pro"}
        </a>
      </header>

      <section className="hero section">
        <div className="hero-copy">
          <p className="eyebrow">Raycast extension for Stripe-backed founders</p>
          <h1>{siteConfig.headline}</h1>
          <p className="hero-lead">
            Revcast brings your revenue snapshot, failed-payment queue, project
            switching, and Pro licensing into Raycast so the daily Stripe check
            takes seconds instead of another dashboard detour.
          </p>

          <div className="button-row">
            <a className="button button-primary" href={waitlistHref()}>
              {isPrelaunch ? "Join the launch waitlist" : "Install free on Raycast"}
            </a>
            <a className="button button-secondary" href="#pricing">
              See pricing
            </a>
          </div>

          <ul className="trust-list" aria-label="Trust signals">
            {trustSignals.map((signal) => (
              <li key={signal}>{signal}</li>
            ))}
          </ul>

          {isPrelaunch ? (
            <div className="approval-note" role="note">
              <strong>{prelaunchNotice.label}</strong>
              <p>{prelaunchNotice.detail}</p>
            </div>
          ) : null}
        </div>

        <div className="hero-preview" aria-label="Revcast product preview">
          <div className="preview-window preview-window-image">
            <div className="preview-window__header">
              <span />
              <span />
              <span />
            </div>

            <div className="preview-window__toolbar">
              <span className="preview-window__badge">Actual extension screen</span>
              <span className="preview-window__command">rev</span>
            </div>

            <div className="preview-window__image-frame">
              <Image
                src={revenueSnapshotImage}
                alt="Revcast revenue snapshot action in Raycast showing MRR, today revenue, failed payments, and actions."
                className="preview-window__image"
                priority
                sizes="(max-width: 1080px) 100vw, 40vw"
              />
            </div>

            <p className="preview-footnote">
              Revenue snapshot inside Raycast, using the actual Revcast UI.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-grid waitlist-section" id="waitlist">
        <div className="section-head">
          <p className="eyebrow">{waitlistConfig.eyebrow}</p>
          <h2>{waitlistConfig.title}</h2>
          <p>{waitlistConfig.description}</p>
        </div>

        <div className="waitlist-panel">
          <div className="waitlist-panel__form">
            <Suspense fallback={<div className="waitlist-form-skeleton" />}>
              <WaitlistForm />
            </Suspense>
          </div>
        </div>
      </section>

      <section className="section section-grid" id="product">
        <div className="section-head">
          <p className="eyebrow">The problem</p>
          <h2>You should not need a browser round-trip for routine revenue ops.</h2>
          <p>
            Revcast is built for the checks you repeat every day inside a
            SaaS business: revenue today, MRR right now, what is failing, and
            which Stripe workspace you are currently operating.
          </p>
        </div>

        <div className="pain-grid">
          {problemPoints.map((point) => (
            <article key={point} className="surface-card">
              <span className="surface-card__marker" />
              <p>{point}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-grid">
        <div className="section-head">
          <p className="eyebrow">The product</p>
          <h2>One extension, four commands, and a much cleaner founder loop.</h2>
          <p>
            Every screen is focused on a concrete job to be done, which is why
            Revcast feels fast instead of dashboard-like.
          </p>
        </div>

        <div className="feature-grid">
          {productFeatures.map((feature) => (
            <article key={feature.title} className="feature-card">
              <div
                className={`feature-card__badge ${
                  feature.tone === "danger" ? "feature-card__badge-danger" : ""
                }`}
              />
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-grid screenshot-section" id="screens">
        <div className="section-head">
          <p className="eyebrow">Inside the extension</p>
          <h2>Actual Revcast screens, shown one at a time.</h2>
          <p>
            The product should be easy to understand at a glance. This tighter
            walkthrough keeps one screen in focus while the description explains
            what that command is good at.
          </p>
        </div>

        <ScreenshotCarousel slides={screenshots} />
      </section>

      <section className="section workflow-section" id="workflow">
        <div className="section-head">
          <p className="eyebrow">The workflow</p>
          <h2>Built around the existing Raycast habit.</h2>
          <p>
            Revcast wins by staying close to the keyboard and only asking you
            to open Stripe when a deeper action is actually necessary.
          </p>
        </div>

        <div className="workflow-grid">
          {workflowSteps.map((step) => (
            <article key={step.step} className="workflow-card">
              <span className="workflow-card__step">{step.step}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section pricing-section" id="pricing">
        <div className="section-head">
          <p className="eyebrow">{pricingIntro.eyebrow}</p>
          <h2>{pricingIntro.title}</h2>
          <p>{pricingIntro.description}</p>
        </div>

        <div className="pricing-grid">
          {pricingPlans.map((plan) => {
            const isFeatured = "featured" in plan && Boolean(plan.featured);

            return (
              <article
                key={plan.name}
                className={`pricing-card ${isFeatured ? "pricing-card-featured" : ""}`}
              >
                <div className="pricing-card__top">
                  <div>
                    <p className="pricing-card__name">{plan.name}</p>
                    <h3>
                      {plan.price}
                      <span>{plan.cadence}</span>
                    </h3>
                  </div>
                  {isFeatured ? (
                    <span className="pricing-card__pill">Launch price</span>
                  ) : null}
                </div>

                <p className="pricing-card__description">{plan.description}</p>

                <ul className="feature-list">
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>

                {isPrelaunch ? (
                  <a
                    className={isFeatured ? "button button-primary" : "button button-secondary"}
                    href={waitlistHref(plan.waitlistInterest)}
                  >
                    {plan.ctaLabel}
                  </a>
                ) : plan.kind === "link" ? (
                  <a className="button button-secondary" href={siteConfig.installUrl}>
                    {plan.liveCtaLabel}
                  </a>
                ) : (
                  <CheckoutButton
                    featured={isFeatured}
                    label={plan.liveCtaLabel}
                    plan={plan.checkoutPlan}
                  />
                )}

                <p className="pricing-card__note">{plan.note}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section section-grid roadmap-section" id="roadmap">
        <div className="section-head">
          <p className="eyebrow">Roadmap</p>
          <h2>Planned improvements that increase value without turning Revcast into bloat.</h2>
          <p>
            These are the product upgrades I want to ship after launch. They are
            intentionally framed as planned work, not guaranteed dates or fake promises.
          </p>
        </div>

        <div className="roadmap-grid">
          {roadmapItems.map((item) => (
            <article key={item.title} className="roadmap-card">
              <span className="roadmap-card__pill">Planned</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section faq-section" id="faq">
        <div className="section-head">
          <p className="eyebrow">FAQ</p>
          <h2>Clear answers for how Revcast works and how this prelaunch is being handled.</h2>
        </div>

        <div className="faq-stack">
          {faqItems.map((item, index) => (
            <details key={item.question} className="faq-item" open={index === 0}>
              <summary>
                <span>{item.question}</span>
                <span className="faq-item__icon" aria-hidden="true">
                  +
                </span>
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="section final-cta">
        <div className="final-cta__panel">
          <p className="eyebrow">{finalCta.eyebrow}</p>
          <h2>{finalCta.title}</h2>
          <p>{finalCta.description}</p>

          <div className="button-row">
            <a className="button button-primary" href={waitlistHref()}>
              {finalCta.primaryLabel}
            </a>
            <a
              className="button button-secondary"
              href={`mailto:${siteConfig.supportEmail}`}
            >
              {finalCta.secondaryLabel}
            </a>
          </div>
        </div>
      </section>

      <section className="section contact-section" id="contact">
        <div className="contact-panel">
          <div className="contact-panel__copy">
            <p className="eyebrow">Contact</p>
            <h2>Questions, feedback, or launch support?</h2>
            <p>
              Revcast is built by Bharath for founders who want faster revenue
              visibility inside Raycast. Reach out directly through any of the
              channels below.
            </p>
          </div>

          <div className="contact-grid">
            {contactLinks.map((item) =>
              "href" in item ? (
                <a
                  key={item.label}
                  className="contact-card"
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                >
                  <span className="contact-card__label">{item.label}</span>
                  <strong>{item.value}</strong>
                  <p>{item.note}</p>
                </a>
              ) : (
                <article key={item.label} className="contact-card">
                  <span className="contact-card__label">{item.label}</span>
                  <strong>{item.value}</strong>
                  <p>{item.note}</p>
                </article>
              ),
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
