import { audiences } from "@/lib/content/audiences";
import { listedGuides } from "@/lib/content/guides";

/**
 * Every route that should be indexed, in one place.
 *
 * The sitemap is generated from this, so a page cannot be indexed but missing
 * from the sitemap, or listed in the sitemap while carrying a noindex tag.
 * Anything deliberately excluded is listed below with the reason.
 *
 * Not indexable, and therefore not here:
 *   /get-started  — an intake form, nothing to find
 *   /privacy      — a notice, not the policy
 *   /terms        — a notice, not the terms
 *   /styleguide   — internal
 *   placeholder guides — not reviewed guidance
 */
export function indexableRoutes(): string[] {
  return [
    "/",
    "/how-it-works",
    "/who-its-for",
    ...audiences.map((audience) => `/who-its-for/${audience.slug}`),
    "/pricing",
    "/guides",
    /* listedGuides already drops placeholders in a production build. */
    ...listedGuides()
      .filter((guide) => guide.status === "reviewed")
      .map((guide) => `/guides/${guide.slug}`),
    "/about",
    "/contact",
  ];
}
