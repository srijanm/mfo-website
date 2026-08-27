import { Container, Disclosure, Grid, Section } from "@/components/foundation";
import { faq } from "@/lib/content/homepage";

import styles from "./Faq.module.css";

/**
 * H12 — the FAQ.
 *
 * A ruled accordion built on the Disclosure primitive: a real button carrying
 * aria-expanded, with the panel kept in the document and toggled by the hidden
 * attribute, so open and closed markup differ by one attribute.
 *
 * The copy doc gives this section no heading, so it has none and each question
 * is an h2. That keeps the heading order intact rather than leaving a run of
 * h3s with no h2 above them, and it makes the questions reachable by heading
 * navigation.
 */
export function Faq() {
  return (
    <Section>
      <Container>
        <Grid>
          <div className={styles.list}>
            {faq.map((item) => (
              <Disclosure key={item.id} summary={item.question} headingLevel={2}>
                <p className={styles.answer}>{item.answer}</p>
              </Disclosure>
            ))}
          </div>
        </Grid>
      </Container>
    </Section>
  );
}
