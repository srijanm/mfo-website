import { cx } from "@/lib/cx";

import styles from "./Plate.module.css";

export type PlateKind =
  | "recognition"
  | "latentProblem"
  | "mismatch"
  | "incomeAxis"
  | "calendar"
  | "coreScope"
  | "trust";

type PlateProps = { kind: PlateKind; className?: string };

/**
 * §6 as a section mark.
 *
 * Decorative by construction: every idea a plate encodes is stated as real text
 * in the section that owns it, and the plate is hidden from assistive tech.
 *
 * Sixteen identical parts, positioned entirely from the stylesheet by
 * :nth-child() per kind. No inline styles and no numbers in this file, so every
 * piece of geometry is in one place and the plate is a single node from the
 * outside. Kinds that need fewer than sixteen parts hide the rest.
 */
export function Plate({ kind, className }: PlateProps) {
  return (
    <span aria-hidden="true" className={cx(styles.plate, styles[kind], className)}>
      {Array.from({ length: 16 }, (_, index) => (
        <span key={index} className={styles.part} />
      ))}
    </span>
  );
}
