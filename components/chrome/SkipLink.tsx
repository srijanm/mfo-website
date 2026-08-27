import styles from "./SkipLink.module.css";

/** First focusable element on every page, per §30. */
export function SkipLink() {
  return (
    <a className={styles.link} href="#main">
      Skip to content
    </a>
  );
}
