// The intake: three short questions, then contact details. Questions, options
// and copy live here, never in the form. Options per the final structure doc.

export type IntakeStep = {
  id: "paidBy" | "stage" | "needs";
  question: string;
  /** Shown under the question where the answer is not one-of-many. */
  hint?: string;
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
      /* A neutral route out. The four above are the common cases, not an
         exhaustive list, and someone whose arrangement is not among them is
         still a valid enquiry — making them pick the nearest wrong answer
         would put a fact in the enquiry that is not true. */
      "Something else / not sure",
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
    hint: "Select all that apply.",
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
  lead: "Three short questions, then how to reach you. A person reads every enquiry and replies — this is not an instant assessment, and nothing is decided by a form.",

  /** Named accurately: three questions, then contact details. */
  progressLabel: (current: number, total: number) => `Step ${current} of ${total}`,

  back: "Back",
  next: "Continue",
  submit: "Send enquiry",
  sending: "Sending…",

  /** Sits with the final step, where the commitment is being asked for. */
  reassurance:
    "We’ll review your situation and explain the relevant scope and fee before you commit.",

  /** Announced to assistive technology while the request is in flight. */
  sendingAnnouncement: "Sending your enquiry.",

  /** Shown above the fields when a step has errors on it. */
  errorSummary: (count: number) =>
    count === 1 ? "There is one thing to fix." : `There are ${count} things to fix.`,

  /**
   * What happens to what you type. Short, and true of what the code actually
   * does: the answers are sent to the firm so a person can reply, and nothing
   * else is done with them. No consent checkbox — there is no marketing use to
   * consent to, and a compulsory tick that gates the button would be a barrier
   * pretending to be a permission.
   */
  privacy: {
    body: "We use what you send here to reply to your enquiry. Nothing is stored in your browser, and nothing goes to advertisers.",
    /** Rendered only once a real policy is published. */
    linkLabel: "How we handle your information",
    href: "/privacy",
  },

  /** Page context, shown to the reader rather than applied silently. */
  sourceLabel: "You came from",
  sourceNote:
    "We include this so we know where you started. It doesn’t tell us anything about how you are paid — the questions above do that.",

  /**
   * Shown at every step. What this says depends on whether a genuinely public
   * contact route exists — while it does not, the form is the only way in, and
   * the component says so rather than advertising a page that would send the
   * reader straight back here.
   */
  alternative: {
    prompt: "Would you rather not use a form?",
    href: "/contact",
    label: "Other ways to reach us",
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
    body: "Your answers are still here — nothing was lost. Try again in a moment.",
    retry: "Try again",
  },

  /**
   * A request that timed out is not the same as one that was refused. We do not
   * know whether it arrived, so the wording does not claim either way.
   */
  timeout: {
    heading: "We didn’t get a confirmation.",
    body: "Your enquiry may or may not have reached us — we can’t tell from here. Your answers are still here, so you can send again; if it did arrive twice, we’ll see that and only reply once.",
    retry: "Try again",
  },

  tooManyRequests: (seconds: number) =>
    `Too many attempts just now. Try again in about ${seconds} second${seconds === 1 ? "" : "s"}.`,
} as const;

/** No plan is ever recommended from this form — §27. */
export const NO_RECOMMENDATION = true;
