"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import type { NavItem } from "@/lib/content/navigation";
import { cx } from "@/lib/cx";

import { useIsCurrentGroup } from "./NavLink";
import styles from "./SiteHeader.module.css";

type NavDropdownProps = {
  label: string;
  items: readonly NavItem[];
};

/**
 * A small grouped entry in the primary nav.
 *
 * Built on <details>/<summary> so it opens, closes and stays keyboard-reachable
 * with no JavaScript at all. The effect adds what a keyboard user expects on
 * top of that: Escape closes it *and returns focus to the trigger*, rather than
 * leaving focus stranded inside a panel that is no longer visible. An outside
 * pointer press closes it without moving focus, which is the right behaviour
 * for a pointer.
 */
export function NavDropdown({ label, items }: NavDropdownProps) {
  const ref = useRef<HTMLDetailsElement>(null);
  const triggerRef = useRef<HTMLElement>(null);
  const groupIsCurrent = useIsCurrentGroup(items.map((item) => item.href));

  useEffect(() => {
    const details = ref.current;
    if (!details) return;

    const close = () => details.removeAttribute("open");

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !details.open) return;
      close();
      /* Focus goes back where it came from. Without this it stays on a link
         inside a panel that has just been hidden, and the next Tab starts from
         nowhere obvious. */
      triggerRef.current?.focus();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (details.open && !details.contains(event.target as Node)) close();
    };

    /* Tabbing out of the group closes it: an open panel the reader has already
       left is just an obstacle for the next entry. */
    const onFocusOut = (event: FocusEvent) => {
      const next = event.relatedTarget as Node | null;
      if (details.open && next && !details.contains(next)) close();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    details.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      details.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  return (
    <details ref={ref} className={styles.dropdown}>
      <summary
        ref={triggerRef as React.RefObject<HTMLElement>}
        className={cx(styles.dropdownTrigger, groupIsCurrent && styles.current)}
        /* The group is not itself a page, so it carries "true" rather than
           "page": the reader is inside this section, on one of its children. */
        aria-current={groupIsCurrent ? "true" : undefined}
      >
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
            <NavDropdownLink
              href={item.href}
              label={item.label}
              onNavigate={() => ref.current?.removeAttribute("open")}
            />
          </li>
        ))}
      </ul>
    </details>
  );
}

/** A panel link that marks itself when it is the page being viewed. */
function NavDropdownLink({
  href,
  label,
  onNavigate,
}: {
  href: string;
  label: string;
  onNavigate: () => void;
}) {
  const current = useIsCurrentGroup([href]);

  return (
    <Link
      href={href}
      className={cx(styles.dropdownLink, current && styles.dropdownLinkCurrent)}
      aria-current={current ? "page" : undefined}
      onClick={onNavigate}
    >
      {label}
    </Link>
  );
}
