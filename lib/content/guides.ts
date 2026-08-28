// /guides. A knowledge library, not a blog.
//
// No guides have been written and reviewed yet, so the index is empty. Each
// entry carries a last-reviewed date because tax content goes stale, and the
// index renders that date wherever it exists.

export type Guide = {
  slug: string;
  title: string;
  /** The answer in one sentence, shown on the index row. */
  answer: string;
  /** Shown only where it tells the reader something. */
  audience: string | null;
  /** ISO date. Required for anything touching tax or compliance. */
  lastReviewed: string | null;
};

export const guides: readonly Guide[] = [];

export const guidesIndex = {
  title: "Guides",
  lead: "Straight answers to the questions people actually ask about earning outside a normal Indian payroll setup.",
  pending:
    "The first guides are being written and reviewed. Anything here that touches tax or compliance will carry the date it was last checked.",
  lastReviewedLabel: "Last reviewed",
} as const;
