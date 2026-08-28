// Pricing content. Every rupee figure originates here, never in a component.

import { primaryCta } from "./navigation";
import { pricingPoints } from "./site-content";

/**
 * Indian formatting, so 19999 renders with the grouping a reader expects.
 * Built once rather than per call.
 */
const annualPriceFormat = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatAnnualPrice(amount: number): string {
  return annualPriceFormat.format(amount);
}

export type PricingContent = {
  /** Omitted where the page hero already carries the proposition. */
  headline?: string;
  intro?: string;
  points: readonly number[];
  perYear: string;
  planLabel: string;
  scopeLine: string;
  cta: { href: string; label: string };
  closing: string;
};

export const pricing = {
  headline: "The price is on the site before we speak.",
  intro:
    "There are three annual price points. The right one depends on the CA and compliance work you need and whether broader financial support is relevant.",

  /** The three exact annual price points, in order. */
  points: pricingPoints,

  perYear: "/ year",
  planLabel: "Annual plan",
  scopeLine: "Your exact scope is confirmed before you sign up.",

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
    cta: pricing.cta,
    closing: pricing.closing,
  } satisfies PricingContent,

  /** The pricing objections, selected from the approved FAQ set. */
  faqIds: ["not-enough-yet", "cheaper", "broader-support"] as const,
} as const;
