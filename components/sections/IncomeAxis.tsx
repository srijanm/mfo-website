"use client";

import { useEffect, useRef, useState } from "react";

import { Container, Grid, NodeAxis, Section, ThresholdNode } from "@/components/foundation";
import { DeadlineRecord } from "@/components/objects";
import { incomeAxis } from "@/lib/content/homepage";
import { factValue } from "@/lib/content/reviewed";
import { cx } from "@/lib/cx";

import styles from "./IncomeAxis.module.css";

type IncomeAxisProps = {
  /**
   * Tighter spacing, no lede, and never sticky. Used where the section is
   * reused inside a page that has already introduced the idea.
   */
  compact?: boolean;
};

/**
 * H05 — the Income Axis.
 *
 * There is one copy of the content, and it is ordinary HTML at every stage.
 * The sticky desktop composition is a CSS treatment of that same markup plus a
 * strip of empty scroll sentinels; nothing is duplicated, nothing is unmounted,
 * and no text exists only inside a canvas.
 *
 * The sticky behaviour applies only on desktop, only when the document is
 * scripted, and only when the visitor has not asked for reduced motion. In any
 * other case — mobile, no JavaScript, reduced motion, or the compact reuse —
 * this renders exactly the static vertical progression it always did.
 *
 * Scrolling only ever changes which milestone is marked active. It never moves
 * the page, never captures the wheel, and never takes focus.
 */
export function IncomeAxis({ compact = false }: IncomeAxisProps) {
  const { fieldLabels, milestones } = incomeAxis;
  const sticky = !compact;

  const [active, setActive] = useState(0);
  const sentinelsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sticky) return;

    const container = sentinelsRef.current;
    if (!container || typeof IntersectionObserver === "undefined") return;

    /* The sentinels are empty blocks whose only job is to be intersected. The
       last one to cross the midpoint of the viewport names the active
       milestone. */
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number((entry.target as HTMLElement).dataset.index);
          if (Number.isInteger(index)) setActive(index);
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );

    for (const child of container.children) observer.observe(child);
    return () => observer.disconnect();
  }, [sticky]);

  return (
    <Section dense={compact} labelledBy="income-axis" className={cx(sticky && styles.sticky)}>
      <Container>
        <Grid>
          <div className={styles.intro}>
            <h2 id="income-axis" className={styles.headline}>
              {incomeAxis.headline}
            </h2>
            {compact ? null : <p className={styles.lede}>{incomeAxis.intro}</p>}
          </div>
        </Grid>
      </Container>

      <div className={styles.scroller}>
        {/* Empty, aria-hidden, and display:none outside the sticky treatment. */}
        {sticky ? (
          <div ref={sentinelsRef} aria-hidden="true" className={styles.sentinels}>
            {milestones.map((milestone, index) => (
              <div key={milestone.id} data-index={index} className={styles.sentinel} />
            ))}
          </div>
        ) : null}

        <div className={styles.panel}>
          <Container className={styles.panelInner}>
            <ol className={cx(styles.list, compact && styles.listCompact)}>
              {milestones.map((milestone, index) => (
                <li
                  key={milestone.id}
                  className={cx(styles.milestone, index === active && styles.milestoneActive)}
                >
                  <div className={styles.rail}>
                    <ThresholdNode
                      className={styles.railNode}
                      orientation="vertical"
                      lineAfter={index < milestones.length - 1}
                    />
                  </div>

                  <div className={styles.body}>
                    <h3 className={styles.label}>{milestone.label}</h3>

                    <dl className={styles.fields}>
                      <div className={styles.field}>
                        <dt className={styles.fieldLabel}>{fieldLabels.question}</dt>
                        <dd className={styles.fieldValue}>{milestone.question}</dd>
                      </div>

                      {milestone.whatChanges ? (
                        <div className={styles.field}>
                          <dt className={styles.fieldLabel}>{fieldLabels.whatChanges}</dt>
                          <dd className={styles.fieldValue}>
                            {factValue(milestone.whatChanges)}
                          </dd>
                        </div>
                      ) : null}

                      <div className={styles.field}>
                        <dt className={styles.fieldLabel}>{fieldLabels.mfo}</dt>
                        <dd className={styles.fieldValue}>{milestone.mfo}</dd>
                      </div>
                    </dl>
                  </div>

                  {/* The right half of the sticky composition. It names the
                      milestone and states that MyFinanceOfficer is watching it.
                      No date, no threshold, no tax conclusion: the status is a
                      value from the approved union and the date row renders the
                      empty marker until a CA supplies one. */}
                  <div className={styles.record}>
                    <DeadlineRecord
                      what={milestone.label}
                      when={null}
                      status={milestone.tracking}
                    />
                  </div>
                </li>
              ))}
            </ol>
          </Container>

          {/* The full-width line and node axis, in the lower portion of the
              sticky panel. Decorative: every label it marks is in the list. */}
          {sticky ? (
            <Container>
              <NodeAxis
                className={styles.axis}
                stops={milestones.map((milestone) => ({
                  id: milestone.id,
                  label: milestone.label,
                }))}
                activeIndex={active}
              />
            </Container>
          ) : null}
        </div>
      </div>
    </Section>
  );
}
