"use client";

import type { CSSProperties, ElementType, ReactNode } from "react";

import { cx } from "@/lib/cx";

import styles from "./motion.module.css";
import { useRevealOnce } from "./useRevealOnce";

type RevealVariant = "fade" | "rule" | "rows";

type RevealProps = {
  as?: ElementType;
  variant?: RevealVariant;
  /** Milliseconds to hold before this element begins. */
  delay?: number;
  className?: string;
  children?: ReactNode;
};

/**
 * Wraps content in a first-entrance reveal.
 *
 * The variant classes carry no hidden state unless the document is scripted and
 * the visitor has not asked for reduced motion, so with either of those absent
 * this renders as an ordinary element and the content is simply there.
 */
export function Reveal({
  as: Tag = "div",
  variant = "fade",
  delay = 0,
  className,
  children,
}: RevealProps) {
  const { ref, revealed } = useRevealOnce<HTMLDivElement>();

  return (
    <Tag
      ref={ref}
      className={cx(styles[variant], revealed && styles.isVisible, className)}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
