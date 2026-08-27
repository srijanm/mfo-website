import { Container, Grid, Section } from "@/components/foundation";
import { trustLedger } from "@/lib/content/homepage";

import styles from "./TrustLedger.module.css";

/**
 * H09 — the trust ledger.
 *
 * Ruled two-column rows, per §21. No ticks, no cards and no green: the
 * behaviours are stated plainly and the rules do the structuring.
 */
export function TrustLedger() {
  const { columnHeadings, rows } = trustLedger;

  return (
    <Section labelledBy="trust-ledger">
      <Container>
        <Grid>
          <h2 id="trust-ledger" className={styles.headline}>
            {trustLedger.headline}
          </h2>

          <ul className={styles.rows}>
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
          </ul>
        </Grid>
      </Container>
    </Section>
  );
}
