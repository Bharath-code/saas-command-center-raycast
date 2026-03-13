import { CheckoutButton } from "../components/CheckoutButton";
import {
  faqItems,
  navigation,
  pricingPlans,
  problemPoints,
  productFeatures,
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
    {
      "@type": "Offer",
      price: "29",
      priceCurrency: "USD",
      description: "Team plan",
    },
  ],
};

export default function HomePage() {
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
          <p className="eyebrow">For Stripe-powered indie SaaS founders</p>
          <h1>{siteConfig.headline}</h1>
          <p className="hero-lead">
            Revcast puts MRR, revenue, and failed-payment visibility inside Raycast, so you can
            check the number that matters before the next tab even loads.
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

            <p className="preview-footnote">Open Raycast. Type rev. Get the answer. Keep shipping.</p>
          </div>
        </div>
      </section>

      <section className="section section-grid" id="product">
        <div className="section-head">
          <p className="eyebrow">The problem</p>
          <h2>You do not need another dashboard for the same three questions.</h2>
          <p>
            Founders keep opening Stripe to check today&apos;s revenue, current MRR, and whether
            failed payments are slipping through. That workflow is heavier than the job.
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
          <h2>Revcast gives you the revenue check-in you actually need.</h2>
          <p>
            Clean enough for daily use. Focused enough to stay out of your way. Sharp enough to
            catch money problems before they compound.
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

      <section className="section workflow-section" id="workflow">
        <div className="section-head">
          <p className="eyebrow">The workflow</p>
          <h2>Built for the way founders already work.</h2>
          <p>Faster than opening Stripe. Cleaner than another dashboard. Good software should feel this obvious.</p>
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
          <h2>Start free. Upgrade when revenue visibility becomes mission-critical.</h2>
          <p>
            Every missed payment costs more than the upgrade. Global billing runs through Dodo
            Payments so checkout stays simple.
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
                  {isFeatured ? <span className="pricing-card__pill">Most focused</span> : null}
                </div>

                <p className="pricing-card__description">{plan.description}</p>

                <ul className="feature-list">
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>

                {plan.kind === "link" ? (
                  <a className="button button-secondary" href={siteConfig.installUrl}>
                    {plan.ctaLabel}
                  </a>
                ) : (
                  <CheckoutButton featured={isFeatured} label={plan.ctaLabel} plan={plan.plan} />
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className="section faq-section" id="faq">
        <div className="section-head">
          <p className="eyebrow">FAQ</p>
          <h2>Simple product. Honest answers.</h2>
        </div>

        <div className="faq-grid">
          {faqItems.map((item) => (
            <article key={item.question} className="faq-card">
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section final-cta">
        <div className="final-cta__panel">
          <p className="eyebrow">Stay in control</p>
          <h2>Stay close to revenue without living in dashboards.</h2>
          <p>
            Install Revcast free, then upgrade when you want a tighter command center for revenue
            ops.
          </p>

          <div className="button-row">
            <a className="button button-primary" href={siteConfig.installUrl}>
              Install Revcast
            </a>
            <a className="button button-secondary" href={`mailto:${siteConfig.supportEmail}`}>
              Talk to the founder
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
