import { Container, Section } from "@/components/foundation";
import { recognitionClosing } from "@/lib/content/homepage";
import { recognition } from "@/lib/content/site-content";

import styles from "./RecognitionStrip.module.css";

/**
 * H02 — recognition.
 *
 * The section carries no heading of its own: the four labels are the content,
 * and the closing row draws the conclusion. Nothing was invented to give it a
 * title it was not written with.
 */
export function RecognitionStrip() {
  return (
    <Section dense>
      <Container>
        <ul className={styles.cells}>
          {recognition.map((label) => (
            <li key={label} className={styles.cell}>
              {label}
            </li>
          ))}
        </ul>
        <div className={styles.closing}>
          <p className={styles.closingText}>{recognitionClosing}</p>
        </div>
      </Container>
    </Section>
  );
}
