// Navigation and footer content. Kept out of components per CLAUDE.md rule 3.

export const site = {
  name: "MyFinanceOfficer",
  descriptor: "A modern CA firm for modern professions",
} as const;

/** Every primary action on the site routes here — CLAUDE.md rule 9. */
export const primaryCta = {
  href: "/get-started",
  label: "See what I need",
} as const;

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
    id: "product",
    title: "Product",
    links: [
      { href: "/pricing", label: "Pricing" },
      { href: primaryCta.href, label: "Get started" },
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
      { href: "/how-we-work", label: "How we work" },
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
  { id: "latent-problem", label: "What goes wrong" },
  { id: "structural-mismatch", label: "The mismatch" },
  { id: "income-axis", label: "As things change" },
  { id: "core-scope-headline", label: "What we run" },
  { id: "trust-ledger", label: "Before we file" },
  { id: "pricing", label: "Pricing" },
  { id: "final-cta", label: "Get started" },
] as const;
