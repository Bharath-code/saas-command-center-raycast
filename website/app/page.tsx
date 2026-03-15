import Image from "next/image";

import emptyStateImage from "../../extensions/revcast/metadata/6-empty-state.png";
import failedPaymentsImage from "../../extensions/revcast/metadata/2-failed-payments.png";
import licenseImage from "../../extensions/revcast/metadata/5-license.png";
import onboardingImage from "../../extensions/revcast/metadata/4-onboarding.png";
import projectsImage from "../../extensions/revcast/metadata/3-projects.png";
import revenueSnapshotImage from "../../extensions/revcast/metadata/1-revenue-snapshot-action.png";
import { CheckoutButton } from "../components/CheckoutButton";
import {
  contactLinks,
  faqItems,
  navigation,
  pricingPlans,
  problemPoints,
  productFeatures,
  screenshotShowcase,
  siteConfig,
  trustSignals,
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
      price: "12",
      priceCurrency: "USD",
      description: "Pro plan",
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

        <a className="button button-secondary button-compact" href="#pricing">
          Unlock Pro
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
            <a className="button button-primary" href={siteConfig.installUrl}>
              Install free on Raycast
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
        </div>

        <div className="hero-preview" aria-label="Revcast product preview">
          <div className="preview-window">
            <div className="preview-window__header">
              <span />
              <span />
              <span />
            </div>

            <div className="command-bar">
              <span className="command-chip">cmd</span>
              <span className="command-chip">space</span>
              <span className="command-text">rev</span>
            </div>

            <div className="preview-caption">
              <span>Revenue Snapshot</span>
              <span>Example view</span>
            </div>

            <div className="metric-grid">
              <article className="metric-card">
                <span className="metric-label">MRR</span>
                <strong>$12,480</strong>
                <p>Normalized from active subscriptions.</p>
              </article>

              <article className="metric-card">
                <span className="metric-label">Today</span>
                <strong>$420</strong>
                <p>Revenue processed today.</p>
              </article>

              <article className="metric-card metric-card-positive">
                <span className="metric-label">New customers</span>
                <strong>7</strong>
                <p>Added in the current cycle.</p>
              </article>

              <article className="metric-card metric-card-danger">
                <span className="metric-label">Revenue at risk</span>
                <strong>$310</strong>
                <p>Failed payments worth follow-up.</p>
              </article>
            </div>

            <p className="preview-footnote">
              Open Raycast. Type rev. Get the answer. Keep shipping.
            </p>
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
          <h2>Real Raycast screens, not marketing mockups.</h2>
          <p>
            These are the actual flows founders use inside Revcast, from the
            first snapshot to onboarding, project switching, failed payment
            follow-up, and license management.
          </p>
        </div>

        <div className="showcase-grid">
          {screenshots.map((shot) => (
            <article key={shot.title} className="showcase-card">
              <div className="showcase-card__meta">
                <span className="showcase-card__command">{shot.command}</span>
                <span className="showcase-card__label">{shot.title}</span>
              </div>

              <div className="showcase-card__media">
                <Image
                  src={shot.image}
                  alt={shot.alt}
                  className="showcase-card__image"
                  sizes="(max-width: 1080px) 100vw, 50vw"
                />
              </div>

              <div className="showcase-card__copy">
                <h3>{shot.title}</h3>
                <p>{shot.description}</p>
              </div>
            </article>
          ))}
        </div>
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
          <p className="eyebrow">Pricing</p>
          <h2>Start free, then unlock Pro when one workspace stops being enough.</h2>
          <p>
            The free plan covers the core founder workflow. Pro adds unlimited
            local Stripe projects plus the full license and billing experience
            for operators who manage more than one business context.
          </p>
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
                    <span className="pricing-card__pill">Most focused</span>
                  ) : null}
                </div>

                <p className="pricing-card__description">{plan.description}</p>

                <ul className="feature-list">
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>

                {plan.kind === "link" ? (
                  <a
                    className="button button-secondary"
                    href={siteConfig.installUrl}
                  >
                    {plan.ctaLabel}
                  </a>
                ) : (
                  <CheckoutButton
                    featured={isFeatured}
                    label={plan.ctaLabel}
                    plan={plan.plan}
                  />
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className="section faq-section" id="faq">
        <div className="section-head">
          <p className="eyebrow">FAQ</p>
          <h2>Clear answers for how Revcast actually works.</h2>
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
          <p className="eyebrow">Stay in control</p>
          <h2>Keep Stripe one command away, not one more tab away.</h2>
          <p>
            Install Revcast free, connect a project or start in demo mode, and
            upgrade to Pro when you want unlimited workspaces on this device.
          </p>

          <div className="button-row">
            <a className="button button-primary" href={siteConfig.installUrl}>
              Install Revcast
            </a>
            <a
              className="button button-secondary"
              href={`mailto:${siteConfig.supportEmail}`}
            >
              Email Bharath
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
