import { Button, Container, Grid, Section } from "@/components/foundation";
import { IncomingPaymentRecord } from "@/components/objects";
import { FaqSection, FinalCtaSection } from "@/components/shared";
import { cx } from "@/lib/cx";
import type { Audience, AudienceRow } from "@/lib/content/audiences";
import { homepageFaqHeadline } from "@/lib/content/homepage";
import { formatAnnualPrice } from "@/lib/content/pricing";
import { howWeBehave, priceBlock, standardClose } from "@/lib/content/standard-blocks";

import styles from "./AudiencePage.module.css";

type AudiencePageProps = {
  audience: Audience;
};

/**
 * One template for the three audience pages, per the final structure doc:
 * hero · what's actually different here · what we run for you · how we
 * behave · price · questions · close. Every block after the hero renders
 * from the audience's own content or from the standard blocks, so the pages
 * differ by content, never by code.
 */

type RowListSectionProps = {
  id: string;
  label: string;
  title: string;
  rows: readonly AudienceRow[];
};

/**
 * The page's one repeating shape: a labelled section whose content is a
 * bounded list of title/body rows split on the 4/8 line.
 */
function RowListSection({ id, label, title, rows }: RowListSectionProps) {
  return (
    <Section dense labelledBy={id}>
      <Container>
        <p className="section-label">{label}</p>
        <h2 id={id} className="section-headline section-headline--wide">
          {title}
        </h2>
        <ul className={styles.rows}>
          {rows.map((row) => (
            <li key={row.id} className={styles.row}>
              <h3 className={styles.rowTitle}>{row.title}</h3>
              <p className={styles.rowBody}>{row.body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

export function AudiencePage({ audience }: AudiencePageProps) {
  const close = audience.closeHeadline
    ? { ...standardClose, headline: audience.closeHeadline }
    : standardClose;

  return (
    <>
      <section className={styles.hero} aria-labelledby="audience-headline">
        <Container>
          <Grid>
            <div className={styles.copy}>
              <h1 id="audience-headline" className={styles.headline}>
                {audience.hero.headline}
              </h1>
              <p className={styles.lead}>{audience.hero.lead}</p>
              <div className={styles.actions}>
                <Button href="/get-started">See what I need</Button>
                <Button href="/pricing" tone="secondary">
                  View pricing
                </Button>
              </div>
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

      <RowListSection
        id="situation"
        label={audience.situation.label}
        title={audience.situation.title}
        rows={audience.situation.rows}
      />

      <RowListSection
        id="scope"
        label={audience.scope.label}
        title={audience.scope.title}
        rows={audience.scope.rows}
      />

      <RowListSection
        id="behave"
        label={howWeBehave.label}
        title={howWeBehave.title}
        rows={howWeBehave.rows}
      />

      <Section labelledBy="price" dense>
        <Container>
          <h2 id="price" className="section-headline section-headline--wide">
            {priceBlock.title}
          </h2>
          <p className={cx("data-number", styles.prices)}>
            {priceBlock.points.map(formatAnnualPrice).join(" · ")}{" "}
            <span className={styles.perYear}>{priceBlock.perYear}</span>
          </p>
          <p className={styles.priceClosing}>{priceBlock.closing}</p>
          <div className={styles.priceAction}>
            <Button href={priceBlock.cta.href} tone="secondary">
              {priceBlock.cta.label}
            </Button>
          </div>
        </Container>
      </Section>

      <FaqSection items={audience.questions} headline={homepageFaqHeadline} />

      <FinalCtaSection content={close} />
    </>
  );
}
