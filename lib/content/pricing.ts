// Pricing content. Every rupee figure originates here, never in a component.

import { primaryCta } from "./navigation";
import { pricingPoints } from "./site-content";

/* Re-exported so the shared formatter has one definition and callers keep one
   import path. Every price on the site goes through it. */
export { formatAnnualPrice } from "./format";

export type PricingContent = {
  /** Omitted where the page hero already carries the proposition. */
  headline?: string;
  intro?: string;
  points: readonly number[];
  perYear: string;
  planLabel: string;
  /**
   * What the tier includes.
   *
   * PLACEHOLDER — NEEDS OWNER SIGN-OFF. Rule 2 of CLAUDE.md keeps
   * `approvedPlanScope` null and forbids stating which tier includes which
   * feature, so nothing here may be filled in without a reviewed mapping. The
   * copy owner asked for a visible marker in the meantime; `scopePlaceholder`
   * is what makes it render as one rather than as finished copy.
   */
  scopeLine: string;
  scopePlaceholder?: boolean;
  cta: { href: string; label: string };
  closing: string;
};

export const pricing = {
  headline: "Transparent pricing without any nasty surprises.",
  intro:
    "There are three annual price points. The right one depends on the CA and compliance work you need and whether broader financial support is relevant.",

  /** The three exact annual price points, in order. */
  points: pricingPoints,

  perYear: "/ year",
  planLabel: "Annual plan",
  scopeLine: "Placeholder — what needs to be included",
  scopePlaceholder: true,

  cta: { href: primaryCta.href, label: "Find the right plan" },

  closing:
    "We tell you which plan fits before you commit. If you do not need the broader scope, we do not pretend you do.",

  /** Column headings for the comparison matrix, once a mapping exists. */
  comparisonHeadings: {
    area: "Area",
    included: "Included",
    notIncluded: "—",
  },
} as const satisfies PricingContent & { comparisonHeadings: unknown };

/* ------------------------------------------------------------------ H11 */

export const additionalSupportSection = {
  headline: "And when something else comes up.",
  body:
    "Tax and compliance are the part we run all year. Because we already understand how you earn, some plans can also include help with adjacent financial decisions.",
} as const;

/* ------------------------------------------------------- /pricing page */

/**
 * The pricing page. Its hero states the proposition, so the tier block passes
 * no headline of its own — the same PricingSection, one less repetition.
 *
 * The FAQ reuses the questions from the homepage set that are pricing
 * objections rather than writing new ones, and the closing CTA reuses the
 * approved final-CTA copy with the label §22 names for this page.
 */
export const pricingPage = {
  headline: "Three annual prices. The scope is agreed before you start.",
  lead: pricing.intro,

  tiers: {
    points: pricing.points,
    perYear: pricing.perYear,
    planLabel: pricing.planLabel,
    scopeLine: pricing.scopeLine,
    scopePlaceholder: pricing.scopePlaceholder,
    cta: pricing.cta,
    closing: pricing.closing,
  } satisfies PricingContent,

  /** The pricing objections, selected from the approved FAQ set. */
  faqIds: ["not-enough-yet", "cheaper", "broader-support"] as const,
} as const;
