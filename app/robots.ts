import type { MetadataRoute } from "next";

import { absoluteUrl, isProductionDeployment } from "@/lib/site-url";

/**
 * Previews and local builds are closed to crawlers entirely. Only a production
 * deployment invites indexing, and only there does a sitemap make sense.
 */
export default function robots(): MetadataRoute.Robots {
  if (!isProductionDeployment()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/get-started", "/styleguide"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
