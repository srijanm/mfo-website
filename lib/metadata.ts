import type { Metadata } from "next";

import { site } from "@/lib/content/navigation";
import { absoluteUrl, isIndexable } from "@/lib/site-url";

type PageMetadataInput = {
  title: string;
  description: string;
  /** Route path, used for the canonical URL. */
  path: string;
  /** Pages that should not be indexed: intake, legal notices, placeholders. */
  noIndex?: boolean;
};

/**
 * One place that builds a page's title, description, canonical URL and social
 * tags, so a new page cannot ship with three of the four.
 */
export function pageMetadata({
  title,
  description,
  path,
  noIndex = false,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = `${title} — ${site.name}`;

  /* Declared explicitly rather than inherited: a page that sets its own
     openGraph block replaces the parent's, which silently drops the
     file-based image on every route but the homepage. */
  const image = absoluteUrl("/opengraph-image");

  return {
    title,
    description,
    alternates: { canonical: url },
    /* A page is indexable only if it is individually indexable AND the site as
       a whole has been opted in. */
    robots: noIndex || !isIndexable() ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "website",
      siteName: site.name,
      title: fullTitle,
      description,
      url,
      locale: "en_IN",
      images: [{ url: image, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  };
}
