"use client";

import { useEffect, useId, useState } from "react";

import { Button, Container } from "@/components/foundation";
import { isNavGroup, primaryCta, primaryNav } from "@/lib/content/navigation";

import styles from "./MobileMenu.module.css";

/**
 * The mobile navigation disclosure.
 *
 * The trigger is a real button with `aria-expanded` and the panel stays in the
 * document, toggled with the `hidden` attribute. Without JavaScript the button
 * is hidden and the panel renders open, so navigation is never stranded behind
 * a control that cannot run.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  /* Escape closes the menu, which is the expected way out of an expanded
     overlay for a keyboard user. */
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className={`${styles.wrap} ${open ? styles.isOpen : ""}`}>
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((wasOpen) => !wasOpen)}
      >
        {open ? "Close" : "Menu"}
        <span aria-hidden="true" className={styles.icon} />
      </button>

      <div id={panelId} className={styles.menuPanel} hidden={!open}>
        <Container>
          <ul className={styles.list}>
            {primaryNav.flatMap((entry) =>
              isNavGroup(entry)
                ? entry.children.map((item) => (
                    <li key={item.href} className={styles.row}>
                      <a
                        href={item.href}
                        className={styles.rowLink}
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))
                : [
                    <li key={entry.href} className={styles.row}>
                      <a
                        href={entry.href}
                        className={styles.rowLink}
                        onClick={() => setOpen(false)}
                      >
                        {entry.label}
                      </a>
                    </li>,
                  ],
            )}
          </ul>
          <div className={styles.ctaRow}>
            <Button href={primaryCta.href}>{primaryCta.label}</Button>
          </div>
        </Container>
      </div>
    </div>
  );
}
