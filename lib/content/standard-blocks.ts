// Standard blocks from the final structure doc. Used identically wherever a
// page references them, from this one content source — never copied into
// another file.

import { pricingPoints } from "./site-content";
import { primaryCta } from "./navigation";

/**
 * "How we behave". Four rows, shared verbatim by every audience page. The
 * homepage trust ledger states the same commitments in its own approved
 * wording; these are the audience-page versions from the final copy doc.
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
 * The compact price block on audience pages. The full tier presentation lives
 * on /pricing; this states the three figures and routes there.
 */
export const priceBlock = {
  title: "Three annual prices. Your scope is agreed before you sign up.",
  points: pricingPoints,
  perYear: "per year",
  closing:
    "Which one fits depends on the work you actually need. We tell you before you commit.",
  cta: { href: "/pricing", label: "See the full pricing" },
} as const;

/** The standard closing panel. */
export const standardClose = {
  headline: "Tell us how you earn. We’ll tell you what you actually need.",
  support: "If the answer is “not yet”, we’ll tell you that too.",
  cta: primaryCta,
} as const;
