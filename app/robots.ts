import type { MetadataRoute } from "next";

import { absoluteUrl, isIndexable } from "@/lib/site-url";

/**
 * Closed to crawlers unless indexing has been explicitly turned on. Being live
 * and being indexable are separate decisions: the site is shareable now, and
 * invites crawlers only once SITE_INDEXABLE is set.
 */
export default function robots(): MetadataRoute.Robots {
  if (!isIndexable()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/get-started"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
