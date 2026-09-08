import { Button, Container, Section } from "@/components/foundation";
import { RecordSheet } from "@/components/graphics";
import { IncomingPaymentRecord } from "@/components/objects";
import { FaqSection, FinalCtaSection } from "@/components/shared";
import { cx } from "@/lib/cx";
import type { Audience } from "@/lib/content/audiences";
import { recordSheets } from "@/lib/content/graphics";
import { homepageFaqHeadline } from "@/lib/content/homepage";
import { conversionAssurance, enquiryHref, primaryCta } from "@/lib/content/navigation";
import { formatAnnualPrice } from "@/lib/content/pricing";
import { howWeBehave, priceBlock, standardClose } from "@/lib/content/standard-blocks";

import styles from "./AudiencePage.module.css";

type AudiencePageProps = {
  audience: Audience;
};

/**
 * One template for the three audience pages.
 *
 * Two things were wrong with it. The hero reserved five columns for an
 * illustration whether or not one existed, so the freelancers and creators
 * pages had a headline squeezed into seven columns beside nothing at all. And
 * everything below the hero was the same shape — three consecutive lists of
 * large title/body rows, which made a specific page read as a generic one.
 *
 * Now: a hero that has two deliberate layouts and never reserves an empty
 * column, then four visually distinct blocks — situations, the work, a compact
 * accountability strip, and price context.
 *
 * The enquiry link carries which page it was pressed on, as context for the
 * person who reads it. It is never treated as an answer: nothing here infers
 * how somebody is paid from the page they happened to be on.
 */
export function AudiencePage({ audience }: AudiencePageProps) {
  const close = audience.closeHeadline
    ? { ...standardClose, headline: audience.closeHeadline }
    : standardClose;

  const sheet = audience.sheet ? recordSheets[audience.sheet] : null;
  const illustrated = Boolean(audience.record || sheet);
  const enquire = enquiryHref(audience.slug);

  return (
    <>
      <section
        className={cx(styles.hero, illustrated ? styles.heroIllustrated : styles.heroTextLed)}
        aria-labelledby="audience-headline"
      >
        <Container className={styles.heroInner}>
          <div className={styles.copy}>
            <h1 id="audience-headline" className={styles.headline}>
              {audience.hero.headline}
            </h1>
            <p className={styles.lead}>{audience.hero.lead}</p>
            <div className={styles.actions}>
              <Button href={enquire} placement="hero">
                {primaryCta.label}
              </Button>
              <Button href="/pricing" tone="secondary" placement="hero">
                View pricing
              </Button>
            </div>
            <p className={styles.assurance}>{conversionAssurance}</p>
          </div>

          {/* Rendered only when there is something to render. The column does
              not exist otherwise, rather than existing and standing empty. */}
          {audience.record ? (
            <div className={styles.graphic}>
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
          ) : sheet ? (
            <div className={styles.graphic}>
              <RecordSheet sheet={sheet} />
            </div>
          ) : null}
        </Container>
      </section>

      {/* 1. The situations someone recognises themselves in. */}
      <Section dense labelledBy="situation">
        <Container>
          <p className="section-label">{audience.situation.label}</p>
          <h2 id="situation" className="section-headline section-headline--wide">
            {audience.situation.title}
          </h2>
          <ol className={styles.situations}>
            {audience.situation.rows.map((row) => (
              <li key={row.id} className={styles.situation}>
                <h3 className={styles.situationTitle}>{row.title}</h3>
                <p className={styles.situationBody}>{row.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* 2. The work, as a compact two-column list rather than a third
             identical stack of large rows. */}
      <Section dense labelledBy="scope">
        <Container>
          <div className={styles.scopeLayout}>
            <div className={styles.scopeIntro}>
              <p className="section-label">{audience.scope.label}</p>
              <h2 id="scope" className={cx("section-headline", styles.scopeHeadline)}>
                {audience.scope.title}
              </h2>
              {/* The qualification, never omitted: no mapping of price to
                  inclusions exists, so nothing here may read as one. */}
              <p className={styles.scopeNote}>{audience.scope.note}</p>
            </div>

            <ul className={styles.scopeList}>
              {audience.scope.rows.map((row) => (
                <li key={row.id} className={styles.scopeRow}>
                  <h3 className={styles.scopeRowTitle}>{row.title}</h3>
                  <p className={styles.scopeRowBody}>{row.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* 3. Accountability, compacted into a strip. */}
      <Section dense labelledBy="behave">
        <Container>
          <p className="section-label">{howWeBehave.label}</p>
          <h2 id="behave" className="section-headline section-headline--wide">
            {howWeBehave.title}
          </h2>
          <ul className={styles.proof}>
            {howWeBehave.rows.map((row) => (
              <li key={row.id} className={styles.proofItem}>
                <h3 className={styles.proofTitle}>{row.title}</h3>
                <p className={styles.proofBody}>{row.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* 4. Price context, and the route to the full explanation. */}
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
            <Button href={priceBlock.cta.href} tone="secondary" placement="pricing">
              {priceBlock.cta.label}
            </Button>
          </div>
        </Container>
      </Section>

      <FaqSection items={audience.questions} headline={homepageFaqHeadline} />

      <FinalCtaSection content={close} enquiryHref={enquire} />
    </>
  );
}
