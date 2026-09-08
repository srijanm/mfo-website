/**
 * Labels for the page's original illustrations.
 *
 * Every visible string inside a graphic lives here rather than in JSX, the same
 * way every proposition does. Nothing in this file states a tax rule, a
 * threshold, a due date, an amount owed or a completed action: the illustrations
 * describe the *shape* of the work, and each one carries a visible label saying
 * it is illustrative.
 */

import { defaultMilestones } from "./site-content";

/* ------------------------------------------------------- graphic A: hero */

/**
 * The payment document and the work docket beside it.
 *
 * The three source rows repeat the values already shown in the hero's payment
 * example, so the illustration adds no new claim. `status` is a label, not a
 * state the site has observed — it describes the illustrated payment.
 *
 * The docket lists the categories of work around a payment. They are the same
 * areas the core scope section names, phrased as records rather than services,
 * and the qualification below them says plainly that scope varies.
 */
export const paymentGraphic = {
  eyebrow: "Illustrative payment",
  status: "Payment received",
  rowLabels: {
    from: "From",
    into: "Into",
    frequency: "Frequency",
  },
  docket: {
    title: "The work around it",
    items: ["Income records", "Relevant registrations", "Filing calendar"],
    qualification: "Scope depends on your setup.",
  },
} as const;

/* ------------------------------------ graphic B: how the money reaches you */

/** Which of the four line drawings sits above an income type. */
export type IncomeSourceIconName = "enterprise" | "consulting" | "creator" | "professional";

/**
 * The four ways of earning, in the order the strip shows them, each mapped to
 * its drawing. The labels and destinations are not here — they come from
 * `recognition` in site-content.ts, which is what the audience pages read — so
 * this only says which drawing belongs to which position.
 */
export const incomeSourceIcons: readonly IncomeSourceIconName[] = [
  "enterprise",
  "consulting",
  "creator",
  "professional",
];

/* ------------------------------------- graphic B: two illustrative years */

/**
 * The year comparison.
 *
 * `marks` is how many things needed attention in that month — not an amount,
 * not a date and not a record of anything that happened. The two arrays are
 * written out rather than generated so they are reviewable: a salaried year is
 * the same every month, and the other one is not. That contrast is the whole
 * message, and it is legible without hovering or waiting for anything.
 */
export const yearComparison = {
  caption: "Illustrative income patterns. Not customer records; no amounts shown.",
  months: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  monthNames: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  rows: [
    {
      id: "salaried",
      label: "A salaried year",
      /** One arrival a month, on a beat. */
      marks: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      annotation: null,
    },
    {
      id: "yours",
      label: "A year like yours",
      /** Money arrives when it arrives, and some months carry more. */
      marks: [2, 1, 3, 0, 2, 1, 1, 3, 2, 0, 2, 3],
      annotation: "More moving parts",
    },
  ],
} as const;

/* --------------------------------------- graphic C: the dark chapter docket */

/**
 * Two short action labels per stage, for the docket's action rows.
 *
 * Each pair is a compression of material already approved elsewhere in
 * lib/content — the stage's own label and question in site-content.ts, and what
 * MyFinanceOfficer says it does there. Nothing here introduces a service that
 * the stage copy does not already describe, and the docket renders the approved
 * sentence in full beside these, so the short labels are a summary of visible
 * text rather than a claim standing on its own.
 *
 * Keyed by milestone id and asserted against the milestone list below, so a
 * renamed or added stage fails the build rather than silently losing its rows.
 */
export const stageActions: Record<string, readonly [string, string]> = {
  /* "Do I need to set anything up now?" / "We look at how the money actually
     reaches you, and tell you what you can leave alone for now." */
  "first-income": ["Review how you are paid", "Identify what needs setup"],
  /* "What am I supposed to keep track of?" / "The dates that matter sit on our
     calendar, and we come to you." */
  "first-year": ["Track relevant dates", "Keep the filing calendar"],
  /* Stage: "Registration becomes relevant". / "You hear it from us first, in a
     message that explains what changed." */
  registration: ["Review registration needs", "Explain the next step"],
  /* "Am I still using the right structure and filing approach?" / "We open your
     year again instead of copying last year's file." */
  growth: ["Revisit the current structure", "Review the filing approach"],
  /* "Do I need a different entity or a more involved setup now?" / "Sometimes
     the answer is no, and we say so." */
  "structure-review": ["Review the setup", "Explain relevant options"],
};

const missingActions = defaultMilestones
  .map((milestone) => milestone.id)
  .filter((id) => stageActions[id] === undefined);

if (missingActions.length > 0) {
  throw new Error(
    `Every income-axis stage needs docket action labels: ${missingActions.join(", ")}`,
  );
}

/** Chrome for the docket. The stage's own copy supplies everything else. */
export const docketGraphic = {
  eyebrow: "Illustrative work docket",
  questionLabel: "Your question",
  workLabel: "What MyFinanceOfficer does",
  actionsLabel: "The work we own here",
  footer: "Relevant to your income and setup.",
  /** Rendered as "02 / 05". Never a date. */
  ofLabel: "/",
} as const;

/* ------------------------------------------------- audience page graphics */

/**
 * Illustrative record sheets for the two audience pages that had no graphic.
 *
 * They explain the *situation*, not a transaction: each row pairs a way of
 * being paid with the record it produces. There are deliberately no amounts, no
 * totals, no dates, no tax treatment and no outcomes — nothing here could be
 * mistaken for a statement about a real person's affairs, and the eyebrow on
 * each sheet says it is illustrative.
 */
export const recordSheets = {
  freelancers: {
    eyebrow: "Illustrative client records",
    title: "Three clients, three kinds of record",
    columns: { arrangement: "How you are billed", record: "What that leaves behind" },
    rows: [
      { id: "retainer", arrangement: "Monthly retainer", record: "A recurring invoice" },
      { id: "project", arrangement: "Project fee", record: "One invoice, one scope" },
      { id: "overseas", arrangement: "Client abroad", record: "An invoice and a currency trail" },
    ],
    footer: "Which of these you have changes what needs keeping. Tell us yours.",
  },
  creators: {
    eyebrow: "Illustrative income records",
    title: "Four arrangements, four kinds of record",
    columns: { arrangement: "The arrangement", record: "What that leaves behind" },
    rows: [
      { id: "brand", arrangement: "Brand campaign", record: "A contract and an invoice" },
      { id: "platform", arrangement: "Platform payout", record: "A platform statement" },
      { id: "agency", arrangement: "Through an agency", record: "Someone else’s paperwork" },
      { id: "non-cash", arrangement: "Paid in product, not money", record: "An arrangement, still" },
    ],
    footer: "The last one is the one people forget to mention. It still counts as an arrangement.",
  },
} as const;

export type RecordSheet = (typeof recordSheets)[keyof typeof recordSheets];
