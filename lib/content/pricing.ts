// Pricing content. Every rupee figure originates here, never in a component.

import type { FaqItem } from "./homepage";
import { primaryCta } from "./navigation";
import { pricingPoints } from "./site-content";

/* Re-exported so the shared formatter has one definition and callers keep one
   import path. Every price on the site goes through it. */
export { formatAnnualPrice } from "./format";

export type PricingBlock = {
  title: string;
  rows: readonly { id: string; title: string; body: string }[];
};

export type PricingContent = {
  /** Omitted where the page hero already carries the proposition. */
  headline?: string;
  intro?: string;
  points: readonly number[];
  perYear: string;
  planLabel: string;
  cta: { href: string; label: string };
  closing: string;
  /**
   * What a visitor can establish from the page alone, and what only follows
   * from a person reading their situation. Optional, because the compact
   * pricing block on an audience page states the figures and links onward
   * rather than explaining the arrangement in full.
   */
  knownNow?: PricingBlock;
  afterReview?: PricingBlock;
};

/**
 * The homepage pricing section. Rule 2 of CLAUDE.md keeps `approvedPlanScope`
 * null: the tiers are price-first and carry no scope area of any kind until a
 * reviewed mapping exists. Nothing here may hint at which tier includes what.
 */
export const pricing = {
  headline: "Transparent pricing without any nasty surprises.",
  intro:
    "There are three annual price points. The right one depends on the CA and compliance work you need and whether broader financial support is relevant.",

  /** The three exact annual price points, in order. */
  points: pricingPoints,

  perYear: "/ year",

  /**
   * These are fee levels, not three named plans a visitor picks between.
   * `approvedPlanScope` is null — no reviewed mapping of price to inclusions
   * exists — so the label says what is actually true of all three rather than
   * implying a difference nobody has defined.
   */
  planLabel: "Annual fee level",

  cta: { href: primaryCta.href, label: primaryCta.label },

  /**
   * What a visitor can know now, and what is confirmed after we have read their
   * situation. This replaced a line that dismissed comparison tables without
   * explaining the offer — telling someone what you are not going to show them
   * is not the same as telling them anything.
   */
  knownNow: {
    title: "What you can know before you talk to us",
    rows: [
      {
        id: "levels",
        title: "The three annual figures on this page.",
        body: "One fee for the year. Not an estimate, and not a headline number that grows.",
      },
      {
        id: "categories",
        title: "The categories of work we run.",
        body: "Listed below. Which of them apply to you depends on your facts.",
      },
      {
        id: "process",
        title: "How the fee is settled.",
        body: "You describe your situation, we put the scope and the fee in writing, and you decide.",
      },
    ],
  },

  afterReview: {
    title: "What we confirm after reading your situation",
    rows: [
      {
        id: "which-level",
        title: "Which of the three applies to you.",
        body: "It follows from the work you actually need, not from a tier you select.",
      },
      {
        id: "scope",
        title: "What that fee covers, in writing.",
        body: "Including the parts that don’t apply to you yet, and what would change that.",
      },
    ],
  },

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
  headline: "And when something else comes up",
  label: "Additional financial support",
  body:
    "Tax and compliance are what we run all year. Because we already understand how you earn, some plans can also include help with adjacent decisions — FX, insurance, loans, wealth planning, MIS. They sit around the core relationship and are used when they’re relevant.",
} as const;

/* ------------------------------------------------------- /pricing page */

/**
 * The pricing page, per the final structure doc: hero, the three tiers, what
 * the fee covers (the core scope rows, unchanged from the homepage), how the
 * scope gets agreed, Layer B after all of that, then questions and the close.
 */
export const pricingPage = {
  headline: "Three annual prices. The scope is agreed before you start.",
  lead: "One fee for the year, agreed in writing before anything starts. Which of the three applies follows from the work you actually need.",

  tiers: {
    points: pricingPoints,
    perYear: "/ year",
    planLabel: "Annual fee level. Your exact scope is confirmed before you sign up.",
    cta: pricing.cta,
    closing:
      "We tell you which plan fits before you commit. If you don’t need the broader scope, we don’t pretend you do.",
  } satisfies PricingContent,

  feeCovers: {
    label: "Core CA and compliance",
    title: "What the fee covers",
  },

  scopeAgreed: {
    label: "Before you pay anything",
    title: "How your scope gets agreed",
    steps: [
      {
        id: "tell-us",
        title: "You tell us how you earn.",
        body: "Where the money comes from, how it reaches you, how many clients, what’s already been set up.",
      },
      {
        id: "what-applies",
        title: "We tell you what applies.",
        body: "Including the parts that don’t apply yet, and what would change that.",
      },
      {
        id: "in-writing",
        title: "You get the scope and the fee in writing.",
        body: "One number for the year, and a list of what it covers.",
      },
      {
        id: "you-decide",
        title: "You decide.",
        body: "If the honest answer is that you don’t need us yet, that’s what we’ll have told you at step two.",
      },
    ],
  },

  questions: [
    {
      id: "cheaper",
      question: "Is this cheaper than a normal CA?",
      answer:
        "Not necessarily. It’s fixed, and you know it before you start. The common complaint in this market is surprise, not price.",
    },
    {
      id: "less-than-lowest",
      question: "What if I need less than the lowest plan?",
      answer:
        "Then we’ll tell you. The version of us that says “come back later” is the one worth coming back to.",
    },
    {
      id: "why-annual",
      question: "Why one annual fee instead of paying per filing?",
      answer:
        "Because the work that matters happens between the filings. Paying per filing means nobody is paid to warn you about anything.",
    },
    {
      id: "not-included",
      question: "What isn’t included?",
      answer: "We’ll tell you before you sign up, in writing, rather than after.",
    },
  ] as readonly FaqItem[],
} as const;
