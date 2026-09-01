import { cx } from "@/lib/cx";

import styles from "./SheetStack.module.css";

type SheetStackProps = { className?: string };

/**
 * Three sheets, the front one approved.
 *
 * Deliberately abstract: hairlines rather than words, and no title, no fields
 * and nothing that reads as an official document — CLAUDE.md rules that out and
 * this plate sits close enough to the line to say so here. What it encodes,
 * that you see a draft before anything is filed, is stated as real text in the
 * section it sits in.
 *
 * Depth is offset and rule weight. There is no shadow.
 */
export function SheetStack({ className }: SheetStackProps) {
  return (
    <span aria-hidden="true" className={cx(styles.stack, className)}>
      <span className={styles.sheet} />
      <span className={styles.sheet} />
      <span className={cx(styles.sheet, styles.front)}>
        <span className={styles.line} />
        <span className={styles.line} />
        <span className={styles.line} />
        <span className={styles.approval}>
          <span className={styles.node} />
          <span className={styles.line} />
        </span>
      </span>
    </span>
  );
}
