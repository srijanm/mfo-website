import { Container, Grid, Section } from "@/components/foundation";
import { IncomingPaymentRecord } from "@/components/objects";
import {
  AdditionalFinancialSupport,
  CoreScopeMatrix,
  IncomeAxis,
  TemporalLedger,
} from "@/components/sections";
import { FaqSection, FinalCtaSection, PricingSection } from "@/components/shared";
import { cx } from "@/lib/cx";
import type { Audience, AudienceBlock } from "@/lib/content/audiences";
import { faqByIds, finalCta } from "@/lib/content/homepage";
import { pricingPage } from "@/lib/content/pricing";
import { factValue } from "@/lib/content/reviewed";

import styles from "./AudiencePage.module.css";

type AudiencePageProps = {
  audience: Audience;
};

/**
 * One template for all four /who-its-for children.
 *
 * Each page's body is a list of shared blocks in the order its spec names
 * them, so the pages differ by content and sequence rather than by code. Every
 * block renders copy that already exists elsewhere on the site, which means an
 * audience page cannot assert anything the homepage does not.
 *
 * Layer B appears only where a spec asks for it, and only at the position it
 * asks for — on the foreign-income page that is after the core scope and after
 * the topic questions, never before.
 */
export function AudiencePage({ audience }: AudiencePageProps) {
  const writtenTopics = audience.sections.filter((section) => section.body !== null);

  const renderBlock = (block: AudienceBlock) => {
    switch (block) {
      case "checklist":
        return audience.checklist ? (
          <Section key={block} labelledBy="checklist">
            <Container>
              <div
                className={cx("rule-grid", "rule-grid--4-8", styles.checklistSplit)}
              >
                <h2 id="checklist" className={styles.checklistTitle}>
                  {audience.checklist.title}
                </h2>
                <ul className={cx("rule-grid-flush", styles.checklist)}>
                  {audience.checklist.items.map((item) => (
                    <li key={item} className={styles.checklistItem}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Container>
          </Section>
        ) : null;

      case "core-scope":
        return <CoreScopeMatrix key={block} />;

      case "calendar":
        return <TemporalLedger key={block} />;

      case "axis":
        return <IncomeAxis key={block} compact />;

      case "topic-faq":
        return audience.topicFaq ? (
          <FaqSection
            key={block}
            headline={audience.topicFaq.title}
            items={faqByIds(audience.topicFaq.ids)}
          />
        ) : null;

      case "additional-support":
        return <AdditionalFinancialSupport key={block} />;
    }
  };

  return (
    <>
      <section className={styles.hero} aria-labelledby="audience-headline">
        <Container>
          <Grid>
            <div className={styles.copy}>
              <h1 id="audience-headline" className={styles.headline}>
                {audience.headline}
              </h1>
              {audience.lead ? <p className={styles.lead}>{audience.lead}</p> : null}
            </div>

            {audience.record ? (
              <div className={styles.record}>
                <IncomingPaymentRecord
                  amount={audience.record.amount}
                  from={audience.record.from}
                  received={audience.record.received()}
                  into={audience.record.into}
                  frequency={audience.record.frequency}
                  indianPayroll={audience.record.indianPayroll}
                  indiaSideSetup={audience.record.indiaSideSetup}
                  note={audience.record.note}
                />
              </div>
            ) : null}
          </Grid>
        </Container>
      </section>

      {writtenTopics.length > 0 ? (
        <Section>
          <Container>
            <Grid>
              <ul className={styles.topics}>
                {writtenTopics.map((section) => (
                  <li key={section.id} className={styles.topic}>
                    <h2 className={styles.topicTitle}>{section.title}</h2>
                    <p className={styles.topicBody}>{factValue(section.body!)}</p>
                  </li>
                ))}
              </ul>
            </Grid>
          </Container>
        </Section>
      ) : null}

      {audience.blocks.map(renderBlock)}

      <PricingSection content={pricingPage.tiers} />

      <FaqSection items={faqByIds(audience.generalFaqIds)} />

      <FinalCtaSection content={finalCta} />
    </>
  );
}
