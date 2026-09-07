"use client";

import { Container, Grid, Section, ThresholdNode } from "@/components/foundation";
import { useScrollProgress } from "@/components/motion";
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

  /* Which example the reader is level with. With no observer — no JavaScript,
     or a browser without one — this stays at 0 and the rail below renders in
     its resting state: present, hollow, unfilled. */
  const { ref: sentinelsRef, active } = useScrollProgress(examples.length);

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
                <h2 id="latent-problem" className="section-headline">
                  {latentProblem.headline}
                </h2>
                <p className={styles.follow}>{latentProblem.follow}</p>
                <p className="section-lede">{latentProblem.intro}</p>
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
              <h2 id="latent-problem" className="section-headline">
                {latentProblem.headline}
              </h2>
              <p className={styles.follow}>{latentProblem.follow}</p>
              {/* The section's lede, with the proposition it belongs to rather
                  than floating above the examples in the other column. */}
              <p className="section-lede">{latentProblem.intro}</p>
            </div>

            <div className="rule-grid-flush">
              {/* The rail.

                  The two ordinals are bookends on the timeline, above the
                  first sentence and below the last, rather than a column
                  beside the rows. As a column they occupied a gutter that was
                  empty on every row but two, and two filled cells among four
                  read as missing content rather than as the ends of a span.

                  Inside, one row per example, each carrying the segment of
                  line above its node and the segment below it. The segments
                  tile: each overlaps the row rule above it, so the line is
                  unbroken from the first node to the last, and it changes from
                  acid to rule exactly at the node the reader has reached.
                  Decorative — every row it marks is the sentence beside it,
                  and the two bookends are ordinary text. */}
              <div className={styles.rail}>
                <p className={cx(styles.bookend, styles.bookendStart)}>
                  {latentProblem.railStart}
                </p>

                <div className={styles.rows}>
                  {/* Empty blocks whose only job is to be intersected. */}
                  <div ref={sentinelsRef} aria-hidden="true" className={styles.sentinels}>
                    {examples.map((example, index) => (
                      <div key={example.id} data-index={index} />
                    ))}
                  </div>

                  {examples.map((example, index) => (
                    <div
                      key={example.id}
                      className={cx(
                        styles.summaryRow,
                        index === 0 && styles.summaryRowFirst,
                        index === examples.length - 1 && styles.summaryRowLast,
                        /* The node is reached, so the line leading to it is. */
                        index <= active && styles.segAbovePassed,
                        /* The next node is reached, so the line leaving this
                           one is too. Under reduced motion or with no
                           JavaScript `active` never moves off 0 and the rail
                           is simply present and unfilled, which is a correct
                           resting state. */
                        index < active && styles.segBelowPassed,
                      )}
                    >
                      <ThresholdNode
                        className={cx(
                          styles.rowNode,
                          index <= active && styles.rowNodePassed,
                        )}
                      />
                      <p className={styles.summaryText}>{factValue(example.summary)}</p>
                    </div>
                  ))}
                </div>

                <p className={cx(styles.bookend, styles.bookendEnd)}>
                  {latentProblem.railEnd}
                </p>
              </div>
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
}
