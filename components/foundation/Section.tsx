import type { ReactNode } from "react";

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
 */
export function Section({ id, dense, labelledBy, className, children }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cx("section", dense && "section--dense", className)}
    >
      {children}
    </section>
  );
}
