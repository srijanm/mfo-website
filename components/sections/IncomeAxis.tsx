import { Container, Grid, Section, ThresholdNode } from "@/components/foundation";
import { incomeAxis } from "@/lib/content/homepage";
import { factValue } from "@/lib/content/reviewed";

import styles from "./IncomeAxis.module.css";

/**
 * H05 — the Income Axis, static.
 *
 * A vertical progression of the five default milestones, every part of it
 * ordinary HTML. §17 makes this the mobile and reduced-motion presentation, so
 * it is built to stand alone rather than as a fallback for something else.
 *
 * No milestone is marked active: there is no current state to represent, and
 * filling a node acid would assert one. Nodes stay hollow until the interactive
 * pass gives the state a meaning.
 *
 * Nothing here is numeric. The rail column sizes to the node and the copy
 * column takes the rest, so no space is reserved for a threshold value that may
 * never exist — §17 requires the layout not to depend on one.
 */
export function IncomeAxis() {
  const { fieldLabels, milestones } = incomeAxis;

  return (
    <Section labelledBy="income-axis">
      <Container>
        <Grid>
          <div className={styles.intro}>
            <h2 id="income-axis" className={styles.headline}>
              {incomeAxis.headline}
            </h2>
            <p className={styles.lede}>{incomeAxis.intro}</p>
          </div>

          <ol className={styles.list}>
            {milestones.map((milestone, index) => (
              <li key={milestone.id} className={styles.milestone}>
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
              </li>
            ))}
          </ol>
        </Grid>
      </Container>
    </Section>
  );
}
