// Homepage copy, verbatim from docs/HOMEPAGE_COPY_AND_CONTENT.md.
// Components read from here so no proposition is written into JSX.

import { unreviewed, type ReviewedFact } from "./reviewed";
import { primaryCta } from "./navigation";
import { additionalSupport, coreScope, defaultMilestones } from "./site-content";

export const hero = {
  headline: "Half the work you do didn’t exist when your family’s CA started out.",

  subhead:
    "MyFinanceOfficer is a modern CA firm for freelancers, creators, consultants and professionals paid by Indian or overseas businesses. We set up and run the India-side tax and compliance, so you know what needs doing before you need to ask.",

  primaryCta,

  secondaryCta: { href: "/pricing", label: "View pricing" },

  /**
   * Illustrative values for the incoming payment object, following the anatomy
   * in MASTER_BUILD_SPEC.md §11. The India-side rows state that an answer is
   * needed — they do not state what the answer is.
   */
  paymentExample: {
    amount: "$5,000.00",
    from: "Overseas company",
    received: "03 Sep 2026",
    into: "Indian bank account",
    frequency: "Monthly",
    indianPayroll: "Not handled here",
    indiaSideSetup: "Needs its own answer",
  },

  /**
   * The approved interpretation, quoted exactly. It is deliberately a statement
   * about who is handling the India side, not about how anything is taxed.
   * Do not paraphrase this or extend it with a tax conclusion.
   */
  paymentAnnotation:
    "A payslip from abroad does not mean there is an Indian employer handling the India-side tax and compliance for you.",
} as const;

/* ------------------------------------------------------------------ H02 */

export const recognitionClosing =
  "Different jobs. Same problem: the income does not always fit neatly into the system a salaried employee gets automatically.";

/* ------------------------------------------------------------------ H03 */

/**
 * The three-column expansion of an example: what started, why it matters later
 * and what the customer notices. Writing these means writing tax content, so
 * they stay null until a CA supplies and reviews them. The section is designed
 * to be complete without them, the same way pricing is complete without
 * `approvedPlanScope`.
 */
export type LatentProblemColumns = {
  started: string;
  mattersLater: string;
  notices: string;
};

export type LatentProblemExample = {
  id: string;
  /** The approved single-sentence example from the copy doc. */
  summary: ReviewedFact;
  columns: LatentProblemColumns | null;
};

export const latentProblem = {
  headline: "Nothing goes wrong in your first year.",
  follow: "It goes wrong in your third, about something from your first.",
  intro:
    "The difficult part is not filing a return once you know what needs to be filed. It is knowing what should have happened before that.",

  columnHeadings: {
    started: "What started",
    mattersLater: "Why it matters later",
    notices: "What the customer notices",
  },

  examples: [
    {
      id: "registration",
      summary: unreviewed(
        "A client asks for an invoice with a GST number on it. You don’t have one.",
      ),
      columns: null,
    },
    {
      id: "advance-tax",
      summary: unreviewed(
        "Your accountant asks what you have already paid this year. The answer is nothing, and that turns out to matter.",
      ),
      columns: null,
    },
    {
      id: "tds-mismatch",
      summary: unreviewed(
        "A client says they deducted tax. It isn’t in your statement, and they’ve stopped replying.",
      ),
      columns: null,
    },
    {
      id: "documentation",
      summary: unreviewed(
        "Your bank asks for a document about a payment from two years ago. Nobody mentioned it at the time.",
      ),
      columns: null,
    },
  ] as LatentProblemExample[],
} as const;

/** True only once every example carries a reviewed three-column expansion. */
export function latentProblemColumnsReady(): boolean {
  return latentProblem.examples.every((example) => example.columns !== null);
}

/* ------------------------------------------------------------------ H04 */

/**
 * Each alternative is described in two halves, split at the sentence boundary
 * the copy doc already wrote them on. Nothing is reworded, and the tone stays
 * on fit rather than attack: every row opens with what the alternative is
 * genuinely good at.
 */
export const structuralMismatch = {
  headline: "Your work changed. Most CA practices were built around a different kind of client.",
  body:
    "A few recurring invoices. A contract with a company abroad. Deel or Wise. Creator payments. Barter. Consulting income. The work is not necessarily complicated, but it is different enough that generic advice becomes expensive.",

  columnHeadings: {
    helps: "Where it helps",
    doesNotOwn: "What it does not own",
  },

  alternatives: [
    {
      id: "traditional-ca",
      name: "Traditional CA relationship",
      helps: "Useful when the practice already knows your kind of work.",
      doesNotOwn:
        "The gap appears when the relationship is filing-led and nobody is running the year before the return.",
    },
    {
      id: "filing-software",
      name: "Filing software",
      helps: "Useful when you already know what needs to be filed.",
      doesNotOwn: "It cannot warn you about the question you did not know to ask.",
    },
    {
      id: "marketplace",
      name: "Service marketplace",
      helps: "Useful for individual tasks.",
      doesNotOwn: "Harder when responsibility is split across multiple handoffs.",
    },
    {
      id: "internet-advice",
      name: "Internet advice",
      helps: "Useful for orientation.",
      doesNotOwn: "Fast, contradictory and nobody is accountable for the answer.",
    },
  ],
} as const;

/* ------------------------------------------------------------------ H05 */

export type IncomeAxisMilestone = {
  id: string;
  label: string;
  /** The question someone actually asks at this point. */
  question: string;
  /**
   * What changes at this milestone. §17 lists this as one of the four parts,
   * but describing it means stating a tax consequence, and the copy doc does
   * not supply one. Null until a CA writes and reviews it. The layout must not
   * depend on it, and must never depend on a numeric threshold appearing here.
   */
  whatChanges: ReviewedFact | null;
  /** What MyFinanceOfficer does about it. */
  mfo: string;
  /**
   * The state of the obligation object shown beside this milestone. It is a
   * value from the approved status union and nothing else: no threshold, no
   * date, no tax conclusion. The object names the milestone the reader is
   * already looking at and states that MFO is watching it — §17 allows a
   * reviewed content file to add numbers later, and the layout must not start
   * depending on one.
   */
  tracking: LedgerStatus;
};

export const incomeAxis = {
  headline: "Your obligations change as your income and setup change.",
  intro:
    "The point is not to memorise every rule. The point is to have someone watching what comes next.",

  /* Field names taken from §17 rather than invented. Kept here so the copy
     owner can change the wording without touching a component. */
  fieldLabels: {
    question: "Customer question",
    whatChanges: "What changes",
    mfo: "What MyFinanceOfficer does",
  },

  milestones: defaultMilestones.map(
    (milestone): IncomeAxisMilestone => ({
      id: milestone.id,
      label: milestone.label,
      question: milestone.question,
      whatChanges: null,
      mfo: milestone.mfo,
      tracking: milestone.tracking,
    }),
  ),
} as const;

/* ------------------------------------------------------------------ H06 */

export const operatingModel = {
  headline: "You shouldn’t have to know which question to ask.",
  pillars: [
    {
      id: "start-right",
      title: "We start you off right.",
      body: "The right registrations, the right structure and the right setup for how you actually earn.",
    },
    {
      id: "we-run-it",
      title: "We run it, not you.",
      body: "The relevant deadlines live on our calendar. You hear from us before you would have remembered them.",
    },
    {
      id: "on-the-hook",
      title: "We’re on the hook.",
      body: "You know the fee before you start, see drafts before filing and know who is responsible for the work.",
    },
  ],
} as const;

/* ------------------------------------------------------------------ H07 */

/**
 * The only status language the ledger may use. Typing it as a union rather
 * than a string is what stops "Done" or "Handled" reaching a marketing example
 * — they will not compile. There is deliberately no overdue or alarming state
 * in this list.
 */
export type LedgerStatus =
  | "MFO tracks"
  | "Upcoming"
  | "Waiting for you"
  | "Draft ready"
  | "Approved"
  | "Filed";

export type LedgerEntry = {
  id: string;
  label: string;
  status: LedgerStatus;
  /**
   * When the entry falls due. A tax date, so it stays null until a CA supplies
   * and reviews one — which is why every entry below is non-numeric today. The
   * ledger must read correctly with or without it.
   */
  when: ReviewedFact | null;
};

export const temporalLedger = {
  headline: "Your work has deadlines. So does earning from it.",
  body:
    "Your exact calendar depends on how you earn. Once you’re with MyFinanceOfficer, tracking the relevant tax and compliance dates is our job.",

  yearLabel: "Your year",
  startLabel: "Start",
  endLabel: "Year end",

  /*
   * Stages from §19, not a monthly calendar. Every one carries "MFO tracks":
   * it is the claim the section actually makes, and any other status would
   * assert something about a reader who is not a client yet — a filing that
   * was prepared, a draft they were sent. The rest of the vocabulary exists
   * for reviewed entries later.
   */
  entries: [
    {
      id: "setup",
      label: "Setup and registrations, if relevant",
      status: "MFO tracks",
      when: null,
    },
    {
      id: "checkpoint",
      label: "Tax and compliance checkpoint",
      status: "MFO tracks",
      when: null,
    },
    {
      id: "filing-prep",
      label: "Filing preparation",
      status: "MFO tracks",
      when: null,
    },
    {
      id: "next",
      label: "Next obligation",
      status: "MFO tracks",
      when: null,
    },
  ] as LedgerEntry[],
} as const;

/* ------------------------------------------------------------------ H08 */

/**
 * Layer A only. §20 is explicit that FX, insurance, loans, wealth planning and
 * MIS must not appear here: this section describes the core CA relationship,
 * not what a plan includes.
 *
 * The categories come straight from `coreScope`, and the assertion below fails
 * the build if a Layer B item ever leaks into that list.
 */
const LAYER_B_IDS: ReadonlySet<string> = new Set(additionalSupport.map((item) => item.id));

const leakedIntoCoreScope = coreScope.filter((item) => LAYER_B_IDS.has(item.id));

if (leakedIntoCoreScope.length > 0) {
  throw new Error(
    `Layer B services must never appear in the core scope section: ${leakedIntoCoreScope
      .map((item) => item.id)
      .join(", ")}`,
  );
}

export const coreScopeSection = {
  headline: "The CA and compliance work we are built to run.",
  columnHeadings: {
    area: "Area",
    handled: "What we handle",
  },
  items: coreScope,
} as const;

/* ------------------------------------------------------------------ H09 */

export const trustLedger = {
  headline: "Judge us by what happens before we file anything.",
  columnHeadings: {
    whatWeDo: "What we do",
    whyItMatters: "Why it matters",
  },
  rows: [
    {
      id: "draft-first",
      whatWeDo: "You see the draft first.",
      whyItMatters:
        "You read it before it goes anywhere. If something looks wrong, it is still a draft.",
    },
    {
      id: "contact-details",
      whatWeDo: "Your contact details stay yours.",
      whyItMatters:
        "The messages come to your phone, not to an office you have never been to.",
    },
    {
      id: "named-signatory",
      whatWeDo: "A named professional signs the return.",
      whyItMatters: "There is a person on the other end of it, and you know their name.",
    },
    {
      id: "support-upfront",
      whatWeDo: "Support is agreed upfront.",
      whyItMatters:
        "You know what is covered before there is a problem, not while you are in one.",
    },
    {
      id: "not-yet",
      whatWeDo: "Sometimes the answer is “you don’t need that yet.”",
      whyItMatters:
        "We would rather tell you that now than sell you something you will not use.",
    },
  ],
} as const;

/* ------------------------------------------------------------------ H12 */

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

/**
 * The copy doc gives H12 no heading of its own, so the section has none and
 * each question is a top-level heading. That keeps the document's heading
 * order intact without inventing a title the section was not written with.
 */
export const homepageFaq: readonly FaqItem[] = [
  {
    id: "not-enough-yet",
    question: "I don’t earn enough for this yet.",
    answer:
      "That may be true. Tell us how you earn and where you are today. If the sensible answer is to come back later, we will tell you.",
  },
  {
    id: "family-ca",
    question: "My family already has a CA.",
    answer:
      "That can be a perfectly good arrangement. The question is whether they regularly handle the kind of income you have and whether someone is proactively running the year rather than only filing the return.",
  },
  {
    id: "filing-software",
    question: "Why not just use filing software?",
    answer:
      "Filing software can be useful when you already know what needs to be filed. MyFinanceOfficer is built around the part before that: knowing what applies, what changes next and what needs to happen on time.",
  },
  {
    id: "cheaper",
    question: "Is this cheaper than a normal CA?",
    answer:
      "Not necessarily. The point is that the annual fee and scope are clear before you start.",
  },
  {
    id: "ai",
    question: "Are you using AI to do my taxes?",
    answer:
      "We use software to make the work more efficient. A person remains accountable for professional work and signing where required.",
  },
  {
    id: "payslip-abroad",
    question: "I get a payslip from abroad. Is this still for me?",
    answer:
      "Potentially, yes. The important question is not whether a PDF says “payslip”; it is who is handling the India-side tax, payroll and compliance obligations. Tell us how the arrangement works and we will tell you what applies to your situation.",
  },
  {
    id: "broader-support",
    question: "What if I also need help with FX, insurance or a loan?",
    answer:
      "Some annual plans can include broader financial support. Those services sit around the core CA and compliance relationship and are used when they are relevant.",
  },
];

/* ------------------------------------------------------------------ H13 */

export type FinalCtaContent = {
  headline: string;
  support: string;
  cta: { href: string; label: string };
};

export const finalCta = {
  headline: "Tell us how you earn. We’ll tell you what you actually need.",
  support: "If the answer is “not yet”, we’ll tell you that too.",
  cta: primaryCta,
} as const satisfies FinalCtaContent;

/** Look up approved FAQ entries by id, preserving the requested order. */
export function faqByIds(ids: readonly string[]): FaqItem[] {
  return ids
    .map((id) => homepageFaq.find((item) => item.id === id))
    .filter((item): item is FaqItem => item !== undefined);
}
