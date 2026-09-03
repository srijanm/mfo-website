"use client";

import type { CSSProperties } from "react";

import { useRevealOnce } from "@/components/motion";
import { cx } from "@/lib/cx";

import styles from "./NodeAxis.module.css";
import { ThresholdNode } from "./ThresholdNode";

type NodeAxisProps = {
  /** One entry per node. A label is optional; the axis is drawn either way. */
  stops: readonly { id: string; label?: string }[];
  /** Index of the node that is currently active, or null for none. */
  activeIndex?: number | null;
  /**
   * Ink at low opacity and no acid, for the one place the axis is a field
   * marking rather than a live progress indicator — §25.
   */
  quiet?: boolean;
  className?: string;
};

/**
 * The §6 line + node primitive as a horizontal axis.
 *
 * Nodes are placed at even intervals along the line, computed from the index
 * rather than laid out in flow, so the interval never depends on how wide a
 * label happens to be. Labels hang beneath their node and take no part in the
 * spacing; the first and last are pulled inside the line's ends so the axis
 * cannot push its container sideways.
 *
 * On first entry the line draws left to right and the nodes appear along it in
 * order, once — §28. Afterwards the only thing that moves is the progress fill
 * and the active node, and only where a caller is actually changing which node
 * is active. The observer disconnects when it fires, so nothing replays.
 *
 * Decorative by construction: it is hidden from assistive tech, because every
 * label it marks is present as real text in the section that owns it.
 */
export function NodeAxis({ stops, activeIndex = null, quiet, className }: NodeAxisProps) {
  const { ref, revealed } = useRevealOnce<HTMLDivElement>();
  const last = stops.length - 1;
  const position = (index: number) => (last === 0 ? 0 : (index / last) * 100);
  const filled = activeIndex === null ? 0 : position(activeIndex) / 100;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cx(styles.axis, quiet && styles.quiet, revealed && styles.isDrawn, className)}
      style={{ "--node-count": stops.length } as CSSProperties}
    >
      <span className={styles.line} />
      {!quiet && activeIndex !== null && activeIndex > 0 ? (
        /* Full width, scaled rather than sized: §28 asks for transform and
           opacity, and an animated width would lay the axis out again on every
           frame of the fill. */
        <span className={styles.filled} style={{ "--fill": filled } as CSSProperties} />
      ) : null}

      {stops.map((stop, index) => (
        <span
          key={stop.id}
          className={cx(
            styles.stop,
            index === 0 && styles.stopFirst,
            index === last && styles.stopLast,
          )}
          style={{ left: `${position(index)}%`, "--node-index": index } as CSSProperties}
        >
          <ThresholdNode
            className={styles.node}
            active={activeIndex !== null && index === activeIndex}
          />
          {stop.label ? <span className={styles.label}>{stop.label}</span> : null}
        </span>
      ))}
    </div>
  );
}
