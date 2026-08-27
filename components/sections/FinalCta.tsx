import { Button, Container, Grid } from "@/components/foundation";
import { finalCta } from "@/lib/content/homepage";

import styles from "./FinalCta.module.css";

/**
 * H13 — the final call to action.
 *
 * The only full acid surface on the page. The button reverses to ink on paper
 * text so it still reads as the dominant action against the field.
 *
 * This is a plain section rather than the Section primitive, because that
 * primitive paints a paper-toned rule which would vanish against acid.
 */
export function FinalCta() {
  return (
    <section className={styles.section} aria-labelledby="final-cta">
      <Container>
        <Grid>
          <div className={styles.inner}>
            <h2 id="final-cta" className={styles.headline}>
              {finalCta.headline}
            </h2>
            <p className={styles.support}>{finalCta.support}</p>
            <div className={styles.action}>
              <Button href={finalCta.cta.href} tone="ink">
                {finalCta.cta.label}
              </Button>
            </div>
          </div>
        </Grid>
      </Container>
    </section>
  );
}
