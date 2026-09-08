import type { RecordSheet as RecordSheetContent } from "@/lib/content/graphics";
import { cx } from "@/lib/cx";

import styles from "./RecordSheet.module.css";

type RecordSheetProps = {
  sheet: RecordSheetContent;
  className?: string;
};

/**
 * An illustrative record sheet, in the same document language as the hero's
 * payment composition: acid backing plate, white sheet, an eyebrow that says
 * what it is, ruled rows, and a qualification at the foot.
 *
 * It explains a situation rather than reporting one. Each row pairs a way of
 * being paid with the record it leaves behind — there are no amounts, no
 * totals, no dates, no tax treatment and no outcomes anywhere in it, so nothing
 * here can be read as a claim about anyone's affairs.
 *
 * Every word is real text, so it stays selectable, translatable and crisp; the
 * only non-text parts are the backing plate and the row markers, both
 * decorative.
 */
export function RecordSheet({ sheet, className }: RecordSheetProps) {
  return (
    <figure className={cx(styles.figure, className)}>
      <span aria-hidden="true" className={styles.backing} />

      <article className={styles.sheet}>
        <header className={styles.head}>
          <p className={styles.eyebrow}>{sheet.eyebrow}</p>
          <h2 className={styles.title}>{sheet.title}</h2>
        </header>

        <div className={styles.columns} aria-hidden="true">
          <span>{sheet.columns.arrangement}</span>
          <span>{sheet.columns.record}</span>
        </div>

        <dl className={styles.rows}>
          {sheet.rows.map((row) => (
            <div key={row.id} className={styles.row}>
              <dt className={styles.arrangement}>
                <span aria-hidden="true" className={styles.marker} />
                {row.arrangement}
              </dt>
              <dd className={styles.record}>{row.record}</dd>
            </div>
          ))}
        </dl>

        <figcaption className={styles.footer}>{sheet.footer}</figcaption>
      </article>
    </figure>
  );
}
