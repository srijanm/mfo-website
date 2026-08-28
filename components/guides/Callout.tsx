import type { ReactNode } from "react";

import styles from "./GuideArticle.module.css";

type CalloutProps = {
  label: string;
  children: ReactNode;
};

/** A ruled callout: two rules and a label, never a tinted box. */
export function Callout({ label, children }: CalloutProps) {
  return (
    <aside className={styles.callout}>
      <p className={styles.calloutLabel}>{label}</p>
      <div className={styles.calloutBody}>{children}</div>
    </aside>
  );
}
