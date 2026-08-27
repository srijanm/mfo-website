import { Button, Container, Grid } from "@/components/foundation";
import type { FinalCtaContent } from "@/lib/content/homepage";

import styles from "./FinalCtaSection.module.css";

type FinalCtaSectionProps = {
  /** Supplied by the page from lib/content. */
  content: FinalCtaContent;
};

/**
 * The closing call to action: the one full acid field on a page.
 *
 * The button reverses to ink on paper text so it still reads as the dominant
 * action against the field.
 *
 * This is a plain section rather than the Section primitive, because that
 * primitive paints a paper-toned rule which would vanish against acid.
 */
export function FinalCtaSection({ content }: FinalCtaSectionProps) {
  return (
    <section className={styles.section} aria-labelledby="final-cta">
      <Container>
        <Grid>
          <div className={styles.inner}>
            <h2 id="final-cta" className={styles.headline}>
              {content.headline}
            </h2>
            <p className={styles.support}>{content.support}</p>
            <div className={styles.action}>
              <Button href={content.cta.href} tone="ink">
                {content.cta.label}
              </Button>
            </div>
          </div>
        </Grid>
      </Container>
    </section>
  );
}
