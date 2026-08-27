import type { CSSProperties } from "react";

import { cx } from "@/lib/cx";
import { pricing, formatAnnualPrice } from "@/lib/content/pricing";
import type { PlanScope } from "@/lib/content/pricing-scope";
import { additionalSupport, coreScope } from "@/lib/content/site-content";

import styles from "./PlanComparisonMatrix.module.css";

type PlanComparisonMatrixProps = {
  /** Only ever passed a real, owner-approved mapping. */
  plans: PlanScope[];
};

/**
 * The plan-by-plan comparison.
 *
 * This exists so that populating `pricing-scope.ts` is the only work needed to
 * reveal it — no redesign, no new component. It is never rendered while
 * `approvedPlanScope` is null, which is the state today.
 *
 * Every name and every inclusion comes from the approved mapping. Nothing here
 * decides what a plan contains, and there is no recommendation badge.
 */
export function PlanComparisonMatrix({ plans }: PlanComparisonMatrixProps) {
  const areas = [...coreScope, ...additionalSupport];

  const columns = {
    gridTemplateColumns: `minmax(0, 1.2fr) repeat(${plans.length}, minmax(0, 1fr))`,
  } as CSSProperties;

  return (
    <div className={styles.matrix}>
      <div className={cx(styles.row, styles.headRow)} style={columns}>
        <p className={styles.heading}>{pricing.comparisonHeadings.area}</p>
        {plans.map((plan) => (
          <p key={plan.annualPrice} className={styles.heading}>
            {plan.displayName} · {formatAnnualPrice(plan.annualPrice)}
          </p>
        ))}
      </div>

      {areas.map((area) => (
        <div key={area.id} className={styles.row} style={columns}>
          <p className={styles.area}>{area.title}</p>
          {plans.map((plan) => {
            const included =
              plan.coreScopeIds.includes(area.id) ||
              plan.additionalSupportIds.includes(area.id);

            return (
              <p
                key={plan.annualPrice}
                className={cx(styles.cell, !included && styles.cellExcluded)}
              >
                {included
                  ? pricing.comparisonHeadings.included
                  : pricing.comparisonHeadings.notIncluded}
              </p>
            );
          })}
        </div>
      ))}
    </div>
  );
}
