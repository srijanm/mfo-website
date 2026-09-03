import { Container, Section } from "@/components/foundation";
import { EventField, Plate } from "@/components/plates";
import { recognitionClosing, recognitionLead } from "@/lib/content/homepage";
import { recognition } from "@/lib/content/site-content";
import { cx } from "@/lib/cx";

import styles from "./RecognitionStrip.module.css";

/**
 * H02 — recognition.
 *
 * One object: a line that says what the reader is looking at, the four labels,
 * and the conclusion, inside a single bounded rule structure. Every rule in it
 * belongs to the block, so nothing floats above or below it.
 *
 * The lead line is a placeholder — the copy doc supplies the labels and the
 * closing row and nothing to introduce them. See lib/content/homepage.ts.
 */
export function RecognitionStrip() {
  return (
    <Section dense>
      <Container>
        <Plate kind="recognition" className={styles.plate} />

        {/* The lead sits inside the block, above its first rule, so the labels
            arrive with something in front of them. */}
        <p className={styles.lead}>{recognitionLead}</p>

        <ul className={cx("rule-grid", "rule-grid--continues", styles.cells)}>
          {recognition.map((label) => (
            <li key={label} className={styles.cell}>
              {label}
            </li>
          ))}
        </ul>
        {/* The closing row is the second row of the same bounded structure: the
            cells above draw no bottom rule, so the rule at the top of this row
            is the one that separates them, and this row closes the block. */}
        <div className={cx("rule-grid", styles.closing)}>
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
