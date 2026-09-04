import { Button, Container } from "@/components/foundation";
import { isNavGroup, primaryCta, primaryNav } from "@/lib/content/navigation";

import { MobileMenu } from "./MobileMenu";
import { NavDropdown } from "./NavDropdown";
import { Wordmark } from "./Wordmark";
import styles from "./SiteHeader.module.css";

/**
 * The site navigation landmark. 64px desktop, 60px mobile, sticky against a
 * paper background with a single 1px bottom rule.
 *
 * There is one navigation landmark. The desktop row and the mobile disclosure
 * are two presentations inside it, only ever one of them displayed, rather than
 * two separately labelled landmarks competing in the accessibility tree.
 */
export function SiteHeader() {
  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.bar}>
          <Wordmark />

          <nav aria-label="Primary" className={styles.nav}>
            <div className={styles.desktopRow}>
              {primaryNav.map((entry) =>
                isNavGroup(entry) ? (
                  <NavDropdown key={entry.label} label={entry.label} items={entry.children} />
                ) : (
                  <a key={entry.href} href={entry.href} className={styles.link}>
                    {entry.label}
                  </a>
                ),
              )}
              <Button href={primaryCta.href}>{primaryCta.label}</Button>
            </div>

            <MobileMenu />
          </nav>
        </div>
      </Container>
    </header>
  );
}
