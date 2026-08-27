import { Button, Container, Grid, TextLink } from "@/components/foundation";
import { IncomingPaymentRecord } from "@/components/objects";
import { hero } from "@/lib/content/homepage";

import styles from "./Hero.module.css";

/**
 * H01 — the hero.
 *
 * Static. Every string comes from lib/content/homepage.ts, including the
 * payment annotation, which is an approved wording and is quoted rather than
 * rewritten.
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
          <h1 id="hero-headline" className={`display-1 ${styles.headline}`}>
            {hero.headline}
          </h1>

          <div className={styles.copy}>
            <p className={styles.subhead}>{hero.subhead}</p>
            <div className={styles.actions}>
              <Button href={hero.primaryCta.href}>{hero.primaryCta.label}</Button>
              <TextLink href={hero.secondaryCta.href}>{hero.secondaryCta.label}</TextLink>
            </div>
          </div>

          <div className={styles.object}>
            <IncomingPaymentRecord
              amount={paymentExample.amount}
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
