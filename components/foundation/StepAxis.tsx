import type { CSSProperties } from "react";

import { cx } from "@/lib/cx";

import styles from "./StepAxis.module.css";
import { ThresholdNode } from "./ThresholdNode";

type StepAxisProps = {
  /** One entry per step. A label is optional; the plot is drawn either way. */
  stops: readonly { id: string; label?: string }[];
  /** Index of the step currently reached, or null for none. */
  activeIndex?: number | null;
  /** Ink at low opacity and no acid, for a field marking rather than a state. */
  quiet?: boolean;
  className?: string;
};

/**
 * The §6 primitive as a step plot: the same props as NodeAxis, so it is a
 * drop-in swap wherever that is used and inherits every gate the caller has.
 *
 * All geometry is percentages. Pixel geometry overflows its panel at narrow
 * widths and breaks the 320px no-horizontal-scroll test, and this sits inside a
 * sticky panel whose width is not knowable from here.
 *
 * The levels are evenly stepped from the stop's index and mean nothing
 * quantitative — the y-axis is deliberately unlabelled and no number from any
 * content file reaches it. What the plot says, that obligations change as
 * income and setup change, is the section's own headline.
 *
 * Decorative: hidden from assistive tech, like NodeAxis.
 */
export function StepAxis({ stops, activeIndex = null, quiet, className }: StepAxisProps) {
  const count = stops.length;
  const last = count - 1;

  /* Evenly stepped, bottom-left to top-right. Level 0 is the floor. */
  const level = (index: number) => (last === 0 ? 1 : index / last);
  const pct = (value: number) => `${value * 100}%`;

  return (
    <div
      aria-hidden="true"
      className={cx(styles.axis, quiet && styles.quiet, className)}
    >
      {/* Three faint guides. They carry no value and are never labelled. */}
      <span className={styles.guide} style={{ top: "25%" } as CSSProperties} />
      <span className={styles.guide} style={{ top: "50%" } as CSSProperties} />
      <span className={styles.guide} style={{ top: "75%" } as CSSProperties} />

      {stops.map((stop, index) => {
        const reached = activeIndex !== null && index <= activeIndex;
        const runStyle = {
          left: pct(index / count),
          width: pct(1 / count),
          top: pct(1 - level(index)),
        } as CSSProperties;

        /* The riser out of this run, up to the next one. */
        const riserStyle =
          index < last
            ? ({
                left: pct((index + 1) / count),
                top: pct(1 - level(index + 1)),
                height: pct(level(index + 1) - level(index)),
              } as CSSProperties)
            : null;

        const nodeStyle = {
          left: pct((index + 0.5) / count),
          top: pct(1 - level(index)),
        } as CSSProperties;

        return (
          <span key={stop.id}>
            <span
              className={cx(styles.run, reached && styles.reached)}
              style={runStyle}
            />
            {riserStyle ? (
              <span
                className={cx(
                  styles.riser,
                  activeIndex !== null && index + 1 <= activeIndex && styles.reached,
                )}
                style={riserStyle}
              />
            ) : null}
            <span
              className={cx(
                styles.stop,
                activeIndex !== null && index === activeIndex && styles.stopActive,
              )}
              style={nodeStyle}
            >
              <ThresholdNode
                className={styles.node}
                active={activeIndex !== null && index === activeIndex}
              />
              {stop.label ? <span className={styles.label}>{stop.label}</span> : null}
            </span>
          </span>
        );
      })}
    </div>
  );
}
