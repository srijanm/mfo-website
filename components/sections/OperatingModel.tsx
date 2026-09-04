import { Container, Grid, Section } from "@/components/foundation";
import { WatchBracket } from "@/components/illustration";
import { Reveal } from "@/components/motion";
import { operatingModel } from "@/lib/content/homepage";
import { cx } from "@/lib/cx";

import styles from "./OperatingModel.module.css";

/**
 * H06 — the operating model.
 *
 * Three claims, divided by rules. No icons and no cards: §18 rules both out,
 * and the three-column rhythm is carried by the dividers alone.
 */
export function OperatingModel() {
  return (
    <Section labelledBy="operating-model">
      <Container>
        <Grid>
          <h2 id="operating-model" className={cx("section-headline", styles.headline)}>
            {operatingModel.headline}
          </h2>

          {/* The operating model as a shape: the sequence is yours, the
              bracket over it is ours. */}
          <WatchBracket className={styles.mark} />

          <Reveal as="ul" variant="rows" className={cx("rule-grid", styles.pillars)}>
            {operatingModel.pillars.map((pillar) => (
              <li key={pillar.id}>
                <h3 className={styles.title}>{pillar.title}</h3>
                <p className={styles.body}>{pillar.body}</p>
              </li>
            ))}
          </Reveal>
        </Grid>
      </Container>
    </Section>
  );
}
