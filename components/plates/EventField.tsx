"use client";

import { useState } from "react";

import { cx } from "@/lib/cx";
import { incomeField } from "@/lib/content/field";

import styles from "./EventField.module.css";

/**
 * Item 15. A year of income, as a field of weeks.
 *
 * Both states are complete at rest, so the toggle needs no gating beyond the
 * transition on the cells: whichever shape is showing is a finished picture.
 *
 * The cells are decorative and hidden from assistive tech; the caption and the
 * two shape names are real text and come from lib/content/. The caption says
 * these are illustrative, because a field of a year could otherwise be mistaken
 * for a record of one.
 */
export function EventField({ className }: { className?: string }) {
  const [shapeIndex, setShapeIndex] = useState(1);
  const shape = incomeField.shapes[shapeIndex];

  return (
    <figure className={cx(styles.field, className)}>
      <div className={styles.controls} role="group" aria-label={incomeField.caption}>
        {incomeField.shapes.map((option, index) => (
          <button
            key={option.id}
            type="button"
            className={cx(styles.toggle, index === shapeIndex && styles.toggleOn)}
            aria-pressed={index === shapeIndex}
            onClick={() => setShapeIndex(index)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div aria-hidden="true" className={styles.grid}>
        {shape.cells.map((row, rowIndex) =>
          row.map((cell, weekIndex) => (
            <span
              key={`${rowIndex}-${weekIndex}`}
              className={cx(
                styles.cell,
                cell === "payment" && styles.cellPayment,
                cell === "todo" && styles.cellTodo,
              )}
            />
          )),
        )}
      </div>

      <figcaption className={styles.caption}>{incomeField.caption}</figcaption>
    </figure>
  );
}
