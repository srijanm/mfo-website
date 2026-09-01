import { Container, Grid, Section } from "@/components/foundation";
import { EMPTY_VALUE } from "@/components/objects";
import {
  latentProblem,
  latentProblemColumnsReady,
  type LatentProblemColumns,
} from "@/lib/content/homepage";
import { factValue } from "@/lib/content/reviewed";
import { cx } from "@/lib/cx";

import styles from "./LatentProblemTable.module.css";

/**
 * H03 — the latent problem.
 *
 * §15 specifies a three-column ruled table: what started, why it matters later,
 * and what the customer notices. That table is built below and is driven
 * entirely by `latentProblem.examples[].columns`.
 *
 * It is gated on `latentProblemColumnsReady()` because the copy doc supplies
 * one approved sentence per example and nothing for any of the three columns.
 * Rendering it today would print twelve empty cells and drop four lines of
 * approved copy from the page, so until the columns are written the section
 * renders those sentences instead. Populate `columns` on every example in
 * lib/content/homepage.ts and the specified table appears with no other change.
 */
export function LatentProblemTable() {
  const { columnHeadings, examples } = latentProblem;
  const showColumns = latentProblemColumnsReady();

  const headings: [keyof LatentProblemColumns, string][] = [
    ["started", columnHeadings.started],
    ["mattersLater", columnHeadings.mattersLater],
    ["notices", columnHeadings.notices],
  ];

  return (
    <Section labelledBy="latent-problem">
      <Container>
        {showColumns ? (
          <>
            <Grid>
              <div className={styles.proposition}>
                <h2 id="latent-problem" className={`display-2 ${styles.headline}`}>
                  {latentProblem.headline}
                </h2>
                <p className={styles.follow}>{latentProblem.follow}</p>
                <p className={styles.intro}>{latentProblem.intro}</p>
              </div>
            </Grid>

            <div className={cx("rule-grid", styles.table)}>
              <div className="rule-grid-flush">
                {/* Headers once, above the first row. */}
                <div className={styles.headRow}>
                  {headings.map(([key, label]) => (
                    <p key={key} className={styles.heading}>
                      {label}
                    </p>
                  ))}
                </div>

                {examples.map((example) => (
                  <div key={example.id} className={styles.row}>
                    {headings.map(([key, label]) => {
                      const value = example.columns?.[key];
                      return (
                        <p
                          key={key}
                          className={cx(styles.cell, !value && styles.cellEmpty)}
                        >
                          <span className={styles.cellLabel}>{label}</span>
                          {value || EMPTY_VALUE}
                        </p>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className={cx("rule-grid", "rule-grid--5-7", styles.split)}>
            <div className={styles.splitCopy}>
              <h2 id="latent-problem" className={`display-2 ${styles.headline}`}>
                {latentProblem.headline}
              </h2>
              <p className={styles.follow}>{latentProblem.follow}</p>
            </div>

            <div className="rule-grid-flush">
              <p className={styles.splitIntro}>{latentProblem.intro}</p>

              {examples.map((example) => (
                <div key={example.id} className={styles.summaryRow}>
                  <p className={styles.summaryText}>{factValue(example.summary)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
}
