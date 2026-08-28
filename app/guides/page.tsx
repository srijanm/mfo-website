import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/foundation";
import { guidesIndex, listedGuides } from "@/lib/content/guides";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: guidesIndex.title,
  description: guidesIndex.lead,
};

/**
 * The guides index. A knowledge library: ruled article rows, never a card
 * mosaic.
 *
 * Placeholder posts are excluded from a production build, so nobody arrives at
 * one by browsing. Their routes still resolve, and each carries a notice and a
 * noindex tag.
 */
export default function GuidesPage() {
  const guides = listedGuides();

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
              {guide.audience || guide.lastReviewed || guide.status === "placeholder" ? (
                <p className={styles.meta}>
                  {[
                    guide.status === "placeholder" ? guidesIndex.placeholder.label : null,
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
