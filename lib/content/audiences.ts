// The /who-its-for family. One content object per audience; one template.

import { hero as homepageHero } from "./homepage";
import type { ReviewedFact } from "./reviewed";

/**
 * A shared block a page can carry, in the order its spec lists it.
 *
 * Every one of these renders approved content that already exists elsewhere on
 * the site, so an audience page cannot state anything the homepage does not.
 * "additional-support" is Layer B and appears only where a spec asks for it.
 */
export type AudienceBlock =
  | "checklist"
  | "core-scope"
  | "calendar"
  | "axis"
  | "topic-faq"
  | "additional-support";

export type AudienceRecord = {
  amount: string;
  from: string;
  /** Evaluated per render — see homepage.ts paymentExample.received. */
  received: () => string;
  into: string;
  frequency: string;
  indianPayroll: string;
  indiaSideSetup: string;
  note: string;
};

export type AudienceSection = {
  id: string;
  title: string;
  /**
   * Body copy for a section the spec names but does not write. Typed as a
   * reviewed fact because these topics — registrations, GST, documentation,
   * structure, how an arrangement differs from Indian payroll — cannot be
   * described without describing tax. Null until written and signed off; the
   * template omits what is not written.
   */
  body: ReviewedFact | null;
};

export type Audience = {
  slug: string;
  /** Row label and link text on the hub. */
  name: string;
  /** One-line description on the hub. */
  summary: string;
  headline: string;
  lead: string | null;
  record: AudienceRecord | null;
  /** A ruled list of what we ask about. Structure, not tax content. */
  checklist: { title: string; items: readonly string[] } | null;
  /** Shared blocks, rendered in this order between the hero and pricing. */
  blocks: readonly AudienceBlock[];
  /** Questions for the topic-specific accordion. */
  topicFaq: { title: string; ids: readonly string[] } | null;
  /** Questions for the general accordion below pricing. */
  generalFaqIds: readonly string[];
  /** Spec sections still waiting on reviewed copy. */
  sections: AudienceSection[];
};

const pending = (...titles: [string, string][]): AudienceSection[] =>
  titles.map(([id, title]) => ({ id, title, body: null }));

export const audiences: readonly Audience[] = [
  {
    slug: "foreign-income",
    name: "Paid by overseas businesses",
    summary:
      "Foreign contracts, overseas employers or platforms where the India side still needs its own answer.",
    headline: "Paid from abroad. Still living and filing here.",
    lead: "The fact that money arrives every month — or even comes with a payslip — does not mean an Indian employer is handling the India side for you.",
    record: {
      ...homepageHero.paymentExample,
      note: homepageHero.paymentAnnotation,
    },
    /* Spec section 2. These are the things we ask about, not conclusions we
       draw, so they can be published as written. */
    checklist: {
      title: "What we need to understand",
      items: [
        "Who pays you",
        "What the contract says",
        "Where the work is performed",
        "How the money arrives",
        "What documentation already exists",
      ],
    },
    /* Sections 2, 3, 4 then 5 — FX first appears in additional-support, and
       nothing before it names a Layer B service. */
    blocks: ["checklist", "core-scope", "topic-faq", "additional-support"],
    topicFaq: {
      title: "Questions people actually ask",
      ids: ["payslip-abroad", "family-ca", "filing-software"],
    },
    generalFaqIds: ["not-enough-yet", "cheaper", "ai", "broader-support"],
    sections: pending(["differs", "How the arrangement differs from Indian payroll"]),
  },
  {
    slug: "freelancers-consultants",
    name: "Freelancers and consultants",
    summary: "A few recurring clients and a business that may not feel like a business yet.",
    headline: "A few clients can still create a whole year of obligations.",
    lead: null,
    record: null,
    checklist: null,
    /* First income and income growth on the axis, the year on the calendar,
       invoices, registrations and proof of income in the core scope. */
    blocks: ["axis", "calendar", "core-scope"],
    topicFaq: null,
    generalFaqIds: ["not-enough-yet", "family-ca", "filing-software", "cheaper"],
    sections: pending(
      ["invoices", "Invoices"],
      ["proof", "Proof of income"],
    ),
  },
  {
    slug: "creators",
    name: "Creators",
    summary: "Brand income, platforms, barter and multiple kinds of receipts.",
    headline: "Your income can come from more places than a normal CA workflow expects.",
    lead: null,
    record: null,
    checklist: null,
    blocks: ["core-scope", "calendar"],
    topicFaq: null,
    generalFaqIds: ["not-enough-yet", "family-ca", "filing-software", "ai"],
    sections: pending(
      ["platform-brand", "Platform and brand income"],
      ["non-cash", "Cash and non-cash receipts"],
      ["records", "Records"],
      ["gst-tax", "GST and tax"],
    ),
  },
  {
    slug: "independent-professionals",
    name: "Independent professionals",
    summary:
      "Doctors, lawyers and other service professionals whose income arrives directly from clients.",
    headline: "Professional income without an employer doing the back office.",
    lead: null,
    record: null,
    checklist: null,
    blocks: ["core-scope", "calendar", "axis"],
    topicFaq: null,
    generalFaqIds: ["not-enough-yet", "family-ca", "cheaper", "ai"],
    sections: pending(
      ["how-income-arrives", "How income arrives"],
      ["documentation", "Documentation"],
    ),
  },
];

export function audienceBySlug(slug: string): Audience | undefined {
  return audiences.find((audience) => audience.slug === slug);
}

export const audienceIndex = {
  headline: "Built around income that does not fit neatly into a normal Indian payroll setup.",
} as const;
