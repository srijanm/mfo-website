"use client";

import { useEffect, useRef, useState } from "react";
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
 * A masked line and word reveal: each word rises out of its own clipped box,
 * staggered — but the line is the unit that carries the step.
 *
 * §28 asks for a masked line/word reveal and a 40ms step, and the hero must be
 * finished inside 800ms. A twelve-word headline stepped word by word spends
 * 440ms on stagger alone and cannot make that budget. So lines take the 40ms
 * step and the words inside a line follow at 12ms, which is what "line and
 * word" describes: the headline arrives a line at a time, and the words within
 * a line arrive in order rather than together.
 *
 * Which words share a line is a fact about the rendered layout, not about the
 * string, so it is measured once from the laid-out spans and never again. Until
 * that measurement lands every word is treated as line zero, which is the right
 * answer for a single-line headline and only ever costs a first frame.
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

  /* Per word: which line it fell on, and where it sits within that line. */
  const [steps, setSteps] = useState<readonly { line: number; inLine: number }[]>([]);
  const measured = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || measured.current) return;

    const spans = [...node.querySelectorAll<HTMLElement>(`.${styles.word}`)];
    if (spans.length === 0) return;
    measured.current = true;

    /* Words that share a top edge share a line. Compared with a tolerance
       because a superscript or a differently-sized run inside the headline
       would otherwise read as a line of its own. */
    let line = -1;
    let inLine = 0;
    let previousTop = Number.NEGATIVE_INFINITY;

    setSteps(
      spans.map((span) => {
        const top = span.getBoundingClientRect().top;
        if (top - previousTop > 4) {
          line += 1;
          inLine = 0;
          previousTop = top;
        } else {
          inLine += 1;
        }
        return { line, inLine };
      }),
    );
  }, [ref, text]);

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
        const step = steps[index] ?? { line: 0, inLine: index };

        return (
          <span key={`${word}-${index}`}>
            <span className={cx(isEmphasised && styles.emphasis)}>
              <span className={styles.word}>
                <span
                  className={styles.wordInner}
                  style={
                    {
                      "--word-line": step.line,
                      "--word-in-line": step.inLine,
                    } as CSSProperties
                  }
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
