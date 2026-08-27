import Link from "next/link";
import type { ReactNode } from "react";

import { cx } from "@/lib/cx";

import styles from "./TextLink.module.css";

type TextLinkProps = {
  href: string;
  /** Trailing arrow. On by default; drop it for links inside running copy. */
  arrow?: boolean;
  className?: string;
  children: ReactNode;
};

export function TextLink({ href, arrow = true, className, children }: TextLinkProps) {
  return (
    <Link href={href} className={cx(styles.link, className)}>
      {children}
      {arrow ? (
        <span aria-hidden="true" className={styles.arrow}>
          →
        </span>
      ) : null}
    </Link>
  );
}
