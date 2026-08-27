// Homepage copy, verbatim from docs/HOMEPAGE_COPY_AND_CONTENT.md.
// Components read from here so no proposition is written into JSX.

import { primaryCta } from "./navigation";

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
