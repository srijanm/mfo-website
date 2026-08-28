// /about. The spec gives a hero and six section topics; where approved copy for
// a topic already exists elsewhere on the site, it is reused verbatim rather
// than rewritten. Where none exists, the section stays unwritten.

import { homepageFaq } from "./homepage";

function answerTo(id: string): string {
  const item = homepageFaq.find((entry) => entry.id === id);
  if (!item) throw new Error(`No approved FAQ answer for "${id}"`);
  return item.answer;
}

export type TeamMember = {
  name: string;
  role: string;
  /** e.g. an ICAI membership reference. Published only where appropriate. */
  credential: string | null;
  /**
   * A real photograph of this person. Never stock photography — §26 of the
   * secondary specs permits founder and team images here and nothing else.
   * Dimensions are required so the page does not shift as images load.
   */
  portrait: { src: string; width: number; height: number; alt: string } | null;
};

export const about = {
  headline:
    "A CA firm built around work that became normal before most CA practices were built for it.",

  /**
   * Why MFO exists. No approved copy for this exists in the handoff, and it is
   * the firm's own account of itself rather than something to be derived, so it
   * stays null until written.
   */
  why: null as string | null,

  principles: {
    title: "How we work",
  },

  people: {
    title: "The people doing the work",
    /**
     * Real founder and team members, with credentials where appropriate.
     *
     * THIS IS THE PHOTOGRAPHY SLOT. Populate this array with real people and
     * real portraits; the page renders them as soon as it is non-empty. Stock
     * photography is never permitted, here or anywhere else on the site.
     */
    members: null as TeamMember[] | null,
    /** Shown while the list is empty. States the position, claims nothing. */
    pending:
      "The named professionals responsible for the work, and their credentials, are published here.",
  },

  technology: {
    title: "How technology is used",
    body: answerTo("ai"),
  },

  notYet: {
    title: "When the answer is not yet",
    body: answerTo("not-enough-yet"),
  },
} as const;
