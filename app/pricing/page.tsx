import type { Metadata } from "next";

import { Container, Section } from "@/components/foundation";
import { AdditionalFinancialSupport, CoreScopeMatrix } from "@/components/sections";
import { FaqSection, FinalCtaSection, PricingSection } from "@/components/shared";
import { homepageFaqHeadline } from "@/lib/content/homepage";
import { pricingPage } from "@/lib/content/pricing";
import { standardClose } from "@/lib/content/standard-blocks";
import { pageMetadata } from "@/lib/metadata";

import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Pricing",
  description: pricingPage.lead,
  path: "/pricing",
});

/**
 * The pricing page, in the order the final structure doc gives: hero, the
 * three tiers, what the fee covers (the same core scope rows the homepage
 * uses), how the scope gets agreed, and only after all of that the
 * additional-support framing — Layer B stays below pricing.
 *
 * The plan comparison lives inside PricingSection and stays unmounted while
 * `approvedPlanScope` is null, which is the state today. Populating that one
 * object reveals it on both pages at once.
 */
export default function PricingPage() {
  return (
    <>
      <section className={styles.hero} aria-labelledby="pricing-hero">
        <Container>
          <h1 id="pricing-hero" className={styles.title}>
            {pricingPage.headline}
          </h1>
          <p className={styles.lead}>{pricingPage.lead}</p>
        </Container>
      </section>

      <PricingSection content={pricingPage.tiers} />

      <CoreScopeMatrix
        label={pricingPage.feeCovers.label}
        headline={pricingPage.feeCovers.title}
        showAction={false}
      />

      <Section labelledBy="scope-agreed">
        <Container>
          <h2 id="scope-agreed" className="section-headline section-headline--wide">
            {pricingPage.scopeAgreed.title}
          </h2>
          <ol className={styles.steps}>
            {pricingPage.scopeAgreed.steps.map((step, index) => (
              <li key={step.id} className={styles.step}>
                <p className={`${styles.stepNumber} data-number`} aria-hidden="true">
                  {index + 1}
                </p>
                <div>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepBody}>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <AdditionalFinancialSupport />

      <FaqSection items={pricingPage.questions} headline={homepageFaqHeadline} />

      <FinalCtaSection content={standardClose} />
    </>
  );
}
