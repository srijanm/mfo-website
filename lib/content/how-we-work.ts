// /how-we-work.
//
// One job: what happens when I become a client. The page used to open with why
// the firm exists and how it feels about software, then argue the trust case
// twice more in blocks the homepage and every audience page were also carrying.
// It is five steps now, with each commitment attached to the step it describes.
//
// The origin story, the alternatives comparison and the "what we won't do" list
// are gone. What survived of them is one sentence and one question.

export const howWeWork = {
  headline: "How working with us works.",
  lead: "We agree the scope and the fee first. Then we run that work through the year — setting it up, keeping the dates, and telling you what needs attention before you would have thought to ask.",

  /**
   * The five steps, and the whole of this page's argument.
   *
   * Each step says what you do and what we do, because "what happens when I
   * become a client" is a question about a relationship, not a list of
   * features. The reassurance that used to be argued twice more on this page —
   * a "How we behave" block and a "What we won't do" block — is attached to the
   * step it actually describes: the fee to agreeing scope, portal access to
   * setup, professional responsibility to the work, draft approval to filing.
   *
   * Steps 1-3 happen before anyone is a client and before any fee is owed.
   * Steps 4 and 5 are what being a client consists of, and they repeat: the
   * `recurring` flag is what stops the page reading as a sequence that ends
   * after one filing.
   *
   * Every line is drawn from approved content already in lib/content. Nothing
   * here names a channel, a turnaround, a response time or a document
   * requirement, because none has been approved.
   */
  journey: {
    title: "From your first message onwards",
    phases: [
      {
        id: "before",
        label: "Before you commit to anything",
        steps: [
          {
            id: "tell-us",
            title: "Tell us how you earn.",
            you: "Describe where the money comes from, how it reaches you, how many clients, and anything already set up.",
            us: "We read it. A person, not a form.",
            note: null,
          },
          {
            id: "we-review",
            title: "We review what’s relevant.",
            you: "Answer anything we need to ask about the arrangement.",
            us: "We work out what applies to your facts — including the parts that do not apply yet, and what would change that.",
            note: null,
          },
          {
            id: "agree",
            title: "We agree the scope and fee.",
            you: "Read it and decide. If the honest answer is that you don’t need us yet, that is what you will have been told at step two.",
            us: "One number for the year and a list of what it covers, in writing. Not an estimate, and not a headline price that grows.",
            note: null,
          },
        ],
      },
      {
        id: "after",
        label: "Once you are a client",
        recurring: true,
        steps: [
          {
            id: "run-the-year",
            title: "We set up and track the agreed work.",
            you: "Send us what we ask for when we ask for it. Your phone number and email stay on your own portals — you keep access to your own records.",
            us: "We put the relevant registrations in place and keep the dates that apply to you on our calendar. You hear from us before you would have remembered.",
            note: "This is the part that repeats. It is not a one-off setup.",
          },
          {
            id: "drafts",
            title: "You review drafts before filing.",
            you: "Read what is about to be filed. If something looks wrong, it is still a draft.",
            us: "We prepare it, show it to you, and file it once you are happy. An ICAI-registered chartered accountant signs it, and you will know who before anything is filed.",
            note: null,
          },
        ],
      },
    ],
  },

  /**
   * One genuinely distinct commitment, in one sentence rather than a section.
   * The other three rows of the old "What we won't do" block restated things
   * the steps above now say.
   */
  distinct:
    "If a simpler setup is right for you, we will say so — including when the right answer is that you do not need us yet.",

  /**
   * How software is used. Kept only because it answers a real question people
   * ask about a small firm, and kept as a question rather than a section of
   * philosophy.
   */
  questions: [
    {
      id: "software",
      question: "Are you using AI to do my taxes?",
      answer:
        "We use software so a small team can do the work of a larger one — tracking, reminders, drafting, the parts that are genuinely mechanical. It does not decide what applies to you and it does not sign anything. A person is accountable for the professional work, and you know who.",
    },
  ],
} as const;
