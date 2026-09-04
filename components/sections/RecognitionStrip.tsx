import { Container, Section } from "@/components/foundation";
import { EventField, Plate } from "@/components/plates";
import { recognitionClosing, recognitionLead } from "@/lib/content/homepage";
import { recognition } from "@/lib/content/site-content";

import styles from "./RecognitionStrip.module.css";

/**
 * H02 — recognition.
 *
 * A header row, four cards, and the conclusion beneath them.
 *
 * The section mark used to sit on its own above a body-sized lead line, which
 * left it floating with nothing to belong to. It is now part of the header row:
 * mark and heading on one line, one rule under both. And the lead is the
 * section's heading — it takes the same `.section-headline` every other section
 * on the site does, so the four labels below it are visibly subordinate to it
 * rather than the same size.
 *
 * The four ways money arrives are cards rather than cells of a ruled grid: each
 * one is a separate thing the reader might be, so each gets its own object with
 * its own hover state.
 */
export function RecognitionStrip() {
  return (
    <Section dense labelledBy="recognition-headline">
      <Container>
        <div className={styles.header}>
          <Plate kind="recognition" className={styles.plate} />
          <h2 id="recognition-headline" className="section-headline">
            {recognitionLead}
          </h2>
        </div>

        <ul className={styles.cards}>
          {recognition.map((label) => (
            <li key={label} className={styles.card}>
              <span aria-hidden="true" className={styles.node} />
              <span className={styles.cardLabel}>{label}</span>
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
