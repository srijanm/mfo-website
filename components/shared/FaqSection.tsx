import { Container, Disclosure, Section } from "@/components/foundation";
import type { FaqItem } from "@/lib/content/homepage";

import { cx } from "@/lib/cx";

import styles from "./FaqSection.module.css";

type FaqSectionProps = {
  /** Supplied by the page from lib/content. Each page passes its own set. */
  items: readonly FaqItem[];
  /**
   * Optional. Pages written without one get no invented heading; the questions
   * become h2 so the heading order has no hole in it.
   */
  headline?: string;
};

/**
 * A ruled accordion: four columns of heading, eight of rows.
 *
 * Built on the Disclosure primitive — a real button carrying aria-expanded,
 * with the panel toggled by one attribute, so open and closed markup differ by
 * one thing and both are keyboard operable.
 *
 * The block closes on its own last rule, so there is no blank region under the
 * final answer waiting for the next section to start.
 */
export function FaqSection({ items, headline }: FaqSectionProps) {
  return (
    <Section dense labelledBy={headline ? "faq-headline" : undefined}>
      <Container>
        <div className={cx(styles.layout, !headline && styles.layoutBare)}>
          {headline ? (
            <div className={styles.intro}>
              <h2 id="faq-headline" className={cx("section-headline", styles.headline)}>
                {headline}
              </h2>
            </div>
          ) : null}

          <div className={styles.list}>
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
        </div>
      </Container>
    </Section>
  );
}
