"use client";

import { useEffect, useRef } from "react";

import styles from "./MeasureField.module.css";

/** Nine baselines and ten fade strips. Counts only — the geometry is CSS. */
const BASELINES = Array.from({ length: 9 }, (_, index) => index);
const COLUMNS = Array.from({ length: 12 }, (_, index) => index);
const STRIPS = Array.from({ length: 10 }, (_, index) => index);

/**
 * The measure field behind the hero.
 *
 * It is the page's own 12-column grid drawn at 7.5% ink, so it registers with
 * every rule on the site rather than being a texture laid over them. The fade
 * is ten solid strips of paper at stepped opacity, and the baselines are
 * discrete spans: there is no gradient anywhere in it.
 *
 * Decorative in full — aria-hidden, pointer-events: none, and nothing it draws
 * carries meaning that is not already text in the hero.
 *
 * The drift listener is attached only on a desktop viewport with a fine pointer
 * where motion is welcome. Anywhere else it is never registered at all, so
 * there is no listener running on a phone.
 */
export function MeasureField() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /* Travel is capped at 6px each way: the pointer position maps to [-0.5, 0.5]
       and is scaled by 12. */
    const onMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 12;
      const y = (event.clientY / window.innerHeight - 0.5) * 12;
      el.style.setProperty("--field-x", `${x.toFixed(2)}px`);
      el.style.setProperty("--field-y", `${y.toFixed(2)}px`);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div aria-hidden="true" className={styles.field}>
      <div ref={ref} className={styles.drift}>
        <div className={styles.columns}>
          {COLUMNS.map((index) => (
            <span key={index} className={styles.column} />
          ))}
        </div>
        <div className={styles.baselines}>
          {BASELINES.map((index) => (
            <span key={index} className={styles.baseline} />
          ))}
        </div>
      </div>
      <div className={styles.fade}>
        {STRIPS.map((index) => (
          <span key={index} className={styles.strip} />
        ))}
      </div>
    </div>
  );
}
