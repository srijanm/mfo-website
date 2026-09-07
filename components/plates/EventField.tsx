"use client";

import { useEffect, useId, useRef, useState } from "react";

import { cx } from "@/lib/cx";
import { incomeField, type FieldCell } from "@/lib/content/field";

import styles from "./EventField.module.css";

/** How long each shape holds before the crossfade to the other one. */
const HOLD_MS = 5000;

/**
 * Two weeks folded into one cell, for the phone-width grid. A fortnight that
 * needed attention reads "todo" — the acid marks are what the drawing is about
 * and there are few of them — and otherwise one arrival is enough to mark it
 * "payment". The same year, at half the resolution: fewer, larger cells, and
 * every row still one unwrapped line.
 */
function foldPair(a?: FieldCell, b?: FieldCell): FieldCell {
  if (a === "todo" || b === "todo") return "todo";
  if (a === "payment" || b === "payment") return "payment";
  return "none";
}

/**
 * Item 15. A year of income, as a field of weeks.
 *
 * Two shapes of one comparison, as a tab list: real buttons, one selected, and
 * a panel that names which tab describes it. Both states are complete at rest,
 * so nothing here has a hidden resting state.
 *
 * It alternates between the two shapes every five seconds, crossfading slowly,
 * on the owner's instruction. Three things bound that loop, because a
 * comparison that keeps flipping while someone is reading it is worse than one
 * that never moves:
 *
 *  - it runs only while the field is actually on screen, so nothing animates in
 *    a tab nobody is looking at;
 *  - a deliberate choice — clicking or arrowing to a tab — stops it for good,
 *    so the reader can hold the shape they want to read;
 *  - under reduced motion it never starts at all and lands on the second shape
 *    immediately, which is the state the sequence would have ended on.
 */
export function EventField({ className }: { className?: string }) {
  const [shapeIndex, setShapeIndex] = useState(0);
  /* Whether the field is on screen right now. Unlike the site's one-shot
     reveal observer this does not latch: the loop has to stop again when the
     field scrolls away, not merely start when it first arrives. */
  const [onScreen, setOnScreen] = useState(false);
  const ref = useRef<HTMLElement>(null);
  /* Latches the moment the reader takes over, and never unlatches. */
  const chosen = useRef(false);
  const listRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const shape = incomeField.shapes[shapeIndex];

  /* Roving tabindex means only the selected tab is in the tab order, so the
     other one is reachable by arrow key or not at all. */
  const select = (index: number) => {
    chosen.current = true;
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
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (chosen.current) return;

    /* Reduced motion gets the destination, not the journey. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      chosen.current = true;
      setShapeIndex(incomeField.shapes.length - 1);
      return;
    }

    /* Only while it is on screen — and the interval is torn down again the
       moment it is not, so nothing animates in a tab nobody is looking at. */
    if (!onScreen) return;

    const timer = window.setInterval(() => {
      /* Checked inside the tick as well as outside: the interval outlives the
         click that ends the loop by up to five seconds. */
      if (chosen.current) return;
      setShapeIndex((current) => (current + 1) % incomeField.shapes.length);
    }, HOLD_MS);

    return () => window.clearInterval(timer);
  }, [onScreen]);

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

      {/* What one square is, before the field rather than after it. The
          figcaption below says what these are not; a reader needs to be told
          what they are first, and needs it where the drawing starts. */}
      <p className={styles.legend}>{incomeField.legend}</p>

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

        {/* The same field at fortnight resolution, for phone widths. Which of
            the two renders is CSS's decision, not a script's, so the server
            and the client always agree on the markup. Decorative like the grid
            above — the caption below carries the accessible text for both. */}
        <div aria-hidden="true" className={styles.gridMobile}>
          {shape.cells.map((row, rowIndex) =>
            Array.from({ length: Math.ceil(row.length / 2) }, (_, pairIndex) => {
              const cell = foldPair(row[pairIndex * 2], row[pairIndex * 2 + 1]);
              return (
                <span
                  key={`${rowIndex}-${pairIndex}`}
                  className={cx(
                    styles.cell,
                    cell === "payment" && styles.cellPayment,
                    cell === "todo" && styles.cellTodo,
                  )}
                />
              );
            }),
          )}
        </div>
      </div>

      <figcaption className={styles.caption}>{incomeField.caption}</figcaption>
    </figure>
  );
}
