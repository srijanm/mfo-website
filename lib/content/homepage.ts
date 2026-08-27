// Homepage copy, verbatim from docs/HOMEPAGE_COPY_AND_CONTENT.md.
// Components read from here so no proposition is written into JSX.

import { unreviewed, type ReviewedFact } from "./reviewed";
import { primaryCta } from "./navigation";
import { defaultMilestones } from "./site-content";

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
  follow: "It goes wrong later, about something from your first.",
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
      summary: unreviewed("A registration becomes relevant before anyone flags it."),
      columns: null,
    },
    {
      id: "advance-tax",
      summary: unreviewed("Advance tax becomes a recurring surprise."),
      columns: null,
    },
    {
      id: "tds-mismatch",
      summary: unreviewed(
        "Tax deducted by a client does not match the records you can see.",
      ),
      columns: null,
    },
    {
      id: "documentation",
      summary: unreviewed(
        "Export or foreign-income documentation is missing when someone eventually asks for it.",
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
    }),
  ),
} as const;
