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
export function useScrollProgress(count: number, ids?: readonly string[]) {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const key = ids ? ids.join(",") : "";

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    /* Either a sentinel strip hung on the ref, or real elements addressed by
       id. The observer and its margins are the same either way. */
    const targets = key
      ? key
          .split(",")
          .map((id, index) => {
            const node = document.getElementById(id);
            if (node) node.dataset.index = String(index);
            return node;
          })
          .filter((node): node is HTMLElement => node !== null)
      : ref.current
        ? [...(ref.current.children as HTMLCollectionOf<HTMLElement>)]
        : [];

    if (targets.length === 0) return;

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

    for (const target of targets) observer.observe(target);
    return () => observer.disconnect();
  }, [count, key]);

  return { ref, active };
}
