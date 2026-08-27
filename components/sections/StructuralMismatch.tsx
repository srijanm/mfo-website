import { Container, Grid, Section, VerticalRule } from "@/components/foundation";
import { structuralMismatch } from "@/lib/content/homepage";

import styles from "./StructuralMismatch.module.css";

/**
 * H04 — structural mismatch.
 *
 * Each alternative is described in two halves split at the sentence boundary
 * the copy doc already wrote them on, so nothing is reworded. Every row leads
 * with where the alternative genuinely helps; the second column names what it
 * does not own. Fit and mismatch, never attack.
 */
export function StructuralMismatch() {
  const { columnHeadings, alternatives } = structuralMismatch;

  return (
    <Section labelledBy="structural-mismatch">
      <Container>
        <Grid>
          <div className={styles.copy}>
            <h2 id="structural-mismatch" className={styles.headline}>
              {structuralMismatch.headline}
            </h2>
            <p className={styles.body}>{structuralMismatch.body}</p>
          </div>

          <div className={styles.rules}>
            <VerticalRule />
          </div>

          <div className={styles.rows}>
            {alternatives.map((alternative) => (
              <div key={alternative.id} className={styles.row}>
                <h3 className={styles.name}>{alternative.name}</h3>

                <div className={styles.field}>
                  <span className={styles.label}>{columnHeadings.helps}</span>
                  <p className={styles.text}>{alternative.helps}</p>
                </div>

                <div className={styles.field}>
                  <span className={styles.label}>{columnHeadings.doesNotOwn}</span>
                  <p className={styles.text}>{alternative.doesNotOwn}</p>
                </div>
              </div>
            ))}
          </div>
        </Grid>
      </Container>
    </Section>
  );
}
