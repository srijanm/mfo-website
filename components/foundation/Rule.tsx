import { cx } from "@/lib/cx";

import styles from "./Rule.module.css";

type RuleProps = {
  /** Heavier rule for a stronger division. */
  strong?: boolean;
  /** 2px acid, for a threshold segment that has been passed — §6. */
  active?: boolean;
  className?: string;
};

/**
 * A horizontal 1px rule. Rules are the site's grouping device and replace
 * cards, so this is presentational: it is always hidden from assistive tech.
 */
export function Rule({ strong, active, className }: RuleProps) {
  return (
    <hr
      aria-hidden="true"
      className={cx(styles.rule, strong && styles.strong, active && styles.active, className)}
    />
  );
}
