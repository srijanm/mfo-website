import { Button, Container, Grid, Section } from "@/components/foundation";
import { formatAnnualPrice, type PricingContent } from "@/lib/content/pricing";
import { approvedPlanScope } from "@/lib/content/pricing-scope";
import { primaryCta } from "@/lib/content/navigation";
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
 * on price. One ruled object: shared top rule, dividers between tiers, shared
 * closing rule.
 *
 * `approvedPlanScope` is null, so tiers are price-first with no plan names and
 * no inclusion claims. The comparison matrix is wired but never mounted in that
 * state, so revealing it later is a data change rather than a redesign.
 *
 * Every action here is a button. The three tier actions are outlined rather
 * than acid — three acid buttons in one viewport would break the rule in §10
 * that only one dominant acid call to action appears at a time, and all three
 * lead to the same place — and the section's own closing action is the acid
 * one, because that is the action the section is asking for.
 */
export function PricingSection({ content, id = "pricing" }: PricingSectionProps) {
  return (
    <Section id={id} labelledBy={content.headline ? `${id}-headline` : undefined}>
      <Container>
        <Grid>
          {content.headline ? (
            <h2 id={`${id}-headline`} className={cx("section-headline", styles.headline)}>
              {content.headline}
            </h2>
          ) : null}
          {content.intro ? <p className={styles.intro}>{content.intro}</p> : null}

          <ul className={cx("rule-grid", styles.tiers)}>
            {content.points.map((amount) => (
              <li key={amount}>
                <p className={`${styles.price} data-number`}>
                  {formatAnnualPrice(amount)}{" "}
                  <span className={styles.perYear}>{content.perYear}</span>
                </p>
                <p className={styles.planLabel}>{content.planLabel}</p>
                {/* A marked slot, not copy. It renders as a placeholder because
                    the tier's inclusions are exactly the thing CLAUDE.md rule 2
                    forbids writing without a reviewed mapping — so it has to be
                    impossible to mistake for finished text. */}
                <p
                  className={cx(
                    styles.scopeLine,
                    content.scopePlaceholder && styles.scopePlaceholder,
                  )}
                >
                  {content.scopeLine}
                </p>
                <div className={styles.action}>
                  <Button href={content.cta.href} tone="secondary">
                    {content.cta.label}
                  </Button>
                </div>
              </li>
            ))}
          </ul>

          {approvedPlanScope !== null ? (
            <div style={{ gridColumn: "1 / -1" }}>
              <PlanComparisonMatrix plans={approvedPlanScope} />
            </div>
          ) : null}

          <div className={styles.closing}>
            <p className={styles.closingText}>{content.closing}</p>

            <div className={styles.sectionAction}>
              <Button href={primaryCta.href}>{primaryCta.label}</Button>
            </div>
          </div>
        </Grid>
      </Container>
    </Section>
  );
}
