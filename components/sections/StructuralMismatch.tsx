import { Container, Section } from "@/components/foundation";
import { coverageStages, structuralMismatch } from "@/lib/content/homepage";
import { cx } from "@/lib/cx";

import styles from "./StructuralMismatch.module.css";

/**
 * H04 — structural mismatch.
 *
 * A bounded 5/7 rule grid. The 1px vertical rule §16 asks for is the right
 * cell's left border, so it begins on the block's top rule and ends on its
 * bottom rule instead of floating free at both ends, and the row rules — which
 * are flush with the cell — terminate exactly on it.
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
        <div className={cx("rule-grid", "rule-grid--5-7", styles.split)}>
          <div className={styles.copy}>
            <h2 id="structural-mismatch" className={cx("section-headline", styles.heading)}>
              {structuralMismatch.headline}
            </h2>
            {structuralMismatch.body.map((paragraph) => (
              <p key={paragraph} className={styles.body}>
                {paragraph}
              </p>
            ))}
          </div>

          <div className="rule-grid-flush">
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

                {/* The coverage strip renders only once a CA has reviewed which
                    stages this alternative genuinely owns. Until then `owns` is
                    null and the row is exactly what it was. */}
                {alternative.owns ? (
                  <span aria-hidden="true" className={styles.coverage}>
                    {coverageStages.map((stage) => (
                      <span
                        key={stage.id}
                        className={cx(
                          styles.segment,
                          alternative.owns?.includes(stage.id) && styles.segmentOwned,
                        )}
                      />
                    ))}
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
