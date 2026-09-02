"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reveals an element the first time it enters the viewport, then stops
 * observing it.
 *
 * IntersectionObserver only — never a scroll handler, and never a repeating
 * frame loop. Once an element has been revealed it is never hidden again, so
 * scrolling back up replays nothing.
 *
 * If the observer is unavailable the element is revealed immediately, so a
 * missing API can never leave content invisible.
 *
 * Typed on Element rather than HTMLElement so an inline SVG can observe itself
 * without a wrapper — a wrapper would either join the section's grid or, as
 * `display: contents`, generate no box for the observer to intersect at all.
 */
export function useRevealOnce<T extends Element>() {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || revealed) return;

    if (typeof IntersectionObserver === "undefined") {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [revealed]);

  return { ref, revealed };
}
