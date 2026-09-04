import { Button, Container, Grid } from "@/components/foundation";
import { Reveal } from "@/components/motion";
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
 * value, which would vanish against acid. `.surface-acid` supplies the
 * background, the text colour and the rule colour together, so the section rule
 * picks up the on-acid value without being told about it.
 */
export function FinalCtaSection({ content }: FinalCtaSectionProps) {
  return (
    <section
      className={cx("section", "section--dense", "surface-acid", styles.section)}
      aria-labelledby="final-cta"
    >
      <Container>
        <Grid className={styles.grid}>
          {/* One reveal on first entry, and then nothing: the closing panel
              is somewhere a reader arrives at and stops, so anything that kept
              moving here would be moving in front of a decision. */}
          <Reveal variant="rows" className={styles.statement}>
            <h2 id="final-cta" className={cx("section-headline", styles.headline)}>
              {content.headline}
            </h2>
            <p className={styles.support}>{content.support}</p>
            <div className={styles.action}>
              <Button href={content.cta.href} tone="ink">
                {content.cta.label}
              </Button>
            </div>
          </Reveal>
        </Grid>
      </Container>
    </section>
  );
}
