// The four-step intake. Questions, options and copy live here, never in the form.

export type IntakeStep = {
  id: "paidBy" | "stage" | "needs";
  question: string;
  options: readonly string[];
};

export const intakeSteps: readonly IntakeStep[] = [
  {
    id: "paidBy",
    question: "How are you paid?",
    options: [
      "An overseas company",
      "Indian clients",
      "Both",
      "Creator / brand income",
      "Independent professional practice",
      "Something else",
    ],
  },
  {
    id: "stage",
    question: "Where are you now?",
    options: [
      "Just started",
      "First year",
      "Already filing",
      "Switching from another CA",
      "Not sure",
    ],
  },
  {
    id: "needs",
    question: "What do you need help with?",
    options: [
      "I don’t know yet",
      "Getting set up",
      "GST / compliance",
      "Filing / tax",
      "Foreign income",
      "Switching CA",
      "Something else",
    ],
  },
];

export const detailsStep = {
  question: "How do we reach you?",
  fields: {
    name: { label: "Name", autoComplete: "name" },
    email: { label: "Email", autoComplete: "email" },
    phone: { label: "Phone", autoComplete: "tel" },
    note: { label: "Anything else we should know?", optional: "Optional" },
  },
} as const;

export const getStarted = {
  title: "Tell us how you earn.",
  lead: "Four questions. We will tell you what applies to your situation, including when the answer is that you do not need us yet.",

  progressLabel: (current: number, total: number) => `Step ${current} of ${total}`,

  back: "Back",
  next: "Continue",
  submit: "Send",
  sending: "Sending…",

  /** Shown at every step, so there is a route through without the form. */
  alternative: {
    prompt: "Would rather not use a form?",
    href: "/contact",
    label: "Get in touch",
  },

  chooseAnOption: "Choose one option to continue.",

  /** Exact wording required by §27. */
  success: "Got it. We’ll review how you earn and tell you what makes sense from here.",

  /**
   * Shown when the send fails. It never claims the message arrived, and it
   * always offers another way through.
   */
  failure: {
    heading: "That did not send.",
    body: "Your details were not submitted. Try again, or reach us directly and we will pick it up from there.",
    retry: "Try again",
  },

  tooManyRequests: "Too many attempts just now. Wait a minute and try again.",
} as const;

/** No plan is ever recommended from this form — §27. */
export const NO_RECOMMENDATION = true;
