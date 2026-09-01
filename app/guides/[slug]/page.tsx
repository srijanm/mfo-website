import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

import { Container, TextLink } from "@/components/foundation";
import { cx } from "@/lib/cx";
import { Callout } from "@/components/guides/Callout";
import {
  guideBySlug,
  guideHeadings,
  guideSlugs,
  guidesIndex,
  shouldShowToc,
} from "@/lib/content/guides";
import { pageMetadata } from "@/lib/metadata";

import styles from "@/components/guides/GuideArticle.module.css";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return guideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = guideBySlug(slug);

  if (!guide) return {};

  const metadata = pageMetadata({
    title: guide.title,
    description: guide.answer,
    path: `/guides/${guide.slug}`,
    /* A placeholder is never indexed. It is not reviewed guidance and must not
       be found by anyone searching for an answer. */
    noIndex: guide.status === "placeholder",
  });

  return guide.status === "placeholder"
    ? { ...metadata, robots: { index: false, follow: false } }
    : {
        ...metadata,
        openGraph: { ...metadata.openGraph, type: "article" },
      };
}

/** Anchors so the table of contents can reach each section. */
function headingId(children: unknown): string {
  return String(children)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const mdxComponents = {
  Callout,
  h2: (props: { children?: React.ReactNode }) => (
    <h2 id={headingId(props.children)}>{props.children}</h2>
  ),
};

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = guideBySlug(slug);

  if (!guide) notFound();

  const headings = guideHeadings(guide.body);
  const showToc = shouldShowToc(guide.body);

  return (
    <Container className={styles.page}>
      <div className={cx("rule-grid", "rule-grid--8-4", styles.layout)}>
        <article className={styles.article}>
        {/* First in the document, so it cannot be scrolled past or missed. */}
        {guide.status === "placeholder" ? (
          <div className={styles.placeholder}>
            <p className={styles.placeholderLabel}>{guidesIndex.placeholder.label}</p>
            <p className={styles.placeholderBody}>{guidesIndex.placeholder.body}</p>
          </div>
        ) : null}

        <h1 className={styles.title}>{guide.title}</h1>
        <p className={styles.answer}>{guide.answer}</p>

        {guide.published || guide.lastReviewed ? (
          <div className={styles.meta}>
            {guide.published ? (
              <span>
                {guidesIndex.publishedLabel} {guide.published}
              </span>
            ) : null}
            {guide.lastReviewed ? (
              <span>
                {guidesIndex.lastReviewedLabel} {guide.lastReviewed}
              </span>
            ) : null}
          </div>
        ) : null}

        <div className={styles.body}>
          <MDXRemote source={guide.body} components={mdxComponents} />
        </div>

        <div className={styles.back}>
          <TextLink href="/guides">All guides</TextLink>
        </div>
        </article>

        {/* The rail carries the right four columns. It follows the article in
            the document, so the placeholder notice and the H1 are still the
            first things read. */}
        <div className={styles.rail}>
          {showToc ? (
            <nav className={styles.toc} aria-label={guidesIndex.tocLabel}>
              <p className={styles.tocLabel}>{guidesIndex.tocLabel}</p>
              <ul className={styles.tocList}>
                {headings.map((heading) => (
                  <li key={heading.id}>
                    <Link href={`#${heading.id}`}>{heading.text}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
      </div>
    </Container>
  );
}
