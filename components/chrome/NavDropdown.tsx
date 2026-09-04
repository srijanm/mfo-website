"use client";

import { useEffect, useRef } from "react";

import type { NavItem } from "@/lib/content/navigation";

import styles from "./SiteHeader.module.css";

type NavDropdownProps = {
  label: string;
  items: readonly NavItem[];
};

/**
 * A small grouped entry in the primary nav.
 *
 * Built on <details>/<summary> so it opens, closes and stays keyboard-reachable
 * with no JavaScript at all; the effect below only adds the expected niceties —
 * close on Escape, on an outside click and after following a link.
 */
export function NavDropdown({ label, items }: NavDropdownProps) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const details = ref.current;
    if (!details) return;

    const close = () => details.removeAttribute("open");

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && details.open) close();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (details.open && !details.contains(event.target as Node)) close();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return (
    <details ref={ref} className={styles.dropdown}>
      <summary className={styles.dropdownTrigger}>
        {label}
        <svg
          aria-hidden="true"
          className={styles.dropdownMark}
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
        >
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1" />
        </svg>
      </summary>
      <ul className={styles.dropdownPanel}>
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className={styles.dropdownLink}
              onClick={() => ref.current?.removeAttribute("open")}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
