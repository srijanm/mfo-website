import { Container, Grid, Section } from "@/components/foundation";
import { Reveal } from "@/components/motion";
import { additionalSupportSection } from "@/lib/content/pricing";
import { additionalSupport } from "@/lib/content/site-content";

import styles from "./AdditionalFinancialSupport.module.css";

/**
 * H11 — additional financial support.
 *
 * Subordinate by construction: it appears only after pricing, takes the dense
 * section rhythm, and its headline sits a step below the one on the core scope
 * section. These are adjacent decisions MFO can help with because it already
 * understands how someone earns — not a second product, and never framed as
 * the single office that handles everything.
 */
export function AdditionalFinancialSupport() {
  return (
    <Section dense labelledBy="additional-support">
      <Container>
        <Grid>
          <p className={`section-label ${styles.label}`}>{additionalSupportSection.label}</p>
          <h2 id="additional-support" className={styles.headline}>
            {additionalSupportSection.headline}
          </h2>
          <p className={styles.body}>{additionalSupportSection.body}</p>

          <Reveal as="ul" variant="rows" className={styles.rows}>
            {additionalSupport.map((item) => (
              <li key={item.id} className={styles.row}>
                <h3 className={styles.title}>{item.title}</h3>
                <p className={styles.description}>{item.body}</p>
              </li>
            ))}
          </Reveal>
        </Grid>
      </Container>
    </Section>
  );
}
