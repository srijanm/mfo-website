"use client";

import { useState, type CSSProperties } from "react";

import { ThresholdNode } from "@/components/foundation";
import { cx } from "@/lib/cx";

import styles from "./YearRing.module.css";

const TICKS = 60;

type YearRingProps = {
  /** Stage labels, in order. Names only — never a date or a month. */
  stages: readonly { id: string; label: string }[];
  /** The caption at rest, before any stage is pointed at. */
  caption: string;
  className?: string;
};

/**
 * The year as a ring.
 *
 * Sixty ticks, every fifth one long. The passed arc is the ticks themselves
 * recoloured — that is how an arc is drawn here without a gradient and without
 * an SVG. The passed count is a whole number of stages, so the arc always ends
 * exactly on a stage node rather than somewhere between two.
 *
 * It shows the shape of a year and never a date, a month name or a threshold.
 * Decorative: the stages it marks are the ledger's own rows, as text, beside it.
 *
 * One caption is in the document at a time. Rendering all of them and hiding
 * all but one would leave text at opacity 0, which is the failure mode the
 * project's motion rules exist to prevent — and the suite checks for. Hover
 * state only: it does not outlive the pointer, and without JavaScript the
 * resting caption is simply the caption.
 */
export function YearRing({ stages, caption, className }: YearRingProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const count = stages.length;
  const ticksPerStage = count > 0 ? TICKS / count : TICKS;
  /* Two stages in, and a whole number of stages by construction, so the arc
     lands on a node rather than between two. */
  const passed = Math.round(ticksPerStage * Math.min(2, count));

  return (
    <div aria-hidden="true" className={cx(styles.ring, className)}>
      {Array.from({ length: TICKS }, (_, index) => (
        <span
          key={index}
          className={cx(
            styles.tick,
            index % 5 === 0 && styles.tickLong,
            index < passed && styles.tickPassed,
          )}
          style={{ "--tick-angle": `${index * (360 / TICKS)}deg` } as CSSProperties}
        />
      ))}

      {stages.map((stage, index) => (
        <span
          key={stage.id}
          className={styles.stage}
          style={{ "--stage-angle": `${index * (360 / count)}deg` } as CSSProperties}
          onPointerEnter={() => setHovered(index)}
          onPointerLeave={() => setHovered((current) => (current === index ? null : current))}
        >
          <ThresholdNode className={styles.stageNode} active={index < 2} />
        </span>
      ))}

      <span className={cx(styles.caption, hovered !== null && styles.captionStage)}>
        {hovered === null ? caption : stages[hovered].label}
      </span>
    </div>
  );
}
