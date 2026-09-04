import { Container, Grid, Section } from "@/components/foundation";
import { Reveal } from "@/components/motion";
import { trustLedger } from "@/lib/content/homepage";

import { cx } from "@/lib/cx";

import styles from "./TrustLedger.module.css";

/**
 * H09 — the trust ledger.
 *
 * Ruled two-column rows, per §21. No ticks, no cards and no green: the
 * behaviours are stated plainly and the rules do the structuring.
 *
 * The filing sequence beneath the rows is the concrete version of the same
 * promise: four states of one return, in the order they happen. Real text in
 * a real list — it is the information, not a marking beside it.
 */
export function TrustLedger() {
  const { columnHeadings, rows, filingSequence } = trustLedger;

  return (
    <Section labelledBy="trust-ledger">
      <Container>
        <Grid>
          <h2 id="trust-ledger" className={cx("section-headline", styles.headline)}>
            {trustLedger.headline}
          </h2>

          <Reveal as="ul" variant="rows" className={styles.rows}>
            {rows.map((row) => (
              <li key={row.id} className={styles.row}>
                <div>
                  <span className={styles.label}>{columnHeadings.whatWeDo}</span>
                  <h3 className={styles.whatWeDo}>{row.whatWeDo}</h3>
                </div>

                <div>
                  <span className={styles.label}>{columnHeadings.whyItMatters}</span>
                  <p className={styles.whyItMatters}>{row.whyItMatters}</p>
                </div>
              </li>
            ))}
          </Reveal>

          <div className={styles.sequence}>
            <p className={styles.sequenceLabel}>{filingSequence.label}</p>
            <ol className={styles.states}>
              {filingSequence.states.map((state) => (
                <li key={state} className={styles.state}>
                  <span aria-hidden="true" className={styles.node} />
                  {state}
                </li>
              ))}
            </ol>
          </div>
        </Grid>
      </Container>
    </Section>
  );
}
