import type { CSSProperties } from "react";

import { ThresholdNode } from "@/components/foundation";
import { cx } from "@/lib/cx";

import styles from "./RoutePlate.module.css";

type RoutePlateProps = {
  /** The label on the crossing rule. Content, never typed in here. */
  crossingLabel: string;
  /** Destinations. Three of them, named from the core scope. */
  destinations: readonly { id: string; label: string }[];
  /** Which destination the surrounding copy is about. Exactly one. */
  activeId: string;
  className?: string;
};

/**
 * Item 12. Where money arriving from outside actually has to go.
 *
 * One route in, one crossing, three destinations. Only one node is filled —
 * the one the copy beside it is about. Hollow is the point: the plate says an
 * answer is needed on each of these, never what the answer is.
 *
 * Percentages throughout. Decorative: the destinations are the core scope's own
 * rows, as text, elsewhere on the page.
 */
export function RoutePlate({
  crossingLabel,
  destinations,
  activeId,
  className,
}: RoutePlateProps) {
  const count = destinations.length;

  return (
    <div aria-hidden="true" className={cx(styles.plate, className)}>
      {/* In from the left, as far as the crossing. */}
      <span className={styles.source} />
      <span className={styles.inbound} />

      {/* The crossing. The only strong vertical in the plate. */}
      <span className={styles.crossing} />
      <span className={styles.crossingLabel}>{crossingLabel}</span>

      {destinations.map((destination, index) => {
        const yValue = ((index + 0.5) / count) * 100;
        const y = `${yValue}%`;
        /* The riser runs between the crossing's midpoint and this destination,
           in whichever direction that is. Computed here rather than in CSS,
           because a negative height is not a length. */
        const riser = {
          top: `${Math.min(50, yValue)}%`,
          height: `${Math.abs(yValue - 50)}%`,
        } as CSSProperties;

        return (
          <span key={destination.id}>
            {/* Up or down out of the crossing, then across to the node. */}
            <span className={styles.riser} style={riser} />
            <span className={styles.branch} style={{ top: y } as CSSProperties} />
            <span className={styles.stop} style={{ top: y } as CSSProperties}>
              <ThresholdNode
                className={styles.node}
                active={destination.id === activeId}
              />
              <span className={styles.label}>{destination.label}</span>
            </span>
          </span>
        );
      })}
    </div>
  );
}
