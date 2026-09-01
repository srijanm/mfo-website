import { Button, Container, Grid, NodeAxis } from "@/components/foundation";
import { cx } from "@/lib/cx";
import type { FinalCtaContent } from "@/lib/content/homepage";

import styles from "./FinalCtaSection.module.css";

/* Five nodes, the last filled. A marking on the field, not a progress
   indicator: it carries no labels and names nothing. */
const AXIS_STOPS = [0, 1, 2, 3, 4].map((index) => ({ id: `stop-${index}` }));

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
      className={cx("section", "section--dense", "section--on-acid", styles.section)}
      aria-labelledby="final-cta"
    >
      <Container>
        <Grid className={styles.grid}>
          <div className={styles.statement}>
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

          <NodeAxis className={styles.axis} stops={AXIS_STOPS} activeIndex={4} quiet />
        </Grid>
      </Container>
    </section>
  );
}
