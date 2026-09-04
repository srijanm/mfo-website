// The four-step intake. Questions, options and copy live here, never in the
// form. Options per the final structure doc.

export type IntakeStep = {
  id: "paidBy" | "stage" | "needs";
  question: string;
  options: readonly string[];
  /** Step 3 accepts more than one answer. */
  multiple?: boolean;
};

export const intakeSteps: readonly IntakeStep[] = [
  {
    id: "paidBy",
    question: "How are you paid?",
    options: [
      "Overseas company or platform",
      "Indian clients directly",
      "Brand or creator income",
      "A mix",
    ],
  },
  {
    id: "stage",
    question: "Where are you now?",
    options: [
      "Haven’t started earning yet",
      "First year",
      "A year or two in",
      "Longer than that",
    ],
  },
  {
    id: "needs",
    question: "What do you need help with?",
    multiple: true,
    options: [
      "I don’t know what I need",
      "Setting things up properly",
      "Something specific I’ve been asked for",
      "Catching up on something I think I’ve missed",
      "Switching from someone else",
    ],
  },
];

export const detailsStep = {
  question: "How do we reach you?",
  fields: {
    name: { label: "Name", autoComplete: "name" },
    email: { label: "Email", autoComplete: "email" },
    phone: { label: "Phone", autoComplete: "tel" },
    note: { label: "Anything you want to add", optional: "Optional" },
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
    prompt: "Would you rather not use a form?",
    href: "/contact",
    label: "Get in touch",
  },

  chooseAnOption: "Choose one option to continue.",
  chooseAtLeastOne: "Choose at least one to continue.",

  /** Exact wording from the final structure doc. */
  success: "Got it. We’ll review how you earn and tell you what makes sense from here.",
  successDetail:
    "We’ll come back to you with what applies, what doesn’t, and the fee — in writing, before you commit to anything.",

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
