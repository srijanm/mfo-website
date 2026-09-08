import Link from "next/link";

import { Container, Section } from "@/components/foundation";
import { IncomeSourceIcon } from "@/components/graphics";
import { incomeSourceIcons } from "@/lib/content/graphics";
import { recognitionClosing, recognitionLead } from "@/lib/content/homepage";
import { recognition } from "@/lib/content/site-content";

import styles from "./RecognitionStrip.module.css";

/**
 * H02 — how the money reaches you.
 *
 * A four-column editorial row rather than four outlined cards: a small line
 * drawing above each label, modest vertical separators between them, and no
 * border boxing each entry. The boxes were the reason this section read as
 * filler — four empty rectangles carrying two words each.
 *
 * Every entry is a real link to the audience page that owns it, so the whole
 * entry is the target rather than a glyph inside it. No static entry is dressed
 * up as an interactive one.
 *
 * The heading sits directly on the container grid; the large boxed geometric
 * mark that used to stand beside it and steal its width is gone.
 *
 * The two illustrative years used to sit here too. They are evidence for the
 * point the supporting section makes, so they moved there with it — this
 * section's job is recognition and routing, and it is short.
 */
export function RecognitionStrip() {
  return (
    <Section dense labelledBy="recognition-headline">
      <Container>
        <h2 id="recognition-headline" className="section-headline">
          {recognitionLead}
        </h2>

        <ul className={styles.sources}>
          {recognition.map((item, index) => (
            <li key={item.label} className={styles.source}>
              <Link href={item.href} className={styles.sourceLink}>
                {/* Decorative: the label directly beneath says the same thing. */}
                <IncomeSourceIcon
                  name={incomeSourceIcons[index] ?? incomeSourceIcons[0]}
                  className={styles.icon}
                />
                <span className={styles.sourceLabel}>{item.label}</span>
                <span aria-hidden="true" className={styles.sourceArrow}>
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <p className={styles.closing}>{recognitionClosing}</p>
      </Container>
    </Section>
  );
}
