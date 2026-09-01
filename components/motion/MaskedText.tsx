"use client";

import type { CSSProperties } from "react";

import { cx } from "@/lib/cx";

import styles from "./motion.module.css";
import { useRevealOnce } from "./useRevealOnce";

type MaskedTextProps = {
  as?: "h1" | "h2" | "p";
  text: string;
  /**
   * A substring of `text` to band in acid. Matched against the content string
   * rather than a word index, so it survives a rewrite: if the substring is not
   * present the text renders unchanged and no band appears, which is a correct
   * resting state rather than a broken one.
   */
  emphasis?: string;
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
export function MaskedText({
  as: Tag = "h1",
  text,
  emphasis,
  id,
  className,
}: MaskedTextProps) {
  const { ref, revealed } = useRevealOnce<HTMLHeadingElement>();
  const words = text.split(" ");

  /* Which words fall inside the emphasised clause, worked out from where the
     substring sits in the string. Absent or unmatched, the range is empty. */
  const start = emphasis ? text.indexOf(emphasis) : -1;
  const emphasised = new Set<number>();
  if (start >= 0 && emphasis) {
    const end = start + emphasis.length;
    let cursor = 0;
    words.forEach((word, index) => {
      const wordEnd = cursor + word.length;
      if (cursor >= start && wordEnd <= end) emphasised.add(index);
      cursor = wordEnd + 1;
    });
  }

  return (
    <Tag
      ref={ref}
      id={id}
      className={cx(styles.masked, revealed && styles.isVisible, className)}
    >
      {words.map((word, index) => {
        const isEmphasised = emphasised.has(index);
        /* The space after a word joins the band only when the next word is in
           the clause too. So the band runs unbroken across the clause and stops
           at its last character, rather than trailing one space past it. */
        const spaceJoinsBand = isEmphasised && emphasised.has(index + 1);
        const space = index < words.length - 1 ? " " : null;

        return (
          <span key={`${word}-${index}`}>
            <span className={cx(isEmphasised && styles.emphasis)}>
              <span className={styles.word}>
                <span
                  className={styles.wordInner}
                  style={{ "--word-index": index } as CSSProperties}
                >
                  {word}
                </span>
              </span>
              {spaceJoinsBand ? space : null}
            </span>
            {spaceJoinsBand ? null : space}
          </span>
        );
      })}
    </Tag>
  );
}
