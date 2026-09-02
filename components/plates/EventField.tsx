"use client";

import { useEffect, useId, useRef, useState } from "react";

import { useRevealOnce } from "@/components/motion";
import { cx } from "@/lib/cx";
import { incomeField } from "@/lib/content/field";

import styles from "./EventField.module.css";

/** How long the first shape holds before the one-off crossfade. */
const HOLD_MS = 1200;

/**
 * Item 15. A year of income, as a field of weeks.
 *
 * Two shapes of one comparison, as a tab list: real buttons, one selected, and
 * a panel that names which tab describes it. Both states are complete at rest,
 * so nothing here has a hidden resting state.
 *
 * It performs itself exactly once. The first time it is scrolled into view it
 * holds the salaried year for 1.2s and crossfades to the other, and then it
 * never moves again on its own — no loop, and no second run on re-entry. A
 * comparison that keeps flipping while someone is reading it is worse than one
 * that never moves.
 *
 * Under reduced motion it lands on the second shape immediately with no
 * transition, which is the state the sequence was going to end on anyway.
 */
export function EventField({ className }: { className?: string }) {
  const [shapeIndex, setShapeIndex] = useState(0);
  const { ref, revealed } = useRevealOnce<HTMLElement>();
  const performed = useRef(false);
  const listRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const shape = incomeField.shapes[shapeIndex];

  /* Roving tabindex means only the selected tab is in the tab order, so the
     other one is reachable by arrow key or not at all. */
  const select = (index: number) => {
    performed.current = true;
    setShapeIndex(index);
    const tabs = listRef.current?.querySelectorAll<HTMLButtonElement>("[role=tab]");
    tabs?.[index]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const last = incomeField.shapes.length - 1;
    const moves: Record<string, number> = {
      ArrowRight: shapeIndex === last ? 0 : shapeIndex + 1,
      ArrowLeft: shapeIndex === 0 ? last : shapeIndex - 1,
      Home: 0,
      End: last,
    };
    const next = moves[event.key];
    if (next === undefined) return;
    event.preventDefault();
    select(next);
  };

  useEffect(() => {
    if (performed.current) return;

    /* Reduced motion gets the destination, not the journey. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      performed.current = true;
      setShapeIndex(incomeField.shapes.length - 1);
      return;
    }

    if (!revealed) return;
    performed.current = true;
    const timer = window.setTimeout(
      () => setShapeIndex(incomeField.shapes.length - 1),
      HOLD_MS,
    );
    return () => window.clearTimeout(timer);
  }, [revealed]);

  return (
    <figure ref={ref} className={cx(styles.field, className)}>
      <div
        ref={listRef}
        role="tablist"
        aria-label={incomeField.caption}
        className={styles.controls}
        onKeyDown={onKeyDown}
      >
        {incomeField.shapes.map((option, index) => {
          const selected = index === shapeIndex;
          return (
            <button
              key={option.id}
              type="button"
              role="tab"
              id={`${panelId}-${option.id}`}
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              className={cx(styles.tab, selected && styles.tabOn)}
              /* A deliberate choice ends the introduction for good. */
              onClick={() => select(index)}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <div
        id={panelId}
        role="tabpanel"
        aria-labelledby={`${panelId}-${shape.id}`}
        className={styles.panel}
      >
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
      </div>

      <figcaption className={styles.caption}>{incomeField.caption}</figcaption>
    </figure>
  );
}
