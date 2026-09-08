import { Button, Container } from "@/components/foundation";
import { Reveal } from "@/components/motion";
import { cx } from "@/lib/cx";
import type { FinalCtaContent } from "@/lib/content/homepage";

import styles from "./FinalCtaSection.module.css";

type FinalCtaSectionProps = {
  /** Supplied by the page from lib/content. */
  content: FinalCtaContent;
};

/**
 * The closing call to action: the one full acid field on a page, and a purely
 * typographic conclusion. Nothing decorative shares the field with the decision
 * it is asking for — the headline takes seven columns, the supporting sentence
 * and the action take the rest, and the two are centred against each other.
 *
 * It uses the shared `.section` box rather than the Section primitive, because
 * the primitive draws its rule on reveal in the paper-toned value, which would
 * vanish against acid. `.surface-acid` supplies the background, the text colour
 * and the rule colour together.
 */
export function FinalCtaSection({ content }: FinalCtaSectionProps) {
  return (
    <section
      className={cx("section", "surface-acid", styles.section)}
      aria-labelledby="final-cta"
    >
      <Container className={styles.inner}>
        {/* One reveal on first entry and then nothing: this is somewhere a
            reader arrives and stops, so nothing should still be moving in
            front of a decision. */}
        <Reveal variant="rows" className={styles.headlineWrap}>
          <h2 id="final-cta" className={cx("section-headline", styles.headline)}>
            {content.headline}
          </h2>
        </Reveal>

        <Reveal variant="rows" delay={120} className={styles.aside}>
          <p className={styles.support}>{content.support}</p>
          <Button href={content.cta.href} tone="ink">
            {content.cta.label}
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
