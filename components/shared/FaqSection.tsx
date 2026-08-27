import { Container, Disclosure, Grid, Section } from "@/components/foundation";
import type { FaqItem } from "@/lib/content/homepage";

import styles from "./FaqSection.module.css";

type FaqSectionProps = {
  /** Supplied by the page from lib/content. Each page passes its own set. */
  items: readonly FaqItem[];
  /**
   * Optional. The homepage FAQ is written without one, so no heading is
   * invented for it; pages that do have one pass it here.
   */
  headline?: string;
};

/**
 * A ruled accordion, shared by the homepage and the secondary pages.
 *
 * Built on the Disclosure primitive: a real button carrying aria-expanded, with
 * the panel kept in the document and toggled by the hidden attribute, so open
 * and closed markup differ by one attribute.
 *
 * Questions are h2 when the section has no heading of its own — seven h3s with
 * nothing above them would leave a hole in the heading order — and h3 when a
 * headline is supplied.
 */
export function FaqSection({ items, headline }: FaqSectionProps) {
  return (
    <Section labelledBy={headline ? "faq-headline" : undefined}>
      <Container>
        <Grid>
          <div className={styles.list}>
            {headline ? (
              <h2 id="faq-headline" className={styles.headline}>
                {headline}
              </h2>
            ) : null}

            {items.map((item) => (
              <Disclosure
                key={item.id}
                summary={item.question}
                headingLevel={headline ? 3 : 2}
              >
                <p className={styles.answer}>{item.answer}</p>
              </Disclosure>
            ))}
          </div>
        </Grid>
      </Container>
    </Section>
  );
}
