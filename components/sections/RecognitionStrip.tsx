import Link from "next/link";

import { Container, Section } from "@/components/foundation";
import { EventField } from "@/components/plates";
import { recognitionClosing, recognitionLead } from "@/lib/content/homepage";
import { recognition } from "@/lib/content/site-content";

import styles from "./RecognitionStrip.module.css";

/**
 * H02 — recognition, doubling as navigation.
 *
 * A heading, four linked cells, and the conclusion beneath them. Each cell
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

        <div className={styles.closing}>
          <p className={styles.closingText}>{recognitionClosing}</p>
        </div>

        {/* The closing line, drawn. Two illustrative years side by side: the
            shape a salaried year has, and the shape one without that system
            has. The caption says plainly that they are shapes. */}
        <EventField className={styles.field} />
      </Container>
    </Section>
  );
}
