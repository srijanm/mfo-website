// The three audience pages, at top-level URLs. Copy verbatim from the final
// structure doc; one content object per audience, one template.

import { hero as homepageHero } from "./homepage";
import { homepageFaq, type FaqItem } from "./homepage";
import { recordSheets } from "./graphics";

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

export type AudienceRow = {
  id: string;
  title: string;
  body: string;
};

export type Audience = {
  slug: string;
  /** Label in the header dropdown and footer. */
  name: string;
  /** <title> descriptor for the page. */
  metaDescription: string;
  hero: {
    headline: string;
    lead: string;
  };
  /** The incoming-payment document object, only where the spec places one. */
  record: AudienceRecord | null;
  /**
   * The illustrative record sheet, for audiences whose situation is better
   * explained by the records it produces than by a single payment. Exactly one
   * of `record` and `sheet` is set — the hero layout depends on there being a
   * graphic, and it must never reserve a column for one that does not exist.
   */
  sheet: keyof typeof recordSheets | null;
  situation: {
    title: string;
    rows: readonly AudienceRow[];
  };
  scope: {
    title: string;
    /** The qualification under the list. Never omitted. */
    note: string;
    rows: readonly AudienceRow[];
  };
  questions: readonly FaqItem[];
  /**
   * The one word the closing headline varies by page: /paid-from-abroad closes
   * on "how you're paid", the others on the standard "how you earn".
   */
  closeHeadline: string | null;
};

/* The eyebrows came off both blocks. "Your situation" sat above a heading that
   already said what the situation was, and "The work we can handle" said the
   same thing as "What we run for you" one line below it. A label that restates
   its own heading is a line of noise between the reader and the point. */
const SITUATION_TITLE = "What’s actually different here";
const SCOPE_TITLE = "What we run for you";
/* The qualification, which is the part that had to survive: no reviewed mapping
   of price to inclusions exists, so nothing may read as one. It is body text
   now rather than an eyebrow, because that is what it is. */
const SCOPE_NOTE =
  "Which of these apply to you is agreed in writing, with the fee, before anything starts.";

export const audiences: readonly Audience[] = [
  {
    slug: "paid-from-abroad",
    name: "Paid from abroad",
    metaDescription:
      "A CA firm for people paid by overseas companies and platforms. We set up and run the India-side tax and compliance.",
    hero: {
      headline: "The money arrives from abroad. The obligations stay here.",
      lead: "MyFinanceOfficer is a CA firm for people paid by overseas companies and platforms. We set up and run the India-side tax and compliance, so you know what needs doing before you need to ask.",
    },
    record: {
      ...homepageHero.paymentExample,
      note: homepageHero.paymentAnnotation,
    },
    sheet: null,
    situation: {
      title: SITUATION_TITLE,
      rows: [
        {
          id: "payslip",
          title: "A payslip from abroad is not an Indian payslip.",
          body: "It can look exactly like one. It doesn’t mean there’s an Indian employer handling anything on your behalf.",
        },
        {
          id: "three-trails",
          title: "The money can arrive three different ways and leave three different trails.",
          body: "A direct transfer, a platform like Deel, a service like Wise. What your bank records, and what you can prove later, is not the same in each case.",
        },        {
          id: "contract-abroad",
          title: "Your contract is with a company that has never dealt with India.",
          body: "They’re not being difficult. They’ve genuinely never been asked for the documents you’ll eventually need.",
        },
      ],
    },
    scope: {
      note: SCOPE_NOTE,
      title: SCOPE_TITLE,
      rows: [
        {
          id: "setup",
          title: "Setup and registrations",
          body: "What you need now, what you don’t need yet, and what would change that.",
        },
        {
          id: "income-tax",
          title: "Income tax",
          body: "The ongoing work around the way you actually earn.",
        },
        {
          id: "export-compliance",
          title: "Export and foreign-income compliance",
          body: "Where relevant to your facts.",
        },
        {
          id: "documentation",
          title: "Documentation",
          body: "The records that let you prove what you earn to a bank, a landlord, a lender or a visa officer.",
        },
        {
          id: "drafts",
          title: "Drafts and filing",
          body: "You see what’s being filed before it’s filed.",
        },
        {
          id: "questions",
          title: "Ongoing questions",
          body: "One accountable place to get the actual answer.",
        },
      ],
    },
    questions: [
      {
        id: "payslip-abroad",
        question: "I get a payslip from abroad. Is this still for me?",
        answer:
          "Probably, yes. The question isn’t whether a PDF says “payslip” — it’s who is handling the India side. Tell us how the arrangement works and we’ll tell you what applies to your situation.",
      },
      {
        id: "company-handles",
        question: "My company says they handle everything.",
        answer:
          "They may handle everything on their side. That’s a different thing from the India side, and the India side is usually still yours. Worth checking rather than assuming.",
      },
      {
        id: "two-years",
        question: "I’ve been doing this for two years already. Is it too late?",
        answer:
          "No. It’s more common than not. Tell us what’s happened so far and we’ll tell you where you stand, including if the honest answer is that you’re fine.",
      },
    ],
    closeHeadline: "Tell us how you’re paid. We’ll tell you what you actually need.",
  },

  {
    slug: "freelancers",
    name: "Freelancers and consultants",
    metaDescription:
      "A CA firm for freelancers, consultants and independent professionals. We set up and run the tax and compliance side.",
    hero: {
      headline: "On paper you run a business. In your head you have a job.",
      lead: "MyFinanceOfficer is a CA firm for freelancers, consultants and independent professionals. We set up and run the tax and compliance side, so you know what needs doing before you need to ask.",
    },
    record: null,
    sheet: "freelancers",
    situation: {
      title: SITUATION_TITLE,
      rows: [
        {
          id: "still-a-business",
          title: "Three clients is still a business.",
          body: "Most accounting advice assumes volume — inventory, staff, hundreds of transactions. You have a handful of invoices a month, and almost none of that advice fits.",
        },
        {
          id: "nobody-background",
          title: "Nobody is doing this in the background for you.",
          body: "There’s no payroll department quietly handling the parts a salaried friend never thinks about. Those parts didn’t disappear. They just moved to you.",
        },
        {
          id: "out-of-order",
          title: "The questions arrive out of order.",
          body: "A client asks for something you’ve never heard of. You find the answer, and it raises two more. There’s no obvious person to ask, so it waits.",
        },      ],
    },
    scope: {
      note: SCOPE_NOTE,
      title: SCOPE_TITLE,
      rows: [
        {
          id: "setup",
          title: "Setup and registrations",
          body: "What you need now, what you don’t need yet, and what would change that.",
        },
        {
          id: "income-tax",
          title: "Income tax",
          body: "The ongoing work around the way you actually earn.",
        },
        {
          id: "invoicing",
          title: "Invoicing that holds up",
          body: "So what you send matches what gets filed.",
        },
        {
          id: "drafts",
          title: "Drafts and filing",
          body: "You see what’s being filed before it’s filed.",
        },
        {
          id: "documentation",
          title: "Documentation",
          body: "Records that let you prove what you earn to a bank, a landlord, a lender or a visa officer.",
        },
        {
          id: "questions",
          title: "Ongoing questions",
          body: "One accountable place to get the actual answer.",
        },
      ],
    },
    questions: [
      {
        id: "not-enough-yet",
        question: "I don’t earn enough for this yet.",
        answer:
          "That may well be true. Tell us how you earn and where you are today. If the sensible answer is to come back later, we’ll say so.",
      },
      {
        id: "family-ca",
        question: "My family already has a CA.",
        answer:
          "That can be a perfectly good arrangement. The question is whether they regularly handle your kind of work, and whether someone is running the year rather than only filing at the end of it.",
      },
      {
        id: "filing-software",
        question: "Why not just use filing software?",
        answer:
          "Filing software is good at filing, once you already know what needs filing. The gap is the twelve months before that.",
      },
    ],
    closeHeadline: null,
  },

  {
    slug: "creators",
    name: "Creators",
    metaDescription:
      "A CA firm for creators. Brand deals, platform payments, products sent instead of fees — we run the tax and compliance side.",
    hero: {
      headline: "Some of what you earn never arrives as money.",
      lead: "MyFinanceOfficer is a CA firm for creators. Brand deals, platform payments, products sent instead of fees — we set up and run the tax and compliance side, so you know what needs doing before you need to ask.",
    },
    record: null,
    sheet: "creators",
    situation: {
      title: SITUATION_TITLE,
      rows: [
        {
          id: "more-places",
          title: "Income arrives from more places than most accounting expects.",
          body: "Platforms, brands directly, agencies, affiliate arrangements, one-off sponsorships. Each one records the payment differently.",
        },
        {
          id: "not-a-payment",
          title: "Some of it isn’t a payment at all.",
          body: "A product sent to you. A trip covered. An arrangement agreed over DM with no invoice anywhere. These are real arrangements and they don’t stop being real because nothing was transferred.",
        },
        {
          /* The structure doc used a word CLAUDE.md rule 6 bans for this row's
             subject, so the row says "records" — same claim, permitted register. */
          id: "inconsistent-records",
          title: "The records are inconsistent because the payers are inconsistent.",
          body: "A large brand’s finance team and a founder paying you from a personal account are not going to produce the same records.",
        },
      ],
    },
    scope: {
      note: SCOPE_NOTE,
      title: SCOPE_TITLE,
      rows: [
        {
          id: "setup",
          title: "Setup and registrations",
          body: "What you need now, what you don’t need yet, and what would change that.",
        },
        {
          id: "income-tax",
          title: "Income tax",
          body: "Across the different ways payment reaches you.",
        },
        {
          id: "non-cash",
          title: "Non-cash arrangements",
          body: "Barter, gifted products and covered costs, treated according to your actual facts.",
        },
        {
          id: "drafts",
          title: "Drafts and filing",
          body: "You see what’s being filed before it’s filed.",
        },
        {
          id: "documentation",
          title: "Documentation",
          body: "Records that let you prove what you earn to a bank, a landlord, a lender or a visa officer.",
        },
        {
          id: "questions",
          title: "Ongoing questions",
          body: "One accountable place to get the actual answer.",
        },
      ],
    },
    questions: [
      {
        id: "products-not-money",
        question: "I was sent products, not money. Does that count?",
        answer:
          "Tell us what you received and how it was agreed. Non-cash arrangements aren’t invisible, and what applies depends on the facts. We’ll tell you what applies to yours.",
      },
      {
        id: "small-irregular",
        question: "Most of my income is small and irregular.",
        answer:
          "Then the answer may well be that you don’t need much yet. We’d rather tell you that than sell you a structure you won’t use.",
      },
      {
        id: "agency",
        question: "My brand deals go through an agency.",
        answer:
          "Useful to know, and it changes what records exist and where. Tell us how the arrangement works and we’ll tell you what it means for you.",
      },
    ],
    closeHeadline: null,
  },
];

/**
 * The questions on an audience page, minus anything the homepage already
 * answers for everyone.
 *
 * Three of the site's questions are general objections — "I don't earn enough
 * for this yet", "My family already has a CA", "Why not just use filing
 * software?" — and they belong to the homepage, which is where someone
 * weighing up the firm as a whole reads them. Repeating them verbatim on an
 * audience page is the kind of duplication this pass exists to remove.
 *
 * Filtered by question text against the homepage set rather than by a flag, so
 * moving a question between the two lists cannot leave a stale marker behind.
 *
 * `/freelancers` currently has nothing left after this filter: all three of its
 * questions are the general ones. Its FAQ block therefore does not render, and
 * that is recorded as a content dependency rather than papered over with an
 * invented question.
 */
export function audienceQuestions(audience: Audience): readonly FaqItem[] {
  const general = new Set(homepageFaq.map((item) => item.question));
  return audience.questions.filter((item) => !general.has(item.question));
}

export function audienceBySlug(slug: string): Audience | undefined {
  return audiences.find((audience) => audience.slug === slug);
}
