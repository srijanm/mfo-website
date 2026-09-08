"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cx } from "@/lib/cx";

import styles from "./SiteHeader.module.css";

type NavLinkProps = {
  href: string;
  label: string;
  /** Also treat these paths as "inside" this entry, e.g. a dropdown parent. */
  matches?: readonly string[];
  className?: string;
  onNavigate?: () => void;
};

/**
 * A primary-nav link that knows whether it is the current page.
 *
 * The state is carried twice on purpose: `aria-current="page"` for assistive
 * technology, and a visible underline for everyone else. A nav where the
 * current page looks identical to every other entry gives the reader nothing.
 */
export function NavLink({ href, label, matches, className, onNavigate }: NavLinkProps) {
  const pathname = usePathname();
  const paths = matches ?? [href];
  const current = paths.some((path) => pathname === path || pathname.startsWith(`${path}/`));

  return (
    <Link
      href={href}
      className={cx(styles.link, current && styles.current, className)}
      aria-current={current ? "page" : undefined}
      onClick={onNavigate}
    >
      {label}
    </Link>
  );
}

/** Whether the current path sits inside a set of paths — for a group trigger. */
export function useIsCurrentGroup(paths: readonly string[]): boolean {
  const pathname = usePathname();
  return paths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}
