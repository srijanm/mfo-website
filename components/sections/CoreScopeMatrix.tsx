import { Container, Grid, Section, TextLink } from "@/components/foundation";
import { Reveal } from "@/components/motion";
import { Plate } from "@/components/plates";
import { coreScopeSection, hero } from "@/lib/content/homepage";

import styles from "./CoreScopeMatrix.module.css";

/**
 * H08 — the core CA and compliance scope.
 *
 * Layer A only. §20 forbids FX, insurance, loans, wealth planning and MIS from
 * appearing here, so this component reads exclusively from `coreScope`. It
 * never touches `additionalSupport`, and lib/content asserts at module load
 * that no Layer B item has leaked into that list.
 *
 * This describes the core relationship, not what any plan includes. Plan
 * inclusion lives in pricing data.
 */
export function CoreScopeMatrix() {
  const { columnHeadings, items } = coreScopeSection;

  return (
    <Section id="core-scope" dense labelledBy="core-scope-headline">
      <Container>
        <Grid>
          <Plate kind="coreScope" className={styles.plate} />
          <h2 id="core-scope-headline" className={styles.headline}>
            {coreScopeSection.headline}
          </h2>

          <Reveal as="ul" variant="rows" className={styles.matrix}>
            <li className={styles.headRow} aria-hidden="true">
              <p className={styles.heading}>{columnHeadings.area}</p>
              <p className={styles.heading}>{columnHeadings.handled}</p>
            </li>

            {items.map((item) => (
              <li key={item.id} className={styles.row}>
                <h3 className={styles.area}>{item.title}</h3>
                <p className={styles.handled}>{item.body}</p>
              </li>
            ))}
          </Reveal>

          {/* A way out of the section. Plain text link, no container — §10
              secondary action. The label is the approved secondary CTA. */}
          <div className={styles.action}>
            <TextLink href={hero.secondaryCta.href}>{hero.secondaryCta.label}</TextLink>
          </div>
        </Grid>
      </Container>
    </Section>
  );
}
