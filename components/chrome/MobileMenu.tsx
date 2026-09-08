"use client";

import { useEffect, useId, useRef, useState } from "react";

import { Button, Container } from "@/components/foundation";
import { isNavGroup, primaryCta, primaryNav } from "@/lib/content/navigation";

import { NavLink } from "./NavLink";
import styles from "./MobileMenu.module.css";

/**
 * The mobile navigation disclosure.
 *
 * The trigger is a real button with `aria-expanded`; the panel stays in the
 * document and is toggled with `hidden`, so without JavaScript the button is
 * hidden and the panel renders open — navigation is never stranded behind a
 * control that cannot run.
 *
 * Keyboard behaviour, which is what the panel was missing:
 *
 *  - Escape closes it and returns focus to the trigger, rather than leaving
 *    focus inside a panel that is no longer visible.
 *  - Focus moves to the first link when it opens, so the next Tab is inside the
 *    menu rather than back at the top of the page.
 *  - Tab is trapped while it is open, because the panel covers the page: the
 *    alternative is tabbing through content the reader cannot see.
 *  - Following a link closes it.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = () => setOpen(false);

  /** Closes and puts focus back on the control that opened it. */
  const closeAndRestore = () => {
    setOpen(false);
    requestAnimationFrame(() => toggleRef.current?.focus());
  };

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;

    const focusable = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? [],
      ).filter((el) => el.offsetParent !== null);

    /* The first link, so the menu is immediately navigable by keyboard. */
    requestAnimationFrame(() => focusable()[0]?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeAndRestore();
        return;
      }

      if (event.key !== "Tab") return;

      /* The panel covers the page while it is open, so focus stays in it. The
         trigger is part of the loop: it is how the reader gets out. */
      const items = [toggleRef.current, ...focusable()].filter(Boolean) as HTMLElement[];
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className={`${styles.wrap} ${open ? styles.isOpen : ""}`}>
      <button
        ref={toggleRef}
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((wasOpen) => !wasOpen)}
      >
        {open ? "Close" : "Menu"}
        <span aria-hidden="true" className={styles.icon} />
      </button>

      <div id={panelId} ref={panelRef} className={styles.menuPanel} hidden={!open}>
        <Container>
          <ul className={styles.list}>
            {primaryNav.flatMap((entry) =>
              isNavGroup(entry)
                ? entry.children.map((item) => (
                    <li key={item.href} className={styles.row}>
                      <NavLink
                        href={item.href}
                        label={item.label}
                        className={styles.rowLink}
                        onNavigate={close}
                      />
                    </li>
                  ))
                : [
                    <li key={entry.href} className={styles.row}>
                      <NavLink
                        href={entry.href}
                        label={entry.label}
                        className={styles.rowLink}
                        onNavigate={close}
                      />
                    </li>,
                  ],
            )}
          </ul>
          <div className={styles.ctaRow}>
            <Button href={primaryCta.href} placement="mobile-menu">
              {primaryCta.label}
            </Button>
          </div>
        </Container>
      </div>
    </div>
  );
}
