/**
 * Specimen values for the styleguide.
 *
 * These exist only to exercise the information objects in every state. Nothing
 * here is site content and nothing here is a tax fact presented as reviewed —
 * the styleguide renders them beside a note saying so.
 *
 * They live in lib/content/ rather than in the page because the amount below is
 * a currency literal, and no currency literal is written into a component.
 */
export const specimens = {
  payment: {
    /* Foreign currency, in the one object where that is the point: money
       arriving from abroad. Not a price, and never formatted as one. */
    amount: "$5,000.00",
    from: "Overseas company",
    received: "03 Sep 2026",
    into: "Indian bank account",
    frequency: "Monthly",
    indianPayroll: "Not handled here",
    indiaSideSetup: "Needs its own answer",
    note: "A payslip from abroad does not mean there is an Indian employer handling the India-side tax and compliance for you.",
  },
  filingInProgress: {
    status: "Draft",
    prepared: "18 Jul",
    sentToYou: "19 Jul",
  },
  filingComplete: {
    status: "Filed",
    prepared: "18 Jul",
    sentToYou: "19 Jul",
    approved: "21 Jul",
    filed: "22 Jul",
  },
} as const;
