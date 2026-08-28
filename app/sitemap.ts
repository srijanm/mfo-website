import type { MetadataRoute } from "next";

import { indexableRoutes } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site-url";

/** Generated from the one route list, so it cannot drift from what is indexed. */
export default function sitemap(): MetadataRoute.Sitemap {
  return indexableRoutes().map((route) => ({
    url: absoluteUrl(route),
    changeFrequency: "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
