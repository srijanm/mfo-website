import { cx } from "@/lib/cx";

import styles from "./VerticalRule.module.css";

type VerticalRuleProps = {
  strong?: boolean;
  className?: string;
};

/**
 * A desktop-only vertical 1px rule for split-copy and multi-column layouts.
 * Disappears below 1024px per §5, so callers do not need their own query.
 */
export function VerticalRule({ strong, className }: VerticalRuleProps) {
  return (
    <div aria-hidden="true" className={cx(styles.rule, strong && styles.strong, className)} />
  );
}
