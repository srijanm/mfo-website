import type { Metadata } from "next";

import { Container, Grid } from "@/components/foundation";
import { AdditionalFinancialSupport, CoreScopeMatrix } from "@/components/sections";
import { FaqSection, FinalCtaSection, PricingSection } from "@/components/shared";
import { faqByIds, finalCta } from "@/lib/content/homepage";
import { pricing, pricingPage } from "@/lib/content/pricing";
import { cx } from "@/lib/cx";
import { pageMetadata } from "@/lib/metadata";

import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Pricing",
  description: pricingPage.lead,
  path: "/pricing",
});

/**
 * The pricing page.
 *
 * Assembled from the same components the homepage uses, so the three price
 * points, the core scope and the additional-support framing cannot drift
 * between the two pages.
 *
 * The plan comparison lives inside PricingSection and stays unmounted while
 * `approvedPlanScope` is null, which is the state today. Populating that one
 * object reveals it on both pages at once.
 *
 * The FAQ selects the pricing objections from the approved question set rather
 * than introducing new copy, and the closing CTA reuses the approved final-CTA
 * wording with the label §22 names for this page.
 */
export default function PricingPage() {
  return (
    <>
      <section className={styles.hero} aria-labelledby="pricing-hero">
        <Container>
          <Grid>
            <div className={styles.heroTitle}>
              <h1 id="pricing-hero" className={styles.title}>
                {pricingPage.headline}
              </h1>
            </div>
            <p className={cx(styles.heroLead, styles.lead)}>{pricingPage.lead}</p>
          </Grid>
        </Container>
      </section>

      <PricingSection content={pricingPage.tiers} />

      <CoreScopeMatrix />

      <AdditionalFinancialSupport />

      <FaqSection items={faqByIds(pricingPage.faqIds)} />

      <FinalCtaSection content={{ ...finalCta, cta: pricing.cta }} />
    </>
  );
}
