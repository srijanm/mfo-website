"use client";

import { Container, Section } from "@/components/foundation";
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
 * H03 — the delayed problem, as a compact editorial timeline.
 *
 * Five columns of statement, seven of timeline, tops aligned, and no card
 * framing around either. The first sentence carries the section; the second is
 * a step down and muted but still comfortably legible; the explanatory
 * paragraph sits below both at a reading measure.
 *
 * On the right, four entries on a slim vertical rule. The first three are
 * grouped under "Year one" and the last under "Year three", which is the whole
 * point of the section: the gap between when something starts and when it
 * surfaces. The year annotations are ordinals, not calendar dates or due dates.
 *
 * These are things that can happen, not things that happen to everyone. The
 * copy is stated flatly and once — nothing here counts, escalates or warns.
 *
 * §15 specifies a three-column ruled table instead, driven by
 * `latentProblem.examples[].columns`. Those columns are null because writing
 * them means writing tax content nobody has reviewed, so the timeline renders
 * until they exist; populate them and the specified table appears with no other
 * change.
 */
export function LatentProblemTable() {
  const { columnHeadings, examples } = latentProblem;
  const showColumns = latentProblemColumnsReady();

  const headings: [keyof LatentProblemColumns, string][] = [
    ["started", columnHeadings.started],
    ["mattersLater", columnHeadings.mattersLater],
    ["notices", columnHeadings.notices],
  ];

  /* The last entry is the one that surfaces years later. Everything before it
     belongs to the first year. */
  const lastIndex = examples.length - 1;

  return (
    <Section labelledBy="latent-problem">
      <Container>
        <div className={styles.layout}>
          <div className={styles.statement}>
            <h2 id="latent-problem" className={cx("section-headline", styles.headline)}>
              {latentProblem.headline}
            </h2>
            <p className={styles.follow}>{latentProblem.follow}</p>
            <p className={styles.intro}>{latentProblem.intro}</p>
          </div>

          {showColumns ? (
            <div className={cx("rule-grid", styles.table)}>
              <div className="rule-grid-flush">
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
                        <p key={key} className={cx(styles.cell, !value && styles.cellEmpty)}>
                          <span className={styles.cellLabel}>{label}</span>
                          {value || EMPTY_VALUE}
                        </p>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <ol className={styles.timeline}>
              {examples.map((example, index) => {
                const opensYearOne = index === 0;
                const opensYearThree = index === lastIndex;

                return (
                  <li
                    key={example.id}
                    className={cx(styles.entry, opensYearThree && styles.entryLate)}
                  >
                    {/* The year annotation opens the group it names. Real text,
                        not a marking: it is what the section is about. */}
                    {opensYearOne || opensYearThree ? (
                      <p className={styles.year}>
                        {opensYearThree ? latentProblem.railEnd : latentProblem.railStart}
                      </p>
                    ) : null}

                    <div className={styles.entryBody}>
                      <span aria-hidden="true" className={styles.marker} />
                      <p className={styles.entryText}>{factValue(example.summary)}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </Container>
    </Section>
  );
}
