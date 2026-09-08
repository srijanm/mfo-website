import { docketGraphic, stageActions } from "@/lib/content/graphics";
import { cx } from "@/lib/cx";

import styles from "./WorkDocket.module.css";

type WorkDocketProps = {
  /** Milestone id, used to look up this stage's two action labels. */
  stageId: string;
  /** 1-based position, rendered as "02 / 05". Never a date. */
  index: number;
  total: number;
  title: string;
  /** The approved sentence describing what MyFinanceOfficer does here. */
  work: string;
  /** Compact variant for the mobile accordion. */
  compact?: boolean;
  className?: string;
};

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * Graphic C — an illustrative work docket.
 *
 * A warm document surface that organises one stage of the approved copy: the
 * stage's position in the sequence, its title, the approved sentence about what
 * MyFinanceOfficer does, and two short action labels summarising it. An acid
 * margin bracket groups the part of the page that is MyFinanceOfficer's work.
 *
 * Deliberately not a dashboard. The action rows carry open squares rather than
 * ticks, because nothing here has been completed for anyone; the header says
 * "Illustrative work docket" on its face; and the footer repeats that the
 * contents depend on the reader's own setup.
 *
 * The title is an h3: on desktop it follows the section's h2 directly, and in
 * the mobile accordion it follows the item's own h3 — neither path skips a
 * level.
 *
 * The question is *not* repeated here. It is displayed prominently in the
 * explanation beside this, and printing it twice was what made the old panel
 * read as an empty form.
 */
export function WorkDocket({
  stageId,
  index,
  total,
  title,
  work,
  compact = false,
  className,
}: WorkDocketProps) {
  const actions = stageActions[stageId];

  return (
    <figure className={cx(styles.docket, compact && styles.compact, className)}>
      <header className={styles.head}>
        <p className={styles.eyebrow}>{docketGraphic.eyebrow}</p>
        <p className={cx(styles.counter, "data-number")}>
          {pad(index)} <span className={styles.of}>{docketGraphic.ofLabel}</span>{" "}
          {pad(total)}
        </p>
      </header>

      <h3 className={styles.title}>{title}</h3>

      {/* The acid bracket runs down the margin of the work, and only the work:
          it is what says "this part is ours". */}
      <div className={styles.work}>
        <p className={styles.workLabel}>{docketGraphic.workLabel}</p>
        <p className={styles.workText}>{work}</p>
      </div>

      <div className={styles.actions}>
        <p className={styles.actionsLabel}>{docketGraphic.actionsLabel}</p>
        <ul className={styles.actionList}>
          {actions.map((action) => (
            <li key={action} className={styles.action}>
              {/* An open square. Not a checkmark — nothing has been done yet. */}
              <span aria-hidden="true" className={styles.actionMarker} />
              {action}
            </li>
          ))}
        </ul>
      </div>

      <figcaption className={styles.footer}>{docketGraphic.footer}</figcaption>
    </figure>
  );
}
