import type { ReactNode } from "react";

import { cx } from "@/lib/cx";

import styles from "./RecordSurface.module.css";

/** Rendered when a field has no value yet, matching the spec's anatomy. */
export const EMPTY_VALUE = "—";

export type RecordRow = {
  label: string;
  /** Null renders the empty marker rather than an absent row. */
  value: ReactNode | null;
};

type RecordSurfaceProps = {
  title: string;
  /** Headline figure, for records that lead with one. */
  amount?: string;
  /** Row groups, separated by a gap the way the anatomy separates them. */
  groups: RecordRow[][];
  note?: ReactNode;
  className?: string;
};

/**
 * Shared chrome for the three information objects in §11: uppercase object
 * title, a rule, an optional headline figure, then aligned label/value rows.
 *
 * Rows are a description list, so a screen reader reads each label with its
 * value instead of a run of loose text.
 */
export function RecordSurface({ title, amount, groups, note, className }: RecordSurfaceProps) {
  return (
    <figure className={cx(styles.surface, className)}>
      <figcaption className={styles.title}>{title}</figcaption>
      <hr aria-hidden="true" className={styles.titleRule} />

      {amount ? <p className={cx(styles.amount, "data-number")}>{amount}</p> : null}

      {groups.map((rows, groupIndex) => (
        <dl key={rows.map((row) => row.label).join("|") || groupIndex} className={styles.group}>
          {rows.map((row) => (
            <div key={row.label} style={{ display: "contents" }}>
              <dt className={styles.label}>{row.label}</dt>
              <dd className={cx(styles.value, "data-number")}>{row.value ?? EMPTY_VALUE}</dd>
            </div>
          ))}
        </dl>
      ))}

      {note ? <p className={styles.note}>{note}</p> : null}
    </figure>
  );
}
