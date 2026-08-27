import { Container, Grid, Section } from "@/components/foundation";
import {
  latentProblem,
  latentProblemColumnsReady,
} from "@/lib/content/homepage";
import { factValue } from "@/lib/content/reviewed";

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
 */
export function LatentProblemTable() {
  const { columnHeadings, examples } = latentProblem;
  const showColumns = latentProblemColumnsReady();

  return (
    <Section labelledBy="latent-problem">
      <Container>
        <Grid>
          <div className={styles.proposition}>
            <h2 id="latent-problem" className={`display-2 ${styles.headline}`}>
              {latentProblem.headline}
            </h2>
            <p className={styles.follow}>{latentProblem.follow}</p>
            <p className={styles.intro}>{latentProblem.intro}</p>
          </div>

          <div className={styles.table}>
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
        </Grid>
      </Container>
    </Section>
  );
}
