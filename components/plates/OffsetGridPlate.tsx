"use client";

import type { CSSProperties } from "react";

import { useRevealOnce } from "@/components/motion";
import { cx } from "@/lib/cx";

import styles from "./OffsetGridPlate.module.css";

const COLS = 10;
const ROWS = 6;

/** Where the two grids coincide. A design constant, not content. */
const MEETS = [
  [2, 1],
  [5, 3],
  [8, 2],
  [6, 5],
] as const;

const pct = (value: number) => `${value * 100}%`;

/**
 * Item 11. Two grids that do not register.
 *
 * One grid, and the same grid moved half a cell. They agree in four places and
 * nowhere else, which is the section's own proposition — that the work and the
 * system built for it are close but not aligned — stated in words beside it.
 *
 * All geometry is percentages, so it cannot overflow its column. Decorative:
 * hidden from assistive tech and carrying no label of its own.
 */
export function OffsetGridPlate({ className }: { className?: string }) {
  /* The reveal class is owned here rather than by Reveal, whose own class name
     is hashed into another module and cannot be selected from this stylesheet. */
  const { ref, revealed } = useRevealOnce<HTMLSpanElement>();

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cx(styles.plate, revealed && styles.drawn, className)}
    >
      <span className={styles.grids}>
        {/* The base grid. */}
        {Array.from({ length: COLS + 1 }, (_, index) => (
          <span
            key={`bv-${index}`}
            className={cx(styles.line, styles.vertical)}
            style={{ left: pct(index / COLS), "--draw-index": index } as CSSProperties}
          />
        ))}
        {Array.from({ length: ROWS + 1 }, (_, index) => (
          <span
            key={`bh-${index}`}
            className={cx(styles.line, styles.horizontal)}
            style={{ top: pct(index / ROWS), "--draw-index": index } as CSSProperties}
          />
        ))}

        {/* The same grid, half a cell over. Inset by half a cell at each end so
            it never overhangs the one it is offset from. */}
        {Array.from({ length: COLS }, (_, index) => (
          <span
            key={`ov-${index}`}
            className={cx(styles.line, styles.vertical, styles.offset)}
            style={{
              left: pct((index + 0.5) / COLS),
              "--draw-index": index,
            } as CSSProperties}
          />
        ))}
        {Array.from({ length: ROWS }, (_, index) => (
          <span
            key={`oh-${index}`}
            className={cx(styles.line, styles.horizontal, styles.offset)}
            style={{
              top: pct((index + 0.5) / ROWS),
              "--draw-index": index,
            } as CSSProperties}
          />
        ))}

        {/* The four places they agree. */}
        {MEETS.map(([x, y]) => (
          <span
            key={`${x}-${y}`}
            className={styles.meet}
            style={{ left: pct(x / COLS), top: pct(y / ROWS) } as CSSProperties}
          />
        ))}
      </span>
    </span>
  );
}
