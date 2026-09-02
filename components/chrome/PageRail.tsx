"use client";

import { useState } from "react";

import { ThresholdNode } from "@/components/foundation";
import { useScrollProgress } from "@/components/motion";
import { cx } from "@/lib/cx";
import { sectionIndex } from "@/lib/content/navigation";

import styles from "./PageRail.module.css";

/**
 * A persistent index of the page, in the left margin.
 *
 * It is the one persistent decorative element on the site, and it earns that by
 * being useful: every node is a real anchor to a real section, so it is
 * keyboard reachable and works with JavaScript off — with no script it is
 * simply an unfilled list of links, which is a complete state.
 *
 * It never touches the wheel. Scrolling is the browser's, and all this does is
 * read which section the reader is level with.
 *
 * Hidden below a viewport wide enough to hold it, and under reduced motion, by
 * the stylesheet rather than by a branch here — so the server and client render
 * the same markup and there is no hydration seam.
 */
export function PageRail() {
  const [hovered, setHovered] = useState<number | null>(null);
  const { active } = useScrollProgress(
    sectionIndex.length,
    sectionIndex.map((entry) => entry.id),
  );

  return (
    <nav aria-label="On this page" className={styles.rail}>
      <span
        aria-hidden="true"
        className={styles.fill}
        style={{ height: `${(active / (sectionIndex.length - 1)) * 100}%` }}
      />
      <ol className={styles.list}>
        {sectionIndex.map((entry, index) => (
          <li key={entry.id} className={styles.item}>
            <a
              href={`#${entry.id}`}
              className={cx(styles.node, index === active && styles.nodeActive)}
              onPointerEnter={() => setHovered(index)}
              onPointerLeave={() =>
                setHovered((current) => (current === index ? null : current))
              }
              onFocus={() => setHovered(index)}
              onBlur={() => setHovered((current) => (current === index ? null : current))}
            >
              <ThresholdNode active={index <= active} />
              {/* Only the section being pointed at, or the one the reader is
                  level with, names itself. Rendering all nine and hiding eight
                  would leave text at zero opacity, which is the failure mode
                  the motion rules exist to prevent. */}
              {index === active || index === hovered ? (
                <span className={styles.label}>{entry.label}</span>
              ) : null}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
