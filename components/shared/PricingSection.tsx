import { Button, Container, Section } from "@/components/foundation";
import { formatAnnualPrice, type PricingContent } from "@/lib/content/pricing";
import { approvedPlanScope } from "@/lib/content/pricing-scope";
import { conversionAssurance } from "@/lib/content/navigation";
import { cx } from "@/lib/cx";

import { PlanComparisonMatrix } from "./PlanComparisonMatrix";
import styles from "./PricingSection.module.css";

type PricingSectionProps = {
  /** Supplied by the page from lib/content. Never authored inline. */
  content: PricingContent;
  /** Stable hook for the positioning tests that assert what precedes pricing. */
  id?: string;
};

/**
 * The pricing system, shared by the homepage and every secondary page that ends
 * on price.

 * Three aligned price columns on the paper surface, divided by understated
 * rules rather than boxed as cards: the amount dominant, the period beside it
 * at a clearly subordinate size, and the plan label beneath.
 *
 * `approvedPlanScope` is null — there is no reviewed mapping of which annual
 * price includes which work — so the columns carry no inclusion claims. What
 * fills that space instead is the approved explanation that the applicable
 * price depends on scope, plus one shared action, rather than fabricated plan
 * distinctions. No "most popular" badge, no recommended tier, no saving claim,
 * no monthly equivalent, and no visual favouring of the middle column. The
 * comparison matrix below is wired but never mounted in that state, so
 * revealing it later is a data change rather than a redesign.
 */
export function PricingSection({ content, id = "pricing" }: PricingSectionProps) {
  return (
    <Section id={id} labelledBy={content.headline ? `${id}-headline` : undefined}>
      <Container>
        {/* Heading and explanation stay together as one block. */}
        {content.headline || content.intro ? (
          <div className={styles.intro}>
            {content.headline ? (
              <h2 id={`${id}-headline`} className={cx("section-headline", styles.headline)}>
                {content.headline}
              </h2>
            ) : null}
            {content.intro ? <p className={styles.introText}>{content.intro}</p> : null}
          </div>
        ) : null}

        <ul className={styles.tiers}>
          {content.points.map((amount) => (
            <li key={amount} className={styles.tier}>
              {/* The space between the amount and the period is a real space,
                  not a flex gap: a gap is not a word break, so the accessible
                  name read "₹19,999/ year". */}
              <p className={cx(styles.price, "data-number")}>
                {formatAnnualPrice(amount)}{" "}
                <span className={styles.perYear}>{content.perYear}</span>
              </p>
              <p className={styles.planLabel}>{content.planLabel}</p>
            </li>
          ))}
        </ul>

        {approvedPlanScope !== null ? (
          <PlanComparisonMatrix plans={approvedPlanScope} />
        ) : null}

        {/* What is knowable now, beside what follows from a person reading
            the enquiry. This is where a comparison table would go if there
            were an approved mapping; there is not, so the space explains the
            arrangement instead of dismissing the table. */}
        {content.knownNow && content.afterReview ? (
          <div className={styles.explain}>
            {[content.knownNow, content.afterReview].map((block) => (
              <section key={block.title} className={styles.explainBlock}>
                <h3 className={styles.explainTitle}>{block.title}</h3>
                <ul className={styles.explainList}>
                  {block.rows.map((row) => (
                    <li key={row.id} className={styles.explainRow}>
                      <p className={styles.explainRowTitle}>{row.title}</p>
                      <p className={styles.explainRowBody}>{row.body}</p>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ) : null}

        <div className={styles.closing}>
          <p className={styles.closingText}>{content.closing}</p>

          {/* One action. There were two adjacent buttons here — "Find the right
              plan" and the primary CTA — with different labels and the same
              destination, which reads as a choice and is not one. */}
          <div className={styles.actions}>
            <Button href={content.cta.href} placement="pricing">
              {content.cta.label}
            </Button>
            <p className={styles.assurance}>{conversionAssurance}</p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
