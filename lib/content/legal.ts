// /privacy and /terms.
//
// No approved policy text exists, and a privacy policy or terms of service is a
// legal document with consequences for the business and the reader. Nothing
// here drafts one. Each page states plainly that the document is being prepared
// and gives a route to a person.

import { primaryCta } from "./navigation";

export type LegalPage = {
  slug: string;
  title: string;
  headline: string;
  body: string;
  /** The published document, once it exists. Rendered instead of the notice. */
  document: string | null;
};

const PENDING_BODY =
  "This document is being prepared and will be published here before launch. If you need to know how we handle your information, or on what terms we work, ask us and we will tell you directly.";

export const legalPages: readonly LegalPage[] = [
  {
    slug: "privacy",
    title: "Privacy",
    headline: "Privacy policy.",
    body: PENDING_BODY,
    document: null,
  },
  {
    slug: "terms",
    title: "Terms",
    headline: "Terms of service.",
    body: PENDING_BODY,
    document: null,
  },
];

/**
 * Whether a real approved document has been supplied for a slug.
 *
 * The site links to a legal page only when this is true. While `document` is
 * null the page still exists and still says plainly that the document is being
 * prepared — but nothing else on the site points at it as though it were an
 * answer, because it is not one yet.
 */
export function legalPublished(slug: string): boolean {
  return Boolean(legalPageBySlug(slug)?.document);
}

export function legalPageBySlug(slug: string): LegalPage | undefined {
  return legalPages.find((page) => page.slug === slug);
}

export const legalContact = {
  prompt: "Ask us directly.",
  href: "/contact",
  label: "Get in touch",
  altHref: primaryCta.href,
  altLabel: primaryCta.label,
} as const;
