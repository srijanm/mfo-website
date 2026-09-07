import { audiences } from "@/lib/content/audiences";

/**
 * Every route that should be indexed, in one place.
 *
 * The sitemap is generated from this, so a page cannot be indexed but missing
 * from the sitemap, or listed in the sitemap while carrying a noindex tag.
 * Anything deliberately excluded is listed below with the reason.
 *
 * Not indexable, and therefore not here:
 *   /get-started  — an intake form, nothing to find
 *   /guides       — built and reachable, noindexed until it has real content
 *   /privacy      — a notice, not the policy
 *   /terms        — a notice, not the terms
 */
export function indexableRoutes(): string[] {
  return [
    "/",
    ...audiences.map((audience) => `/${audience.slug}`),
    "/pricing",
    "/how-we-work",
    "/contact",
  ];
}
