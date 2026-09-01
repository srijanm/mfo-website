"use client";

import { useEffect, useRef } from "react";

import { amountFormatters, type AmountFormatterName } from "@/lib/content/format";

import { useRevealOnce } from "./useRevealOnce";

type CountUpProps = {
  /** The already-formatted final string. Rendered at rest, so the server
   *  output, the no-JS case and reduced motion are all correct. */
  children: string;
  /** The numeric value to animate to. */
  to: number;
  /**
   * Names the formatter for the frames in between. A name rather than a
   * function, because the records that use this render on the server and a
   * function cannot be handed across that boundary.
   */
  format: AmountFormatterName;
  className?: string;
};

/**
 * Counts a figure up once, the first time it is reached, and then never again.
 *
 * The final string is what renders at rest — this never starts from an empty or
 * zeroed state, so nothing is missing before the animation runs or if it never
 * runs at all.
 */
export function CountUp({ children, to, format, className }: CountUpProps) {
  const formatValue = amountFormatters[format];
  const { ref, revealed } = useRevealOnce<HTMLSpanElement>();
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !revealed || done.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    done.current = true;

    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 900);
      if (t < 1) {
        el.textContent = formatValue(to * (1 - Math.pow(1 - t, 3)));
        requestAnimationFrame(tick);
        return;
      }
      /* Land on the content string itself rather than on whatever the formatter
         produces for the final value. The two agree today, but the resting DOM
         must equal the content exactly however the string is later written —
         that equality is what the no-JS parity test checks. */
      el.textContent = children;
    };
    requestAnimationFrame(tick);
  }, [revealed, to, formatValue, children, ref]);

  return (
    <span ref={ref} className={className}>
      {children}
    </span>
  );
}
