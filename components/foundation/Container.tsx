import type { ElementType, ReactNode } from "react";

import { cx } from "@/lib/cx";

type ContainerProps = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
};

/**
 * Page gutter and 1440px ceiling. The `.container` class is defined in the
 * canonical token sheet, so gutters stay in one place across breakpoints.
 */
export function Container({ as: Tag = "div", className, children }: ContainerProps) {
  return <Tag className={cx("container", className)}>{children}</Tag>;
}
