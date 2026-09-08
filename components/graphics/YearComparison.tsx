import { yearComparison } from "@/lib/content/graphics";
import { cx } from "@/lib/cx";

import styles from "./YearComparison.module.css";

type YearComparisonProps = { className?: string };

/** The tallest column in the drawing, so every month reserves the same height. */
const MAX_MARKS = Math.max(
  ...yearComparison.rows.flatMap((row) => row.marks.map((count) => count)),
);

/**
 * Graphic B (second half) — two illustrative years, side by side.
 *
 * The message is the contrast between two patterns: one month looks like every
 * other month in a salaried year, and does not in the year below it. That
 * contrast is visible at a glance in a static screenshot — there is no tooltip,
 * no hover state and no animation, and nothing needs to be interacted with to
 * read it.
 *
 * What a mark is: one thing that needed attention that month. It is not an
 * amount, not a date, and not a record of anything that happened to anybody.
 * The caption says so in text, and the marks carry no numbers.
 *
 * Both rows use the same dark neutral mark, so neither year is coded as good or
 * bad. Acid appears once, on an annotation that explains what the reader is
 * looking at — never as a risk score or a warning.
 *
 * The month grid itself is decorative and hidden from assistive technology: the
 * row labels, the annotation and the caption are all real text, and together
 * they say everything the drawing says.
 */
export function YearComparison({ className }: YearComparisonProps) {
  const { months, monthNames, rows, caption } = yearComparison;

  return (
    <figure className={cx(styles.figure, className)}>
      <div className={styles.years}>
        {rows.map((row) => (
          <section key={row.id} className={styles.year} aria-label={row.label}>
            <header className={styles.head}>
              <h3 className={styles.label}>{row.label}</h3>
              {row.annotation ? (
                <p className={styles.annotation}>
                  <span aria-hidden="true" className={styles.annotationMark} />
                  {row.annotation}
                </p>
              ) : null}
            </header>

            <div aria-hidden="true" className={styles.track}>
              {months.map((letter, index) => (
                <div key={monthNames[index]} className={styles.month}>
                  <div className={styles.marks}>
                    {Array.from({ length: MAX_MARKS }, (_, slot) => (
                      <span
                        key={slot}
                        className={cx(
                          styles.mark,
                          slot < row.marks[index] && styles.markOn,
                        )}
                      />
                    ))}
                  </div>
                  <span className={styles.monthLabel}>{letter}</span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <figcaption className={styles.caption}>{caption}</figcaption>
    </figure>
  );
}
