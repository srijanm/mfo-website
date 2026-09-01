import { Button, Container, Grid } from "@/components/foundation";
import { cx } from "@/lib/cx";
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
 * It uses the shared `.section` box rather than the Section primitive, because
 * the primitive draws its rule on reveal and paints it in the paper-toned
 * value, which would vanish against acid. `.section--on-acid` swaps the rule
 * colour; the width and position are the same as every other section rule.
 */
export function FinalCtaSection({ content }: FinalCtaSectionProps) {
  return (
    <section
      className={cx("section", "section--on-acid", styles.section)}
      aria-labelledby="final-cta"
    >
      <Container>
        <Grid>
          <div className={styles.statement}>
            <h2 id="final-cta" className={styles.headline}>
              {content.headline}
            </h2>
          </div>

          <div className={styles.close}>
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
