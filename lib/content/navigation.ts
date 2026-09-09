// Navigation and footer content. Kept out of components per CLAUDE.md rule 3.

export const site = {
  name: "MyFinanceOfficer",
  descriptor: "A modern CA firm for modern professions",
} as const;

/**
 * Every primary action on the site routes here, under one label.
 *
 * The site previously used four wordings for the same destination — "See what
 * I need", "Get started", "Find the right plan", "Tell us how you earn" — which
 * made adjacent buttons look like different offers. One label, everywhere.
 */
export const primaryCta = {
  href: "/get-started",
  label: "Tell us how you earn",
} as const;

/**
 * The sentence that sits near a prominent conversion point. It says what
 * happens next and what does not: a person reviews the enquiry, and nothing is
 * committed to until scope and fee are agreed. It promises no turnaround,
 * because none has been approved.
 */
export const conversionAssurance =
  "We’ll review your situation and explain the relevant scope and fee before you commit.";

/** The enquiry link, carrying which page it was pressed on as context. */
export function enquiryHref(from?: string): string {
  return from ? `${primaryCta.href}?from=${from}` : primaryCta.href;
}

export type NavItem = {
  href: string;
  label: string;
};

export type NavEntry = NavItem | { label: string; children: readonly NavItem[] };

export function isNavGroup(entry: NavEntry): entry is { label: string; children: readonly NavItem[] } {
  return "children" in entry;
}

/** The three audience pages, at their top-level URLs. */
export const audienceNav: readonly NavItem[] = [
  { href: "/paid-from-abroad", label: "Paid from abroad" },
  { href: "/freelancers", label: "Freelancers and consultants" },
  { href: "/creators", label: "Creators" },
] as const;

/**
 * Final nav: Who it's for (dropdown, 3 items) · Pricing · How we work, then
 * the primary CTA. Guides stays built but out of the nav until it has real
 * content.
 */
export const primaryNav: readonly NavEntry[] = [
  { label: "Who it's for", children: audienceNav },
  { href: "/pricing", label: "Pricing" },
  { href: "/how-we-work", label: "How we work" },
] as const;

export type FooterColumn = {
  id: string;
  title: string;
  links: readonly NavItem[];
};

export const footerColumns: readonly FooterColumn[] = [
  {
    /* "Product" is software-company language. This is a CA firm. */
    id: "services",
    title: "Services",
    links: [
      { href: "/pricing", label: "Pricing" },
      { href: "/how-we-work", label: "How we work" },
    ],
  },
  {
    id: "audience",
    title: "Who it's for",
    links: audienceNav,
  },
  {
    id: "company",
    title: "Company",
    links: [
      { href: primaryCta.href, label: "Start an enquiry" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    id: "legal",
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
] as const;

/**
 * Registered entity and registration details are owner-supplied. Left null
 * rather than invented; the footer renders the line only once it is populated.
 */
export const legalEntity: { registeredName: string; registrationLine: string } | null = null;

/** Year the site went live, for the footer notice. Not a date with tax meaning. */
export const copyrightSince = 2026;

/**
 * The homepage's own index, for the page rail.
 *
 * Each id is a DOM id a section on the homepage actually declares, and each
 * label is the name of the idea that section states in words. The rail renders
 * only on pages that declare an index, so it never appears somewhere these ids
 * do not exist.
 */
export const sectionIndex = [
  { id: "recognition-headline", label: "Who it's for" },
  { id: "core-scope-headline", label: "What we run" },
  { id: "income-axis", label: "As things change" },
  { id: "latent-problem", label: "Why it matters" },
  { id: "pricing", label: "Pricing" },
  { id: "final-cta", label: "Start an enquiry" },
] as const;
