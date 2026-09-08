import { Container, Section } from "@/components/foundation";
import { coverageStages, structuralMismatch } from "@/lib/content/homepage";
import { cx } from "@/lib/cx";

import styles from "./StructuralMismatch.module.css";

/**
 * H04 — the alternatives, and where each one stops.
 *
 * The long headline used to be squeezed into a five-column cell beside a dense
 * table, with a decorative mark taking part of what was left. It now runs full
 * width above the comparison at a ~900px measure, with the supporting prose at
 * a tighter measure beneath it, and the table has the section to itself.
 *
 * The table is restrained on purpose: a quiet header row, horizontal rules, no
 * outside border, and no crosses or ticks. Nothing here claims superiority —
 * every row opens with what the alternative is genuinely good at, and the
 * second column names what it does not own. Fit and mismatch, never attack.
 *
 * Below the table's breakpoint each alternative becomes a stacked entry with
 * its field labels shown rather than a desktop table scrolling sideways. The
 * labels are in the DOM once and revealed by CSS, so no content is duplicated.
 */
export function StructuralMismatch() {
  const { columnHeadings, alternatives } = structuralMismatch;

  return (
    <Section labelledBy="structural-mismatch">
      <Container>
        <div className={styles.intro}>
          <h2 id="structural-mismatch" className={cx("section-headline", styles.headline)}>
            {structuralMismatch.headline}
          </h2>

          <div className={styles.body}>
            {structuralMismatch.body.map((paragraph) => (
              <p key={paragraph} className={styles.paragraph}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className={styles.table}>
          {/* A quiet header row. Hidden from assistive technology because each
              row below carries its own labels in the accessibility tree — this
              is a presentational repeat of them, not the only copy. */}
          <div aria-hidden="true" className={cx(styles.row, styles.headRow)}>
            <span className={styles.headCell} />
            <span className={styles.headCell}>{columnHeadings.helps}</span>
            <span className={styles.headCell}>{columnHeadings.doesNotOwn}</span>
          </div>

          {alternatives.map((alternative) => (
            <article key={alternative.id} className={styles.row}>
              <h3 className={styles.name}>{alternative.name}</h3>

              <div className={styles.field}>
                <span className={styles.fieldLabel}>{columnHeadings.helps}</span>
                <p className={styles.fieldText}>{alternative.helps}</p>
              </div>

              <div className={styles.field}>
                <span className={styles.fieldLabel}>{columnHeadings.doesNotOwn}</span>
                <p className={styles.fieldText}>{alternative.doesNotOwn}</p>
              </div>

              {/* Renders only once a CA has reviewed which stages an
                  alternative genuinely owns. `owns` is null today, so nothing
                  below ships — a coverage claim about someone else's service is
                  not something to guess at. */}
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
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
