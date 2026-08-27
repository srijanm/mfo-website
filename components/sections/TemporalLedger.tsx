import { Container, Grid, Section, ThresholdNode, VerticalRule } from "@/components/foundation";
import { temporalLedger } from "@/lib/content/homepage";
import { factValue } from "@/lib/content/reviewed";

import styles from "./TemporalLedger.module.css";

/**
 * H07 — the managed calendar, as a vertical ledger.
 *
 * Not a month grid: §19 rules that out. The year runs top to bottom with a
 * node at each stage where something actually changes, and plain labels at the
 * two bookends where nothing does.
 *
 * Statuses come from a typed union of the six permitted values, so "Done" or
 * "Handled" cannot reach a marketing example — they would not compile. There
 * is no overdue state in that union at all.
 *
 * Dates come from content and are null until reviewed, so nothing here is
 * numeric today and the rows read correctly either way.
 */
export function TemporalLedger() {
  const { entries } = temporalLedger;

  return (
    <Section labelledBy="temporal-ledger">
      <Container>
        <Grid>
          <div className={styles.copy}>
            <h2 id="temporal-ledger" className={styles.headline}>
              {temporalLedger.headline}
            </h2>
            <p className={styles.body}>{temporalLedger.body}</p>
          </div>

          <div className={styles.rules}>
            <VerticalRule />
          </div>

          <div className={styles.ledger}>
            <p className={styles.year}>{temporalLedger.yearLabel}</p>

            <ol className={styles.rows}>
              <li className={styles.row}>
                <div className={styles.rail}>
                  <span aria-hidden="true" className={styles.railLine} />
                </div>
                <p className={styles.bookend}>{temporalLedger.startLabel}</p>
              </li>

              {entries.map((entry) => (
                <li key={entry.id} className={styles.row}>
                  <div className={styles.rail}>
                    <ThresholdNode
                      className={styles.railNode}
                      orientation="vertical"
                      lineBefore
                      lineAfter
                    />
                  </div>

                  <div className={styles.entry}>
                    <p className={styles.label}>{entry.label}</p>
                    {entry.when ? (
                      <p className={styles.when}>{factValue(entry.when)}</p>
                    ) : null}
                    <p className={styles.status}>{entry.status}</p>
                  </div>
                </li>
              ))}

              <li className={styles.row}>
                <div className={styles.rail}>
                  <span aria-hidden="true" className={styles.railLine} />
                </div>
                <p className={styles.bookend}>{temporalLedger.endLabel}</p>
              </li>
            </ol>
          </div>
        </Grid>
      </Container>
    </Section>
  );
}
