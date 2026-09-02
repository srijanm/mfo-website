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

export const primaryNav: readonly NavItem[] = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/who-its-for", label: "Who it's for" },
  { href: "/pricing", label: "Pricing" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
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
      { href: "/how-it-works", label: "How it works" },
      { href: "/pricing", label: "Pricing" },
      { href: primaryCta.href, label: "Get started" },
    ],
  },
  {
    id: "audience",
    title: "Who it's for",
    links: [
      { href: "/who-its-for/foreign-income", label: "Paid from abroad" },
      { href: "/who-its-for/freelancers-consultants", label: "Freelancers and consultants" },
      { href: "/who-its-for/creators", label: "Creators" },
      { href: "/who-its-for/independent-professionals", label: "Independent professionals" },
    ],
  },
  {
    id: "learn",
    title: "Learn",
    links: [{ href: "/guides", label: "Guides" }],
  },
  {
    id: "company",
    title: "Company",
    links: [
      { href: "/about", label: "About" },
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
 * Each id is a DOM id a section already carries, and each label is the name of
 * the idea that section states in words. The rail renders only on pages that
 * declare an index, so it never appears somewhere these ids do not exist.
 */
export const sectionIndex = [
  { id: "latent-problem", label: "What goes wrong" },
  { id: "structural-mismatch", label: "The mismatch" },
  { id: "income-axis", label: "As things change" },
  { id: "operating-model", label: "How we work" },
  { id: "temporal-ledger", label: "The year" },
  { id: "core-scope-headline", label: "What we run" },
  { id: "trust-ledger", label: "Before we file" },
  { id: "pricing", label: "Pricing" },
  { id: "final-cta", label: "Get started" },
] as const;
