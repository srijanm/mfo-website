import { cx } from "@/lib/cx";

import styles from "./ThresholdNode.module.css";

type ThresholdNodeProps = {
  /** Hollow when false, acid-filled when true. Means: something changes here. */
  active?: boolean;
  /** Optional adjacent label. Real data only — a value, a stage, a date. */
  label?: string;
  orientation?: "horizontal" | "vertical";
  /** Connecting segment leading into the node. */
  lineBefore?: boolean;
  /** Connecting segment leaving the node. */
  lineAfter?: boolean;
  /** Fills the preceding segment 2px acid, for a threshold already passed. */
  lineBeforeActive?: boolean;
  className?: string;
};

/**
 * The line + node primitive.
 *
 * The dot and its segments are presentational, so they are hidden from
 * assistive tech; the label carries the meaning as text. State is never
 * signalled by colour alone — a node that matters is always labelled.
 */
export function ThresholdNode({
  active = false,
  label,
  orientation = "horizontal",
  lineBefore = false,
  lineAfter = false,
  lineBeforeActive = false,
  className,
}: ThresholdNodeProps) {
  const vertical = orientation === "vertical";

  return (
    <span className={cx(styles.node, vertical && styles.vertical, className)}>
      {lineBefore ? (
        <span
          aria-hidden="true"
          className={cx(styles.segment, lineBeforeActive && styles.segmentActive)}
        />
      ) : null}

      <span aria-hidden="true" className={cx(styles.dot, active && styles.dotActive)} />

      {label ? (
        <span className={cx(styles.label, active && styles.labelActive)}>{label}</span>
      ) : null}

      {lineAfter ? <span aria-hidden="true" className={styles.segment} /> : null}
    </span>
  );
}
