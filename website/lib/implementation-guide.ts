/**
 * Implementation Guide: Landing Page Conversion Optimization
 * 
 * This file contains the actual code changes needed to implement
 * the optimized content from content-optimized.ts
 */

// ============================================================================
// STEP 1: Update website/lib/content.ts
// ============================================================================

// Replace the ENTIRE content.ts file with content-optimized.ts
// OR merge the changes manually:

/*
1. Update siteConfig to add:
   - userCount: "47"
   - mrrRecovered: "$12,450"
   - rating: "5.0"

2. Update trustSignals to:
   export const trustSignals = [
     "Used by 47+ SaaS founders",
     "Works with Stripe",
     "$12K+ revenue recovered",
     "5-minute setup",
   ] as const;

3. Add socialProof section AFTER trustSignals:
   export const socialProof = { ... } // from content-optimized.ts

4. Update problemPoints to be more specific (from content-optimized.ts)

5. Update productFeatures to include benefit field

6. Update pricingPlans with 3 tiers (Starter, Pro, Lifetime)

7. Replace faqItems with expanded version (9 questions)

8. Add new exports:
   - roiCalculator
   - exitIntent
   - footerTrust
   - postPurchaseEmails
   - launchAnnouncement
*/

// ============================================================================
// STEP 2: Update website/app/page.tsx
// ============================================================================

// Add these NEW SECTIONS to the HomePage component:

/*
// ADD AFTER HERO SECTION, BEFORE #product section:

<section className="section social-proof-section" id="social-proof">
  <div className="section-head">
    <p className="eyebrow">Social Proof</p>
    <h2>{socialProof.sectionTitle}</h2>
    <p>{socialProof.sectionSubtitle}</p>
  </div>

  <div className="testimonial-grid">
    {socialProof.testimonials.map((testimonial, index) => (
      <article key={index} className="testimonial-card">
        <blockquote>
          "{testimonial.quote}"
        </blockquote>
        <div className="testimonial-author">
          <div className="author-info">
            <strong>{testimonial.author}</strong>
            <span>{testimonial.role}</span>
          </div>
          <span className="author-mrr">{testimonial.mrr}</span>
        </div>
      </article>
    ))}
  </div>
</section>

// ADD BEFORE pricing section:

<section className="section roi-section" id="roi">
  <div className="section-head">
    <p className="eyebrow">ROI Calculator</p>
    <h2>{roiCalculator.sectionTitle}</h2>
    <p>{roiCalculator.sectionSubtitle}</p>
  </div>

  <div className="roi-calculator">
    {roiCalculator.rows.map((row, index) => (
      <div 
        key={index} 
        className={`roi-row ${row.highlight ? 'roi-row-highlight' : ''}`}
      >
        <span className="roi-label">{row.label}</span>
        <span className="roi-value">{row.value}</span>
        <span className="roi-calculation">{row.calculation}</span>
      </div>
    ))}
    
    <a className="button button-primary" href="#pricing">
      {roiCalculator.cta}
    </a>
  </div>
</section>
*/

// ============================================================================
// STEP 3: Add Exit-Intent Popup Component
// ============================================================================

// CREATE NEW FILE: website/components/ExitIntentPopup.tsx

/*
'use client';

import { useEffect, useState } from 'react';

export function ExitIntentPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !showPopup && !submitted) {
        setShowPopup(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [showPopup, submitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add to email list (ConvertKit, Beehiiv, etc.)
    setSubmitted(true);
  };

  if (!showPopup || submitted) return null;

  return (
    <div className="exit-intent-overlay">
      <div className="exit-intent-popup">
        <button 
          className="exit-intent-close"
          onClick={() => setShowPopup(false)}
        >
          ×
        </button>
        
        <div className="exit-intent-content">
          <p className="eyebrow">Free Resource</p>
          <h2>{exitIntent.title}</h2>
          <p>{exitIntent.subtitle}</p>
          <p className="exit-intent-description">
            {exitIntent.description}
          </p>

          <form onSubmit={handleSubmit} className="exit-intent-form">
            <input
              type="email"
              placeholder={exitIntent.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="exit-intent-input"
            />
            <button type="submit" className="button button-primary">
              {exitIntent.ctaLabel}
            </button>
          </form>

          <button
            className="exit-intent-no-thanks"
            onClick={() => setShowPopup(false)}
          >
            {exitIntent.noThanksLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
*/

// ============================================================================
// STEP 4: Add CSS for New Sections
// ============================================================================

// ADD TO website/app/globals.css:

/*
// Social Proof Section
.social-proof-section {
  background: linear-gradient(180deg, transparent, rgba(91, 91, 214, 0.04));
  border-radius: var(--radius-xl);
  padding: 60px 40px;
}

.testimonial-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
  margin-top: 40px;
}

.testimonial-card {
  padding: 32px;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: var(--surface);
  box-shadow: var(--shadow-md);
}

.testimonial-card blockquote {
  margin: 0 0 24px;
  color: var(--ink);
  font-size: 1.05rem;
  line-height: 1.7;
  font-style: italic;
}

.testimonial-author {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid var(--line);
}

.author-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.author-info strong {
  color: var(--ink);
  font-size: 0.95rem;
}

.author-info span {
  color: var(--muted);
  font-size: 0.85rem;
}

.author-mrr {
  padding: 6px 12px;
  border-radius: 999px;
  background: var(--accent-soft);
  color: var(--accent-strong);
  font-size: 0.82rem;
  font-weight: 600;
}

// ROI Calculator
.roi-section {
  background: linear-gradient(160deg, var(--accent-soft), transparent);
  border-radius: var(--radius-xl);
  padding: 60px 40px;
}

.roi-calculator {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 40px;
  padding: 32px;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: var(--surface);
}

.roi-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 20px;
  padding: 16px 20px;
  border-radius: 12px;
  align-items: center;
}

.roi-row-highlight {
  background: linear-gradient(160deg, var(--success-soft), transparent);
  border: 1px solid var(--success);
}

.roi-label {
  color: var(--muted);
  font-size: 0.95rem;
}

.roi-value {
  color: var(--ink);
  font-weight: 600;
  font-size: 1.1rem;
}

.roi-calculation {
  color: var(--muted);
  font-size: 0.85rem;
  font-family: var(--font-mono), monospace;
}

// Exit Intent Popup
.exit-intent-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(15, 23, 42, 0.72);
  backdrop-filter: blur(4px);
  display: grid;
  place-items: center;
  animation: fadeIn 200ms ease;
}

.exit-intent-popup {
  position: relative;
  width: min(520px, calc(100vw - 40px));
  padding: 40px;
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);
  background: var(--canvas-strong);
  box-shadow: var(--shadow-lg);
  animation: slideUp 300ms ease;
}

.exit-intent-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 999px;
  background: transparent;
  color: var(--muted);
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  transition: all 160ms ease;
}

.exit-intent-close:hover {
  background: var(--line);
  color: var(--ink);
}

.exit-intent-content {
  text-align: center;
}

.exit-intent-description {
  margin: 16px 0 24px;
  color: var(--muted);
  font-size: 1.05rem;
  line-height: 1.7;
}

.exit-intent-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 24px 0 16px;
}

.exit-intent-input {
  width: 100%;
  padding: 14px 18px;
  border: 1px solid var(--line);
  border-radius: 12px;
  font-size: 1rem;
  background: var(--canvas-strong);
}

.exit-intent-no-thanks {
  margin-top: 16px;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--muted);
  font-size: 0.9rem;
  cursor: pointer;
  text-decoration: underline;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Responsive adjustments
@media (max-width: 1080px) {
  .testimonial-grid,
  .roi-row {
    grid-template-columns: 1fr;
  }
  
  .roi-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .roi-calculation {
    font-size: 0.8rem;
  }
}

@media (max-width: 640px) {
  .social-proof-section,
  .roi-section {
    padding: 40px 24px;
  }
  
  .exit-intent-popup {
    padding: 32px 24px;
  }
}
*/

// ============================================================================
// STEP 5: Add Analytics Tracking (PostHog)
// ============================================================================

// CREATE NEW FILE: website/lib/analytics.ts

/*
// PostHog Analytics Setup
// Install: npm install posthog-js

import posthog from 'posthog-js';

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    capture_pageview: true,
  });
}

export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    posthog.capture(eventName, properties);
  }
}

export function identifyUser(userId: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    posthog.identify(userId, properties);
  }
}
*/

// ADD TO website/app/layout.tsx:

/*
// Add PostHog provider wrapper
import { PostHogProvider } from './PostHogProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}
*/

// CREATE NEW FILE: website/app/PostHogProvider.tsx

/*
'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect } from 'react';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      capture_pageview: true,
    });
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
*/

// ADD TO .env.example:

/*
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_project_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
*/

// ============================================================================
// STEP 6: Track Conversions
// ============================================================================

// ADD TO website/app/page.tsx:

/*
// Import analytics
import { trackEvent } from '../lib/analytics';

// Add to CTA buttons:

<a 
  className="button button-primary" 
  href={siteConfig.installUrl}
  onClick={() => trackEvent('clicked_install_cta', {
    location: 'hero',
    timestamp: new Date().toISOString(),
  })}
>
  Install free on Raycast
</a>

// Add to pricing CTA:

<CheckoutButton
  featured={isFeatured}
  label={plan.ctaLabel}
  plan={plan.plan}
  onCheckoutClick={() => trackEvent('started_checkout', {
    plan: plan.plan,
    price: plan.price,
  })}
/>
*/

// ============================================================================
// STEP 7: Add Trust Badges to Footer
// ============================================================================

// ADD BEFORE </main> in website/app/page.tsx:

/*
<footer className="site-footer">
  <div className="footer-grid">
    <div className="footer-section">
      <h4>Security</h4>
      <ul>
        {footerTrust.security.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
    
    <div className="footer-section">
      <h4>Support</h4>
      <ul>
        {footerTrust.support.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
    
    <div className="footer-section">
      <h4>Company</h4>
      <ul>
        <li><a href="/privacy">Privacy Policy</a></li>
        <li><a href="/terms">Terms of Service</a></li>
        <li><a href={`mailto:${siteConfig.supportEmail}`}>Contact</a></li>
      </ul>
    </div>
  </div>
  
  <div className="footer-bottom">
    <p>© {new Date().getFullYear()} Revcast. Built by founders, for founders.</p>
  </div>
</footer>
*/

// ADD TO globals.css:

/*
.site-footer {
  margin-top: 80px;
  padding: 60px 0 40px;
  border-top: 1px solid var(--line);
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 40px;
  margin-bottom: 40px;
}

.footer-section h4 {
  margin: 0 0 16px;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--ink);
}

.footer-section ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-section li {
  color: var(--muted);
  font-size: 0.92rem;
  line-height: 1.6;
}

.footer-section a {
  color: var(--muted);
  transition: color 160ms ease;
}

.footer-section a:hover {
  color: var(--accent-strong);
}

.footer-bottom {
  padding-top: 40px;
  border-top: 1px solid var(--line);
  color: var(--muted);
  font-size: 0.9rem;
  text-align: center;
}

@media (max-width: 640px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}
*/

// ============================================================================
// IMPLEMENTATION CHECKLIST
// ============================================================================

/*
Before Launch:
□ Update content.ts with optimized copy
□ Add social proof section to page.tsx
□ Add ROI calculator section
□ Implement exit-intent popup
□ Add PostHog analytics
□ Set up conversion tracking
□ Add footer with trust badges
□ Test all CTAs and links
□ Add testimonial images (when available)
□ Set up email capture integration

After Launch:
□ Monitor analytics daily
□ A/B test headlines
□ Iterate on pricing copy based on conversion
□ Add more testimonials as received
□ Update user count and MRR recovered monthly
□ Track exit-intent conversion rate
*/
