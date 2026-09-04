// /how-we-work. Replaces /about. No people, stated plainly rather than
// avoided. Copy verbatim from the final structure doc.

export const howWeWork = {
  headline: "How we work, and what we won’t do.",
  lead: "A CA firm built for work that became normal before most CA practices were built for it.",

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
        "Every return we file is signed by an ICAI-registered chartered accountant. You’ll know who that is before anything is filed — the name is on your engagement, not just on the return.",
        "We don’t publish the team on this site yet. When that changes, it’ll change here first.",
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
