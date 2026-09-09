import { reassurance } from "@/lib/content/homepage";

import styles from "./ReassuranceStrip.module.css";

/**
 * Three statements beside the fee.
 *
 * What this replaced: a full section headed "Judge us by what happens before we
 * file anything", five ruled rows and a four-state filing sequence — a defensive
 * argument against an objection the reader had not raised, and the third place
 * on the page to promise something "before you commit".
 *
 * No heading and no eyebrow, deliberately. A strip that announces itself as
 * reassurance is doing the opposite; these read as facts about the arrangement
 * because that is what they are. The sequence they summarise is explained
 * properly on /how-we-work, and the link says so.
 *
 * Not a section of its own: it renders inside the pricing section, which is the
 * thing it qualifies.
 */
export function ReassuranceStrip() {
  return (
    <aside className={styles.strip} aria-label="What is agreed before we start">
      <ul className={styles.points}>
        {reassurance.points.map((point) => (
          <li key={point.id} className={styles.point}>
            <p className={styles.title}>{point.title}</p>
            <p className={styles.body}>{point.body}</p>
          </li>
        ))}
      </ul>
    </aside>
  );
}
