import type { CSSProperties, ReactNode } from "react";

import { cx } from "@/lib/cx";

import styles from "./Grid.module.css";

type GridProps = {
  className?: string;
  children: ReactNode;
};

/** The 12 / 8 / 4 column grid from §7. */
export function Grid({ className, children }: GridProps) {
  return <div className={cx(styles.grid, className)}>{children}</div>;
}

type GridItemProps = {
  /** Columns spanned at each breakpoint. Defaults to the full row. */
  desktop?: number;
  tablet?: number;
  mobile?: number;
  className?: string;
  children: ReactNode;
};

/**
 * Spans are passed as custom properties rather than generated classes, so a
 * layout can use any column count without the stylesheet enumerating all of
 * them.
 */
export function GridItem({ desktop, tablet, mobile, className, children }: GridItemProps) {
  const span = {
    "--span-desktop": desktop,
    "--span-tablet": tablet,
    "--span-mobile": mobile,
  } as CSSProperties;

  return (
    <div className={cx(styles.item, className)} style={span}>
      {children}
    </div>
  );
}
