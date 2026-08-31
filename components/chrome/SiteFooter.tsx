import { Container } from "@/components/foundation";
import {
  copyrightSince,
  footerColumns,
  legalEntity,
  site,
} from "@/lib/content/navigation";
import { cx } from "@/lib/cx";

import styles from "./SiteFooter.module.css";

/**
 * The footer landmark. Also the reason the site stays navigable without
 * JavaScript: every primary destination appears here as a plain link.
 */
export function SiteFooter() {
  return (
    <footer className={cx("container-rule", styles.footer)}>
      <Container>
        <nav aria-label="Footer" className={styles.columns}>
          {footerColumns.map((column) => (
            <div key={column.id}>
              <h2 className={styles.title}>{column.title}</h2>
              <ul className={styles.list}>
                {column.links.map((link) => (
                  <li key={link.href} className={styles.item}>
                    <a href={link.href} className={styles.link}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className={styles.base}>
          <p className={styles.baseLine}>
            {site.name}. {site.descriptor}.
          </p>
          {legalEntity ? <p className={styles.baseLine}>{legalEntity.registrationLine}</p> : null}
          <p className={styles.baseLine}>&copy; {copyrightSince}</p>
        </div>
      </Container>
    </footer>
  );
}
