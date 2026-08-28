import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/foundation";
import { guides, guidesIndex } from "@/lib/content/guides";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: guidesIndex.title,
  description: guidesIndex.lead,
  robots: guides.length > 0 ? undefined : { index: false, follow: true },
};

/**
 * The guides index.
 *
 * Built now because the header and footer both link here, and a dead link in
 * the navigation is the kind of thing that survives to launch. Ruled rows, no
 * card mosaic. Empty until guides are written and reviewed.
 */
export default function GuidesPage() {
  return (
    <Container className={styles.page}>
      <h1 className={styles.title}>{guidesIndex.title}</h1>
      <p className={styles.lead}>{guidesIndex.lead}</p>

      {guides.length > 0 ? (
        <ul className={styles.rows}>
          {guides.map((guide) => (
            <li key={guide.slug} className={styles.row}>
              <h2 className={styles.rowTitle}>
                <Link href={`/guides/${guide.slug}`}>{guide.title}</Link>
              </h2>
              <p className={styles.answer}>{guide.answer}</p>
              {guide.audience || guide.lastReviewed ? (
                <p className={styles.meta}>
                  {[
                    guide.audience,
                    guide.lastReviewed
                      ? `${guidesIndex.lastReviewedLabel} ${guide.lastReviewed}`
                      : null,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.pending}>{guidesIndex.pending}</p>
      )}
    </Container>
  );
}
