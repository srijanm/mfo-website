import type { ReactNode } from "react";

import { ThresholdNode } from "@/components/foundation";
import { CountUp, Reveal } from "@/components/motion";
import type { AmountFormatterName } from "@/lib/content/format";
import { cx } from "@/lib/cx";

import styles from "./RecordSurface.module.css";

/** Rendered when a field has no value yet, matching the spec's anatomy. */
export const EMPTY_VALUE = "—";

export type RecordRow = {
  label: string;
  /** Null renders the empty marker rather than an absent row. */
  value: ReactNode | null;
  /**
   * Marks a row whose answer is still open. It renders the line + node
   * primitive before the value, which is the one meaning §6 allows: something
   * changes here. It never states what the answer is.
   */
  state?: "unresolved";
};

type RecordSurfaceProps = {
  title: string;
  /** Headline figure, for records that lead with one. Already formatted. */
  amount?: string;
  /**
   * The same figure as a number, with a formatter for the frames in between.
   * Supplied together, the figure counts up once on first sight; supplied
   * neither, it is simply the string. The string is always what renders at
   * rest, so the server output and the reduced-motion case are unaffected.
   */
  amountValue?: number;
  amountFormat?: AmountFormatterName;
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
export function RecordSurface({
  title,
  amount,
  amountValue,
  amountFormat,
  groups,
  note,
  className,
}: RecordSurfaceProps) {
  const rows = groups.flatMap((group, groupIndex) =>
    group.map((row, rowIndex) => ({
      ...row,
      startsGroup: groupIndex > 0 && rowIndex === 0,
    })),
  );

  return (
    <figure className={cx(styles.surface, Boolean(note) && styles.hasNote, className)}>
      <figcaption className={styles.title}>{title}</figcaption>
      <hr aria-hidden="true" className={styles.titleRule} />

      {amount ? (
        <p className={cx(styles.amount, "data-number")}>
          {amountValue !== undefined && amountFormat ? (
            <CountUp to={amountValue} format={amountFormat}>
              {amount}
            </CountUp>
          ) : (
            amount
          )}
        </p>
      ) : null}

      <Reveal as="dl" variant="rows" className={styles.rows}>
        {rows.map((row) => (
          <div
            key={row.label}
            className={cx(styles.row, row.startsGroup && styles.groupStart)}
          >
            <dt className={styles.label}>{row.label}</dt>
            <dd className={cx(styles.value, "data-number")}>
              {row.state === "unresolved" ? (
                <ThresholdNode className={styles.rowNode} />
              ) : null}
              {row.value ?? EMPTY_VALUE}
            </dd>
          </div>
        ))}
      </Reveal>

      {note ? <p className={styles.note}>{note}</p> : null}
    </figure>
  );
}
