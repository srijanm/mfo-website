import Link from "next/link";

import { site } from "@/lib/content/navigation";

import styles from "./Wordmark.module.css";

/** Text wordmark. No decorative lockup — the name is set in the one family. */
export function Wordmark() {
  return (
    <Link href="/" className={styles.wordmark}>
      {site.name}
    </Link>
  );
}
