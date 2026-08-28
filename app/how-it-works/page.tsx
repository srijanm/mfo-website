import type { Metadata } from "next";

import { Container, Grid, Section, ThresholdNode } from "@/components/foundation";
import { FilingRecord } from "@/components/objects";
import { IncomeAxis, TemporalLedger } from "@/components/sections";
import { FinalCtaSection, PricingSection } from "@/components/shared";
import { finalCta } from "@/lib/content/homepage";
import { howItWorks } from "@/lib/content/how-it-works";
import { pageMetadata } from "@/lib/metadata";
import { pricingPage } from "@/lib/content/pricing";

import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata({
  title: "How it works",
  description: howItWorks.lead,
  path: "/how-it-works",
});

/**
 * The six sections from SECONDARY_PAGE_SPECS.md, assembled almost entirely
 * from parts that already exist: the temporal ledger, the filing record, the
 * income axis in its compact form, and the shared pricing and CTA sections.
 *
 * Only the first two sections are new, and both are structure rather than
 * copy — the spec supplies their words.
 */
export default function HowItWorksPage() {
  return (
    <>
      <section className={styles.hero} aria-labelledby="how-it-works">
        <Container>
          <Grid>
            <div className={styles.heroCopy}>
              <h1 id="how-it-works" className={styles.title}>
                {howItWorks.headline}
              </h1>
              <p className={styles.lead}>{howItWorks.lead}</p>
            </div>
          </Grid>
        </Container>
      </section>

      {/* 1 — Start */}
      <Section labelledBy="start">
        <Container>
          <Grid>
            <h2 id="start" className={styles.sectionTitle}>
              {howItWorks.start.title}
            </h2>
            <div className={styles.exchange}>
              <p className={styles.exchangeCell}>{howItWorks.start.you}</p>
              <p className={styles.exchangeCell}>{howItWorks.start.us}</p>
            </div>
          </Grid>
        </Container>
      </Section>

      {/* 2 — Set up */}
      <Section labelledBy="set-up">
        <Container>
          <Grid>
            <h2 id="set-up" className={styles.sectionTitle}>
              {howItWorks.setUp.title}
            </h2>
            <ol className={styles.steps}>
              {/* Every step carries both segments so its node centres on its own
                  label. With only a trailing segment the first node rides to the
                  top of its row and the last to the bottom. */}
              {howItWorks.setUp.steps.map((step) => (
                <li key={step} className={styles.step}>
                  <span className={styles.stepRail}>
                    <ThresholdNode
                      className={styles.stepNode}
                      orientation="vertical"
                      lineBefore
                      lineAfter
                    />
                  </span>
                  <p className={styles.stepLabel}>{step}</p>
                </li>
              ))}
            </ol>
          </Grid>
        </Container>
      </Section>

      {/* 3 — Run the year */}
      <TemporalLedger />

      {/* 4 — Before filing */}
      <Section labelledBy="before-filing">
        <Container>
          <Grid>
            <h2 id="before-filing" className={styles.sectionTitle}>
              {howItWorks.beforeFiling.title}
            </h2>
            <div className={styles.filing}>
              <p className={styles.filingLead}>{howItWorks.beforeFiling.lead}</p>
              <FilingRecord status={howItWorks.beforeFiling.status} />
            </div>
          </Grid>
        </Container>
      </Section>

      {/* 5 — When something changes */}
      <IncomeAxis compact />

      {/* 6 — Pricing */}
      <PricingSection content={pricingPage.tiers} />

      <FinalCtaSection content={finalCta} />
    </>
  );
}
