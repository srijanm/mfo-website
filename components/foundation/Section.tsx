"use client";

import type { ReactNode } from "react";

import { useRevealOnce } from "@/components/motion";
import motion from "@/components/motion/motion.module.css";
import { cx } from "@/lib/cx";

type SectionProps = {
  id?: string;
  /** Dense data sections take the shorter vertical rhythm. */
  dense?: boolean;
  /** Id of the heading that names this section, for assistive tech. */
  labelledBy?: string;
  className?: string;
  children: ReactNode;
};

/**
 * A major section boundary: 1px top rule plus the vertical rhythm from §7.
 * Both come from the canonical token sheet.
 *
 * The rule draws itself once, the first time the section is reached. It is a
 * client component only for that: children are passed through untouched and
 * stay server-rendered.
 *
 * The drawn rule is a pseudo-element, because a border cannot be scaled. That
 * substitution happens only when the document is scripted and the visitor has
 * not asked for reduced motion — otherwise the ordinary border is simply there.
 */
export function Section({ id, dense, labelledBy, className, children }: SectionProps) {
  const { ref, revealed } = useRevealOnce<HTMLElement>();

  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={labelledBy}
      className={cx(
        "section",
        dense && "section--dense",
        motion.rule,
        revealed && motion.isVisible,
        className,
      )}
    >
      {children}
    </section>
  );
}
