// /how-we-work. Replaces /about. No people, stated plainly rather than
// avoided. Copy verbatim from the final structure doc.

export const howWeWork = {
  headline: "How we work, and what we won’t do.",
  lead: "A CA firm built for work that became normal before most CA practices were built for it.",

  /**
   * What actually happens, in order, from an enquiry to a filed return.
   *
   * Every step is a compression of approved material already in lib/content:
   * steps 1-3 are the scope-agreement sequence from pricing.ts, step 4 is the
   * core scope and the calendar commitment, step 5 is the trust ledger's
   * "You see the draft first."
   *
   * The `phase` split is the point of the block. The first three steps happen
   * before anyone is a client and before any fee is owed; the last two are what
   * being a client consists of. Running them together made a four-step
   * pre-sales process look like the whole service.
   *
   * No step names a channel, a turnaround or a service level, because none has
   * been approved.
   */
  journey: {
    label: "What happens",
    title: "From your first message to a filed return",
    phases: [
      {
        id: "before",
        label: "Before you commit to anything",
        steps: [
          {
            id: "tell-us",
            title: "Tell us how you earn.",
            body: "Where the money comes from, how it reaches you, how many clients, and what has already been set up.",
          },
          {
            id: "we-review",
            title: "We review what is relevant.",
            body: "A person reads it. Including the parts that don’t apply to you yet, and what would change that.",
          },
          {
            id: "in-writing",
            title: "Scope and fee are agreed in writing.",
            body: "One number for the year, and a list of what it covers. You decide from there.",
          },
        ],
      },
      {
        id: "after",
        label: "Once you are a client",
        steps: [
          {
            id: "run-the-year",
            title: "We set up and track the agreed work.",
            body: "The dates that apply to you sit on our calendar. You hear from us before you would have remembered.",
          },
          {
            id: "drafts",
            title: "You review drafts before filing.",
            body: "You read what is going to be filed before it goes anywhere. If something looks wrong, it is still a draft.",
          },
        ],
      },
    ],
  },

  /** What you do, and what we own. Neither list invents a delivery channel. */
  responsibilities: {
    title: "What you provide, and what we own",
    yours: {
      title: "You provide",
      rows: [
        "A description of how you earn, and the documents behind it when we ask.",
        "A decision on the scope and fee before anything starts.",
        "A read of the draft before it is filed.",
      ],
    },
    ours: {
      title: "We own",
      rows: [
        "Working out what applies to your facts, and what does not yet.",
        "Keeping the relevant dates and doing the work they belong to.",
        "The professional responsibility for what is filed, and the name against it.",
      ],
    },
  },

  sections: [
    {
      id: "why",
      title: "Why this firm exists",
      paragraphs: [
        "Most CA practices are excellent at what they’ve done for thirty years. Very few of them were built around someone invoicing a company abroad, taking brand deals, or running three client relationships from a laptop.",
        "That isn’t a criticism of them. It’s a description of a gap. The work changed faster than the practices did, and the people doing the new work are usually the first in their family to do it — so there’s nobody obvious to ask.",
        "We built a practice for that specific situation, and nothing else.",
      ],
    },
    {
      id: "run-the-year",
      title: "We run the year, not just the return",
      paragraphs: [
        /* The structure doc's wording tripped CLAUDE.md rule 6's register ban
           here, so the sentence makes the same point in permitted words. */
        "Filing is the visible part, and the least of it. The part that goes wrong is the eleven months before it, where nobody is watching and nothing is due yet.",
        "Every deadline that applies to you sits on our calendar. You hear from us before you’d have remembered.",
      ],
    },
    {
      id: "who-signs",
      title: "Who signs your return",
      paragraphs: [
        /* The sentence announcing that the team is not published "yet" came out:
           it made the firm sound half-built, and it is not information anyone
           needed. Whether individual profiles are published is an owner
           decision held in lib/content/firm.ts, and the site says nothing about
           people either way until it is populated. */
        "Every return we file is signed by an ICAI-registered chartered accountant. You’ll know who that is before anything is filed — the name is on your engagement, not just on the return.",
      ],
    },
    {
      id: "software",
      title: "How we use software",
      paragraphs: [
        "We use software so a small team can do the work of a larger one. It handles tracking, reminders, drafting and the parts that are genuinely mechanical.",
        "It does not decide what applies to you, and it does not sign anything. A person is accountable for the professional work, and you know who.",
      ],
    },
  ],

  wontDo: {
    title: "What we won’t do",
    rows: [
      {
        id: "no-upsell",
        title: "We won’t sell you a structure you don’t need.",
        body: "If a simple setup is right for you, we’ll say so, even where a more complicated one would bill better for years.",
      },
      {
        id: "no-credentials",
        title: "We won’t keep your credentials.",
        body: "Your phone number and email stay on your own portals. You retain access to your own records.",
      },
      {
        id: "no-fear",
        title: "We won’t frighten you into buying.",
        body: "Some firms in this market run on fear. We’ll state a consequence once, plainly, and leave it there.",
      },
      {
        id: "not-yet",
        title: "We won’t take you on if you don’t need us yet.",
        body: "We’ll tell you what would change that, and you can come back then.",
      },
    ],
  },
} as const;
