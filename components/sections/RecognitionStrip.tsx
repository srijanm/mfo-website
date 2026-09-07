import Link from "next/link";

import { Container, Section } from "@/components/foundation";
import { EventField } from "@/components/plates";
import { recognitionClosing, recognitionLead } from "@/lib/content/homepage";
import { recognition } from "@/lib/content/site-content";

import styles from "./RecognitionStrip.module.css";

/**
 * H02 — recognition, doubling as navigation.
 *
 * A heading, four linked cells, and then the comparison: the conclusion the
 * cells lead to, and the drawing of that conclusion, as one block. Each cell
 * names a way of earning and routes to the audience page that owns it — the
 * whole cell is the link, so the target is the card and not a glyph inside it.
 */
export function RecognitionStrip() {
  return (
    <Section dense labelledBy="recognition-headline">
      <Container>
        <h2 id="recognition-headline" className="section-headline">
          {recognitionLead}
        </h2>

        <ul className={styles.cards}>
          {recognition.map((item) => (
            <li key={item.label} className={styles.card}>
              <Link href={item.href} className={styles.cardLink}>
                <span className={styles.cardLabel}>{item.label}</span>
                <span aria-hidden="true" className={styles.cardArrow}>
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* The conclusion and the drawing of it are one block, not two.

            The sentence introduces the comparison — it is not a caption on the
            four cells above — so it sits with the thing it introduces: a major
            gap and a rule separate it from the cells, and very little separates
            it from the tabs it leads into. Two illustrative years side by side:
            the shape a salaried year has, and the shape one without that system
            has. */}
        <div className={styles.comparison}>
          <p className={styles.closingText}>{recognitionClosing}</p>
          <EventField className={styles.field} />
        </div>
      </Container>
    </Section>
  );
}
