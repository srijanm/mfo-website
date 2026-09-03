import { Container, Grid, Section, TextLink } from "@/components/foundation";
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
 * Each tier's action is a text link rather than an acid button: three acid
 * buttons in one viewport would break the rule in §10 that only one dominant
 * acid call to action appears at a time, and all three lead to the same place.
 */
export function PricingSection({ content, id = "pricing" }: PricingSectionProps) {
  return (
    <Section id={id} labelledBy={content.headline ? `${id}-headline` : undefined}>
      <Container>
        <Grid>
          {content.headline ? (
            <h2 id={`${id}-headline`} className={styles.headline}>
              {content.headline}
            </h2>
          ) : null}
          {content.intro ? <p className={styles.intro}>{content.intro}</p> : null}

          <ul className={cx("rule-grid", styles.tiers)}>
            {content.points.map((amount) => (
              <li key={amount} className={styles.tier}>
                <p className={`${styles.price} data-number`}>
                  {formatAnnualPrice(amount)}{" "}
                  <span className={styles.perYear}>{content.perYear}</span>
                </p>
                <p className={styles.planLabel}>{content.planLabel}</p>
                <p className={styles.scopeLine}>{content.scopeLine}</p>
                <div className={styles.action}>
                  <TextLink href={content.cta.href}>{content.cta.label}</TextLink>
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
              <TextLink href={primaryCta.href}>{primaryCta.label}</TextLink>
            </div>
          </div>
        </Grid>
      </Container>
    </Section>
  );
}
