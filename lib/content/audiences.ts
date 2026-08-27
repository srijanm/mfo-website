// The /who-its-for family. One content object per audience; one template.

import { hero as homepageHero } from "./homepage";
import type { ReviewedFact } from "./reviewed";

/** An optional information object shown beneath the audience hero. */
export type AudienceRecord = {
  kind: "incoming-payment";
  amount: string;
  from: string;
  received: string;
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
   * Body copy for the section. Typed as a reviewed fact because most of these
   * topics — registrations, GST, documentation, structure — cannot be described
   * without stating something about tax. Null until written and signed off.
   */
  body: ReviewedFact | null;
};

export type Audience = {
  slug: string;
  /** Row label and link text on the /who-its-for index. */
  name: string;
  /** One-line description on the index page. */
  summary: string;
  headline: string;
  lead: string | null;
  record: AudienceRecord | null;
  /**
   * The topics this page covers, from SECONDARY_PAGE_SPECS.md. The spec lists
   * them as structure, not copy; each body stays null until an owner supplies
   * reviewed wording. The template renders whatever is populated and omits the
   * rest, so the page is coherent either way.
   */
  sections: AudienceSection[];
};

const topics = (...titles: [string, string][]): AudienceSection[] =>
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
      kind: "incoming-payment",
      ...homepageHero.paymentExample,
      note: homepageHero.paymentAnnotation,
    },
    sections: topics(
      ["differs", "How the arrangement differs from Indian payroll"],
      ["understand", "What we need to understand"],
      ["scope", "What we can run"],
      ["questions", "Questions people actually ask"],
      ["core-vs-additional", "Core work, and support that sits around it"],
    ),
  },
  {
    slug: "freelancers-consultants",
    name: "Freelancers and consultants",
    summary: "A few recurring clients and a business that may not feel like a business yet.",
    headline: "A few clients can still create a whole year of obligations.",
    lead: null,
    record: null,
    sections: topics(
      ["first-income", "First income"],
      ["invoices", "Invoices"],
      ["registrations", "Registrations when relevant"],
      ["calendar", "Tax and calendar"],
      ["growth", "Income growth"],
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
    sections: topics(
      ["platform-brand", "Platform and brand income"],
      ["non-cash", "Cash and non-cash receipts"],
      ["records", "Records"],
      ["gst-tax", "GST and tax"],
      ["calendar", "Calendar"],
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
    sections: topics(
      ["how-income-arrives", "How income arrives"],
      ["setup", "Setup"],
      ["calendar", "Calendar"],
      ["documentation", "Documentation"],
      ["structure", "Growth and structure"],
    ),
  },
];

export function audienceBySlug(slug: string): Audience | undefined {
  return audiences.find((audience) => audience.slug === slug);
}

export const audienceIndex = {
  headline: "Built around income that does not fit neatly into a normal Indian payroll setup.",
} as const;
