// Standard blocks from the final structure doc. Used identically wherever a
// page references them, from this one content source — never copied into
// another file.

import { primaryCta } from "./navigation";

/**
 * The four behaviour commitments, in the copy doc's wording.
 *
 * No longer a section anywhere. They were a full block on all three audience
 * pages *and* the homepage trust ledger *and* implied again on /how-we-work —
 * four statements argued four times. Each one now sits with the step of the
 * work it actually describes on /how-we-work, and the homepage keeps three of
 * them as one quiet strip beside pricing.
 *
 * Kept here as the single source those places read from.
 */
export const howWeBehave = {
  label: "Before we file anything",
  title: "How we behave",
  rows: [
    {
      id: "draft-first",
      title: "You see the draft first.",
      body: "You read it before it goes anywhere. If something looks wrong, it’s still a draft.",
    },
    {
      id: "contact-details",
      title: "Your contact details stay yours.",
      body: "Your phone number and email remain on your own portals.",
    },
    {
      id: "who-signs",
      title: "You’ll know who signs your return.",
      body: "An ICAI-registered chartered accountant signs it, and you’ll know who before anything is filed.",
    },
    {
      id: "fee-agreed",
      title: "The fee is agreed before you start.",
      body: "Not an estimate, and not a headline price that grows.",
    },
  ],
} as const;

/**
 * The compact price block on audience pages.
 *
 * It used to print all three annual figures and re-explain the arrangement,
 * which is /pricing's whole job. An audience page now states the shape of the
 * commercial arrangement in one sentence and links to the page that owns it.
 *
 * `pricingPoints` is deliberately no longer read here: three figures on a page
 * that cannot explain which one applies invites the reader to guess.
 */
export const audienceClose = {
  headline: "One annual fee, agreed before anything starts.",
  body: "We read how you actually earn, tell you which of the work above applies to you, and put the scope and the fee in writing. You decide from there.",
  pricingLink: "See the fees",
  processLink: "How working with us works",
  /** Heading for an audience page's own questions, where it has any. */
  questionsHeadline: "Questions people in your situation ask.",
} as const;

/** The standard closing panel. */
export const standardClose = {
  headline: "Tell us how you earn. We’ll tell you what you actually need.",
  support: "If the answer is “not yet”, we’ll tell you that too.",
  cta: primaryCta,
} as const;
