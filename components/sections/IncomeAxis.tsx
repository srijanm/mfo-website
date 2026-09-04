import { Container, Grid, Section, ThresholdNode } from "@/components/foundation";
import { Reveal } from "@/components/motion";
import { incomeAxis } from "@/lib/content/homepage";
import { factValue } from "@/lib/content/reviewed";

import styles from "./IncomeAxis.module.css";

/**
 * H05 — the Income Axis. The one ink chapter on the homepage.
 *
 * A static vertical progression: the section headline and lede, then the five
 * milestones in order, each a node on a continuous spine with its label, the
 * question someone actually asks there, and what MyFinanceOfficer does about
 * it. This is the whole composition at every viewport and motion preference —
 * the former sticky scroll-scrub treatment is gone, and nothing here pins,
 * scrubs, or changes with scroll position.
 *
 * The only motion is the shared first-entrance reveal on the list, which is
 * gated behind `html.js` and `prefers-reduced-motion: no-preference` inside
 * the motion module — so with scripting off or reduced motion on, the content
 * is simply present.
 */
export function IncomeAxis() {
  const { fieldLabels, milestones } = incomeAxis;

  return (
    <Section labelledBy="income-axis" className="surface-ink">
      <Container>
        <Grid>
          <div className={styles.intro}>
            {/* The page rail anchors to this id. */}
            <h2 id="income-axis" className="section-headline section-headline--wide">
              {incomeAxis.headline}
            </h2>
            <p className={styles.lede}>{incomeAxis.intro}</p>
          </div>
        </Grid>

        <Reveal as="ol" variant="rows" className={styles.list}>
          {milestones.map((milestone) => (
            <li key={milestone.id} className={styles.milestone}>
              {/* The spine is decorative — the ordered list already carries
                  the sequence — so the whole rail cell is out of the
                  accessibility tree. The connecting segment between nodes is
                  drawn by the stylesheet on the cell itself. */}
              <div aria-hidden="true" className={styles.rail}>
                <ThresholdNode orientation="vertical" />
              </div>

              <div className={styles.body}>
                <h3 className={styles.label}>{milestone.label}</h3>

                <dl className={styles.fields}>
                  <div className={styles.field}>
                    <dt className={styles.fieldLabel}>{fieldLabels.question}</dt>
                    <dd className={styles.fieldValue}>{milestone.question}</dd>
                  </div>

                  {/* Null until a CA writes and reviews the consequence — the
                      layout must not depend on it appearing. */}
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
        </Reveal>
      </Container>
    </Section>
  );
}
