"use client";

import { useId, useState } from "react";
import type { ReactNode } from "react";

import { cx } from "@/lib/cx";

import styles from "./Disclosure.module.css";

type DisclosureProps = {
  summary: string;
  defaultOpen?: boolean;
  /** Keeps the trigger at the right depth in the page's heading order. */
  headingLevel?: 2 | 3 | 4;
  className?: string;
  children: ReactNode;
};

/**
 * A ruled disclosure row driven by a real button with `aria-expanded`, per §30.
 *
 * The panel stays in the DOM and is toggled by class, so open and closed markup
 * differ by one class. It animates between zero and its natural height in
 * 220ms; `visibility` does the hiding, because `display` cannot transition and
 * opacity alone would leave the closed panel in the accessibility tree.
 */
export function Disclosure({
  summary,
  defaultOpen = false,
  headingLevel = 3,
  className,
  children,
}: DisclosureProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const triggerId = useId();
  const Heading = `h${headingLevel}` as const;

  return (
    <div className={cx(styles.row, open && styles.isOpen, className)}>
      {/* The heading exists for the document outline; the row's height is the
          trigger's. Without a margin reset the browser default on h2/h3 adds
          about 40px of dead space to every closed row — space that looks
          clickable and is not. */}
      <Heading className={styles.heading}>
        <button
          type="button"
          id={triggerId}
          className={styles.trigger}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((wasOpen) => !wasOpen)}
        >
          <span className={styles.summary}>{summary}</span>
          <span aria-hidden="true" className={styles.marker} />
        </button>
      </Heading>
      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        className={cx(styles.panelWrap, open && styles.panelWrapOpen)}
      >
        <div className={styles.panel}>
          <div className={styles.panelBody}>{children}</div>
        </div>
      </div>
    </div>
  );
}
