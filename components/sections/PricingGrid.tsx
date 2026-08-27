import { Container, Grid, Section, TextLink } from "@/components/foundation";
import { formatAnnualPrice, pricing } from "@/lib/content/pricing";
import { approvedPlanScope } from "@/lib/content/pricing-scope";

import { PlanComparisonMatrix } from "./PlanComparisonMatrix";
import styles from "./PricingGrid.module.css";

/**
 * H10 — pricing.
 *
 * `approvedPlanScope` is null, so this renders price-first tiers: no plan
 * names, no inclusions and no claim about which tier contains what. The
 * comparison matrix is wired up but never mounted until a real mapping exists,
 * so revealing it later is a data change rather than a redesign.
 *
 * Each tier's action is a text link rather than an acid button. Three acid
 * buttons in one viewport would break the rule in §10 that only one dominant
 * acid call to action appears at a time, and all three lead to the same place.
 */
export function PricingGrid() {
  return (
    <Section labelledBy="pricing">
      <Container>
        <Grid>
          <h2 id="pricing" className={styles.headline}>
            {pricing.headline}
          </h2>
          <p className={styles.intro}>{pricing.intro}</p>

          <ul className={styles.tiers}>
            {pricing.points.map((amount) => (
              <li key={amount} className={styles.tier}>
                <p className={`${styles.price} data-number`}>
                  {formatAnnualPrice(amount)} <span className={styles.perYear}>{pricing.perYear}</span>
                </p>
                <p className={styles.planLabel}>{pricing.planLabel}</p>
                <p className={styles.scopeLine}>{pricing.scopeLine}</p>
                <div className={styles.action}>
                  <TextLink href={pricing.cta.href}>{pricing.cta.label}</TextLink>
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
            <p className={styles.closingText}>{pricing.closing}</p>
          </div>
        </Grid>
      </Container>
    </Section>
  );
}
