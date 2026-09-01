"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Returns the index of the last stop whose sentinel has crossed the viewport
 * midpoint, and the ref to hang the sentinel strip on.
 *
 * Desktop-and-scripted only by construction: with no observer the value stays
 * at 0 and every caller renders its resting state.
 *
 * Intersection-driven on purpose. A scroll listener plus a one-shot
 * getBoundingClientRect() latches the wrong stop, because it reads before
 * layout has settled; an observer does not have that failure mode. If a
 * measured read is ever genuinely needed, re-run it inside
 * requestAnimationFrame, on resize, and in a ResizeObserver.
 */
export function useScrollProgress(count: number) {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number((entry.target as HTMLElement).dataset.index);
          if (Number.isInteger(index)) setActive(index);
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );

    for (const child of el.children) observer.observe(child);
    return () => observer.disconnect();
  }, [count]);

  return { ref, active };
}
