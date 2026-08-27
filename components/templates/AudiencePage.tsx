import { Container, Grid, Section } from "@/components/foundation";
import { IncomingPaymentRecord } from "@/components/objects";
import { FaqSection, FinalCtaSection, PricingSection } from "@/components/shared";
import type { Audience } from "@/lib/content/audiences";
import { finalCta, homepageFaq } from "@/lib/content/homepage";
import { pricing } from "@/lib/content/pricing";
import { factValue } from "@/lib/content/reviewed";

import styles from "./AudiencePage.module.css";

type AudiencePageProps = {
  audience: Audience;
};

/**
 * One template for all four /who-its-for children. They share a structure —
 * hero, an optional information object, the page's topics, then pricing, FAQ
 * and the closing CTA — so they share a component and differ only by content.
 *
 * Topic bodies are reviewed content and currently null, so the template renders
 * the titles it has and omits bodies it does not. Nothing about how anyone is
 * taxed is written here.
 */
export function AudiencePage({ audience }: AudiencePageProps) {
  const writtenTopics = audience.sections.filter((section) => section.body !== null);

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
                  received={audience.record.received}
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

      <PricingSection content={pricing} />
      <FaqSection items={homepageFaq} />
      <FinalCtaSection content={finalCta} />
    </>
  );
}
