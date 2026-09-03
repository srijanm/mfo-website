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
  /* One flat sequence of grid children: the rows of each group, with a drawn
     divider standing between one group and the next. The divider is a child of
     the same list rather than a margin on the next row, so it takes its own
     place in the construction order — §28 builds the object as amount, then
     the metadata rows, then the divider, then the system rows. */
  const items = groups.flatMap((group, groupIndex) => [
    ...(groupIndex > 0 ? [{ divider: true as const, key: `divider-${groupIndex}` }] : []),
    ...group.map((row) => ({ ...row, divider: false as const, key: row.label })),
  ]);

  return (
    <figure className={cx(styles.surface, Boolean(note) && styles.hasNote, className)}>
      <figcaption className={styles.title}>{title}</figcaption>
      <hr aria-hidden="true" className={styles.titleRule} />

      {amount ? (
        <Reveal as="p" delay={140} className={cx(styles.amount, "data-number")}>
          {amountValue !== undefined && amountFormat ? (
            <CountUp to={amountValue} format={amountFormat}>
              {amount}
            </CountUp>
          ) : (
            amount
          )}
        </Reveal>
      ) : null}

      {/* `cells` rather than `rows`: each row is a display:contents wrapper so
          that its label and value join the one shared grid, and an element with
          no box cannot be faded or moved. The choreography runs on the cells. */}
      <Reveal as="dl" variant="cells" delay={240} className={styles.rows}>
        {items.map((item) =>
          item.divider ? (
            <div key={item.key} className={styles.divider}>
              <span aria-hidden="true" className={styles.dividerRule} />
            </div>
          ) : (
            <div key={item.key} className={styles.row}>
              <dt className={styles.label}>{item.label}</dt>
              <dd className={cx(styles.value, "data-number")}>
                {item.state === "unresolved" ? (
                  <ThresholdNode className={styles.rowNode} />
                ) : null}
                {item.value ?? EMPTY_VALUE}
              </dd>
            </div>
          ),
        )}
      </Reveal>

      {note ? <p className={styles.note}>{note}</p> : null}
    </figure>
  );
}
