import { Button, Container } from "@/components/foundation";
import { PaymentComposition } from "@/components/graphics";
import { MaskedText, Reveal } from "@/components/motion";
import { hero } from "@/lib/content/homepage";

import styles from "./Hero.module.css";

/**
 * H01 — the hero.
 *
 * One composition, not two stacked blocks: a seven-column text area and a
 * five-column illustration area, with the illustration centred against the
 * whole of the heading, paragraph and actions rather than hanging below them.
 * That was the single largest defect in the old hero — the payment object began
 * level with the paragraph, which left a screen-wide void under the headline
 * and another under the buttons.
 *
 * The page-wide measure field that used to sit behind all of this is gone. The
 * warm paper is the canvas; the only document rules on the page belong inside
 * the illustration, where they mean something.
 *
 * Every string comes from lib/content. The payment annotation is an approved
 * wording and is quoted, not rewritten: it is the substantive qualification on
 * the illustration and stays in text beside it rather than inside the graphic,
 * where it would compete with the document's own labels.
 *
 * DOM order is headline, copy, actions, illustration — the reading order and
 * the mobile stacking order, so no source order has to be undone at a
 * breakpoint.
 */
export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-headline">
      <Container className={styles.inner}>
        <div className={styles.text}>
          <MaskedText
            as="h1"
            id="hero-headline"
            text={hero.headline}
            emphasis={hero.headlineEmphasis}
            className={`display-1 ${styles.headline}`}
          />

          <Reveal as="p" delay={160} className={styles.subhead}>
            {hero.subhead}
          </Reveal>

          <Reveal delay={280} className={styles.actions}>
            <Button href={hero.primaryCta.href}>{hero.primaryCta.label}</Button>
            <Button href={hero.secondaryCta.href} tone="secondary">
              {hero.secondaryCta.label}
            </Button>
          </Reveal>

          <Reveal as="p" delay={360} className={styles.qualification}>
            {hero.paymentAnnotation}
          </Reveal>
        </div>

        <Reveal delay={220} className={styles.graphic}>
          <PaymentComposition />
        </Reveal>
      </Container>
    </section>
  );
}
