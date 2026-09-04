// MyFinanceOfficer — canonical marketing content data

export const pricingPoints = [19999, 24999, 34999] as const;

/**
 * The recognition strip doubles as navigation: each cell names a way of
 * earning and links to the audience page that owns it. Two cells share
 * /freelancers — independent professionals merged into that page.
 */
export const recognition = [
  { label: "Paid by an overseas company", href: "/paid-from-abroad" },
  { label: "Consulting for a few clients", href: "/freelancers" },
  { label: "Creator or brand income", href: "/creators" },
  { label: "Independent professional income", href: "/freelancers" },
] as const;

export const coreScope = [
  {
    id: "setup",
    title: "Setup & registrations",
    body: "What you need now, what you do not need yet and what would make that change.",
  },
  {
    id: "income-tax",
    title: "Income tax",
    body: "The ongoing tax work around the way you actually earn.",
  },
  {
    id: "gst-export",
    title: "GST & export compliance",
    body: "Where relevant to your facts and income.",
  },
  {
    id: "advance-tax",
    title: "Advance tax",
    body: "Planning, tracking and filing where relevant.",
  },
  {
    id: "drafts",
    title: "Drafts & filing",
    body: "You see what is being filed before it is filed.",
  },
  {
    id: "notices",
    title: "Notices",
    body: "Support according to the scope of your engagement.",
  },
  {
    id: "questions",
    title: "Ongoing questions",
    body: "One accountable place to get the actual answer.",
  },
  {
    id: "documentation",
    title: "Income documentation",
    body: "Records that help you prove what you earn when someone asks.",
  },
] as const;

export const additionalSupport = [
  {
    id: "fx",
    title: "FX optimisation",
    body: "Help thinking through the cost and mechanics of receiving or converting foreign income.",
  },
  {
    id: "insurance",
    title: "Insurance optimisation",
    body: "Reviewing whether your current cover makes sense for your situation.",
  },
  {
    id: "loans",
    title: "Loan optimisation",
    body: "Helping organise the financial information and decisions around borrowing.",
  },
  {
    id: "wealth",
    title: "Wealth planning",
    body: "Planning support as your financial life becomes more complex.",
  },
  {
    id: "mis",
    title: "MIS",
    body: "Useful financial visibility and reporting when you need more than an annual return.",
  },
] as const;

/**
 * The five public milestones from §17. `tracking` is the state of the
 * obligation object shown beside each one on the Income Axis: a value from the
 * approved status union in homepage.ts and nothing else. Every milestone is
 * something MyFinanceOfficer watches, so every one of them reads "MFO tracks";
 * the value lives here so a content owner can vary it without touching a
 * component, and so no status word is ever written into JSX.
 */
export const defaultMilestones = [
  {
    id: "first-income",
    label: "First income",
    question: "Do I need to set anything up now?",
    mfo:
      "We look at how the money actually reaches you, and tell you what you can leave alone for now.",
    tracking: "MFO tracks",
  },
  {
    id: "first-year",
    label: "First year",
    question: "What am I supposed to keep track of?",
    mfo:
      "Nothing goes on your fridge door. The dates that matter sit on our calendar, and we come to you.",
    tracking: "MFO tracks",
  },
  {
    id: "registration",
    label: "Registration becomes relevant",
    question: "Has something changed because of how much or where I earn?",
    mfo:
      "You hear it from us first, in a message that explains what changed — not a form that assumes you already know.",
    tracking: "MFO tracks",
  },
  {
    id: "growth",
    label: "Income and obligations grow",
    question: "Am I still using the right structure and filing approach?",
    mfo:
      "We open your year again instead of copying last year’s file and changing the numbers.",
    tracking: "MFO tracks",
  },
  {
    id: "structure-review",
    label: "Structure needs reviewing",
    question: "Do I need a different entity or a more involved setup now?",
    mfo:
      "Sometimes the answer is no, and we say so instead of selling you the bigger version.",
    tracking: "MFO tracks",
  },
] as const;
