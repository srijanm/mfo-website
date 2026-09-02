// /how-it-works. Section names come from SECONDARY_PAGE_SPECS.md, not invented.

export const howItWorks = {
  /* The label on the one strong vertical in the routing plate. Structural, not
     a claim: it names the side of the arrangement MFO is responsible for, which
     is what the page says in words throughout. */
  indiaSideLabel: "India side",

  headline: "You do the work. We run the tax and compliance around it.",
  lead: "MyFinanceOfficer is designed around an ongoing relationship, not a once-a-year return.",

  /** Section 1. The two lines are self-labelling — "You…" and "We…". */
  start: {
    title: "Start",
    you: "You tell us how you earn.",
    us: "We tell you what you need now, what you do not need and what would make that change.",
  },

  /**
   * Section 2. Four setup milestones rendered on the line-and-node primitive:
   * each one is a point where something changes, which is the only thing that
   * primitive is allowed to mean. No status values are invented for them.
   */
  setUp: {
    title: "Set up",
    steps: [
      "Profile understood",
      "Required registrations",
      "Filing calendar created",
      "Records and access confirmed",
    ],
  },

  /**
   * Section 4. The filing sequence, with only the opening state set. The rest
   * render the empty marker rather than carrying invented dates.
   */
  beforeFiling: {
    title: "Before filing",
    lead: "Nothing is filed before you have seen it.",
    status: "Draft",
  },
} as const;
