import { Button, Container, Grid, TextLink } from "@/components/foundation";
import { MaskedText, Reveal } from "@/components/motion";
import { IncomingPaymentRecord } from "@/components/objects";
import { hero } from "@/lib/content/homepage";

import styles from "./Hero.module.css";

/**
 * H01 — the hero.
 *
 * Every string comes from lib/content/homepage.ts, including the payment
 * annotation, which is an approved wording and is quoted rather than rewritten.
 *
 * The hero animates once on load and then stops permanently: the headline's
 * words rise out of their masks, the copy and actions follow, and the payment
 * object's rows resolve in sequence. Nothing here replays, and nothing moves
 * again afterwards.
 *
 * DOM order is headline, copy and actions, then the payment object. That is
 * both the reading order and the mobile stacking order, so no source ordering
 * has to be undone at a breakpoint.
 */
export function Hero() {
  const { paymentExample } = hero;

  return (
    <section className={styles.hero} aria-labelledby="hero-headline">
      <Container className={styles.inner}>
        <Grid className={styles.grid}>
          <MaskedText
            as="h1"
            id="hero-headline"
            text={hero.headline}
            className={`display-1 ${styles.headline}`}
          />

          <div className={styles.copy}>
            <Reveal as="p" delay={160} className={styles.subhead}>
              {hero.subhead}
            </Reveal>
            <Reveal delay={280} className={styles.actions}>
              <Button href={hero.primaryCta.href}>{hero.primaryCta.label}</Button>
              <TextLink href={hero.secondaryCta.href}>{hero.secondaryCta.label}</TextLink>
            </Reveal>
          </div>

          <div className={styles.object}>
            <IncomingPaymentRecord
              amount={paymentExample.amount}
              amountValue={paymentExample.amountValue}
              amountFormat="incomingPayment"
              from={paymentExample.from}
              received={paymentExample.received}
              into={paymentExample.into}
              frequency={paymentExample.frequency}
              indianPayroll={paymentExample.indianPayroll}
              indiaSideSetup={paymentExample.indiaSideSetup}
              note={hero.paymentAnnotation}
            />
          </div>
        </Grid>
      </Container>
    </section>
  );
}
