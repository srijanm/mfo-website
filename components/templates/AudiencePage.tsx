import { Button, Container, Section } from "@/components/foundation";
import { RecordSheet } from "@/components/graphics";
import { IncomingPaymentRecord } from "@/components/objects";
import { FaqSection } from "@/components/shared";
import { cx } from "@/lib/cx";
import { audienceQuestions, type Audience } from "@/lib/content/audiences";
import { recordSheets } from "@/lib/content/graphics";
import { conversionAssurance, enquiryHref, primaryCta } from "@/lib/content/navigation";
import { audienceClose } from "@/lib/content/standard-blocks";

import styles from "./AudiencePage.module.css";

type AudiencePageProps = {
  audience: Audience;
};

/**
 * One template for the three audience pages.
 *
 * Its job is narrow: does this firm understand *my* income and the work around
 * it? It used to answer that and then re-argue the whole proposition — the four
 * behaviour commitments, the three annual prices, a generic objection list and
 * an oversized closing panel, all of which are owned by the homepage, /pricing
 * and /how-we-work. Someone landing here cold still gets enough to act on, and
 * everything else is a sentence and a link.
 *
 * Five blocks: a specific hero, three recognisable situations, the work for
 * this audience, any questions particular to it, and a compact close.
 */
export function AudiencePage({ audience }: AudiencePageProps) {
  const sheet = audience.sheet ? recordSheets[audience.sheet] : null;
  const illustrated = Boolean(audience.record || sheet);
  const enquire = enquiryHref(audience.slug);
  /* Only what is particular to this audience: the general objections belong to
     the homepage and are not repeated here. */
  const questions = audienceQuestions(audience);

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
              {/* Quiet, because the fee is not this page's job to explain. */}
              <Button href="/pricing" tone="secondary" placement="hero">
                What it costs
              </Button>
            </div>
            <p className={styles.assurance}>{conversionAssurance}</p>
          </div>

          {/* Rendered only when there is something to render: the column does
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

      {/* Three situations someone recognises themselves in. */}
      <Section dense labelledBy="situation">
        <Container>
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

      {/* The work, for this audience, as a compact list. */}
      <Section dense labelledBy="scope">
        <Container>
          <div className={styles.scopeLayout}>
            <div className={styles.scopeIntro}>
              <h2 id="scope" className={cx("section-headline", styles.scopeHeadline)}>
                {audience.scope.title}
              </h2>
              {/* Stated once, and never omitted: no reviewed mapping of price to
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

      {/* Questions particular to this audience, if there are any. */}
      {questions.length > 0 ? (
        <FaqSection items={questions} headline={audienceClose.questionsHeadline} />
      ) : null}

      {/* A compact close: one statement about scope and fee, the enquiry, and
          links to the two pages that own the detail. No second sales section. */}
      <Section dense labelledBy="audience-close">
        <Container>
          <div className={styles.close}>
            <h2 id="audience-close" className={cx("section-headline", styles.closeHeadline)}>
              {audienceClose.headline}
            </h2>
            <p className={styles.closeBody}>{audienceClose.body}</p>
            <div className={styles.closeActions}>
              <Button href={enquire} placement="closing">
                {primaryCta.label}
              </Button>
              <Button href="/pricing" tone="secondary" placement="closing">
                {audienceClose.pricingLink}
              </Button>
              <Button href="/how-we-work" tone="secondary" placement="closing">
                {audienceClose.processLink}
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
