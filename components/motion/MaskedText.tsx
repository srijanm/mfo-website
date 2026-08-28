"use client";

import type { CSSProperties } from "react";

import { cx } from "@/lib/cx";

import styles from "./motion.module.css";
import { useRevealOnce } from "./useRevealOnce";

type MaskedTextProps = {
  as?: "h1" | "h2" | "p";
  text: string;
  id?: string;
  className?: string;
};

/**
 * A masked word reveal: each word rises out of its own clipped box, staggered.
 *
 * The words are ordinary inline spans at rest and only become inline-block
 * masks while animating, so the text lays out identically for anyone who never
 * sees the animation. The string is split on spaces and rejoined with real
 * spaces, so the rendered text is character-for-character the original.
 */
export function MaskedText({ as: Tag = "h1", text, id, className }: MaskedTextProps) {
  const { ref, revealed } = useRevealOnce<HTMLHeadingElement>();
  const words = text.split(" ");

  return (
    <Tag
      ref={ref}
      id={id}
      className={cx(styles.masked, revealed && styles.isVisible, className)}
    >
      {words.map((word, index) => (
        <span key={`${word}-${index}`}>
          <span className={styles.word}>
            <span
              className={styles.wordInner}
              style={{ "--word-index": index } as CSSProperties}
            >
              {word}
            </span>
          </span>
          {index < words.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}
