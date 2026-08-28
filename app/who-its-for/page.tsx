import type { Metadata } from "next";
import Link from "next/link";

import { Container, Grid } from "@/components/foundation";
import { FinalCtaSection } from "@/components/shared";
import { audienceIndex, audiences } from "@/lib/content/audiences";
import { finalCta } from "@/lib/content/homepage";
import { pageMetadata } from "@/lib/metadata";

import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Who it's for",
  description: audienceIndex.headline,
  path: "/who-its-for",
});

/** Four ruled audience rows, each linking to its own page. */
export default function WhoItsForPage() {
  return (
    <>
      <Container className={styles.page}>
        <Grid>
          <h1 className={styles.headline}>{audienceIndex.headline}</h1>

          <ul className={styles.rows}>
            {audiences.map((audience) => (
              <li key={audience.slug} className={styles.row}>
                <Link href={`/who-its-for/${audience.slug}`} className={styles.link}>
                  <h2 className={styles.name}>{audience.name}</h2>
                  <p className={styles.summary}>{audience.summary}</p>
                  <span aria-hidden="true" className={styles.arrow}>
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Grid>
      </Container>

      <FinalCtaSection content={finalCta} />
    </>
  );
}
