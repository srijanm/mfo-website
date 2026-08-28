import type { ReactNode } from "react";

import { Reveal } from "@/components/motion";
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
 * All rows live in one description list even when the anatomy shows them in
 * groups, so every value aligns down a single edge. Separate lists would each
 * size their own label column and the values would step in and out. Groups are
 * separated by spacing on the first row of each later group.
 */
export function RecordSurface({ title, amount, groups, note, className }: RecordSurfaceProps) {
  const rows = groups.flatMap((group, groupIndex) =>
    group.map((row, rowIndex) => ({
      ...row,
      startsGroup: groupIndex > 0 && rowIndex === 0,
    })),
  );

  return (
    <figure className={cx(styles.surface, className)}>
      <figcaption className={styles.title}>{title}</figcaption>
      <hr aria-hidden="true" className={styles.titleRule} />

      {amount ? <p className={cx(styles.amount, "data-number")}>{amount}</p> : null}

      <Reveal as="dl" variant="rows" className={styles.rows}>
        {rows.map((row) => (
          <div
            key={row.label}
            className={cx(styles.row, row.startsGroup && styles.groupStart)}
          >
            <dt className={styles.label}>{row.label}</dt>
            <dd className={cx(styles.value, "data-number")}>{row.value ?? EMPTY_VALUE}</dd>
          </div>
        ))}
      </Reveal>

      {note ? <p className={styles.note}>{note}</p> : null}
    </figure>
  );
}
