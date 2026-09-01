import { Container, Section } from "@/components/foundation";
import {
  latentProblem,
  latentProblemColumnsReady,
} from "@/lib/content/homepage";
import { factValue } from "@/lib/content/reviewed";
import { cx } from "@/lib/cx";

import styles from "./LatentProblemTable.module.css";

/**
 * H03 — the latent problem.
 *
 * The spec asks for a three-column table: what started, why it matters later,
 * and what the customer notices. Writing those columns means writing tax
 * content, and the copy doc supplies only the approved single-sentence
 * examples. Rather than invent two thirds of a tax table, the section renders
 * the approved statements as ruled rows and switches to the full table the
 * moment `columns` is populated and reviewed.
 *
 * Proposition left, examples right, on one bounded 5/7 rule grid — the ruled
 * rows carry the right seven columns either way, so the section holds the grid
 * whether or not the expansion exists yet.
 */
export function LatentProblemTable() {
  const { columnHeadings, examples } = latentProblem;
  const showColumns = latentProblemColumnsReady();

  return (
    <Section labelledBy="latent-problem">
      <Container>
        <div className={cx("rule-grid", "rule-grid--5-7", styles.split)}>
          <div className={styles.proposition}>
            <h2 id="latent-problem" className={`display-2 ${styles.headline}`}>
              {latentProblem.headline}
            </h2>
            <p className={styles.follow}>{latentProblem.follow}</p>
          </div>

          <div className="rule-grid-flush">
            <p className={styles.intro}>{latentProblem.intro}</p>

            {showColumns ? (
              <>
                <div className={styles.headRow}>
                  <p className={styles.heading}>{columnHeadings.started}</p>
                  <p className={styles.heading}>{columnHeadings.mattersLater}</p>
                  <p className={styles.heading}>{columnHeadings.notices}</p>
                </div>
                {examples.map((example) => (
                  <div key={example.id} className={styles.row}>
                    <p className={styles.cell}>{example.columns?.started}</p>
                    <p className={styles.cell}>{example.columns?.mattersLater}</p>
                    <p className={styles.cell}>{example.columns?.notices}</p>
                  </div>
                ))}
              </>
            ) : (
              examples.map((example) => (
                <div key={example.id} className={styles.summaryRow}>
                  <p className={styles.summaryText}>{factValue(example.summary)}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
