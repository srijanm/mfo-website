import { Button, Container, Section } from "@/components/foundation";
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
 *
 * A grid of cards rather than the two-column ruled matrix it used to be. Eight
 * ruled rows of Area / What we handle read as a table to be worked through in
 * order, when what the section actually lists is eight independent areas — so
 * each is now its own card, the reader can enter the list anywhere, and the two
 * column headings are gone because a card does not need to be told that its
 * first line is the name of the thing.
 */
export function CoreScopeMatrix() {
  const { items } = coreScopeSection;

  return (
    <Section id="core-scope" dense labelledBy="core-scope-headline">
      <Container>
        <div className={styles.header}>
          <Plate kind="coreScope" className={styles.plate} />
          <h2 id="core-scope-headline" className="section-headline">
            {coreScopeSection.headline}
          </h2>
        </div>

        <Reveal as="ul" variant="rows" className={styles.cards}>
          {items.map((item) => (
            <li key={item.id} className={styles.card}>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardBody}>{item.body}</p>
            </li>
          ))}
        </Reveal>

        {/* A way out of the section. Secondary rather than acid: the one acid
            control on this screen is the header's. */}
        <div className={styles.action}>
          <Button href={hero.secondaryCta.href} tone="secondary">
            {hero.secondaryCta.label}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
