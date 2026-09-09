import { PageRail } from "@/components/chrome";
import {
  CoreScopeMatrix,
  Hero,
  IncomeAxis,
  RecognitionStrip,
  WhyItMatters,
} from "@/components/sections";
import { FaqSection, FinalCtaSection, PricingSection } from "@/components/shared";
import { finalCta, homepageFaq, homepageFaqHeadline } from "@/lib/content/homepage";
import { pricing } from "@/lib/content/pricing";

/**
 * The homepage.
 *
 * The order is the argument, and the argument changed: the page used to spend
 * two full sections on what goes wrong and how other options fall short before
 * saying what MyFinanceOfficer actually does. The service now arrives third.
 *
 * 1. Hero — the offer, and the two actions
 * 2. Recognition — four ways of earning, each a link to the page that owns it
 * 3. What we take responsibility for — three commitments, then eight areas
 * 4. How the work changes as a situation changes (the ink chapter)
 * 5. Why that matters — the delayed-problem examples and the mismatch, once
 * 6. The annual fee levels, with three lines of reassurance beside them
 * 7. Questions people ask
 * 8. The closing enquiry
 *
 * The standalone trust section — "Judge us by what happens before we file
 * anything", five ruled rows and a filing sequence — is gone. It argued against
 * an objection nobody had raised, repeated a promise the page had already made
 * twice, and duplicated a block that also sat on all three audience pages. Its
 * three strongest statements now sit quietly beside the fee, and the sequence
 * itself is explained on /how-we-work.
 *
 * Surfaces: paper is the default, white is reserved for literal document
 * objects, and there is at most one ink block and one acid block, never
 * adjacent.
 */
export const revalidate = 3600;

export default function HomePage() {
  return (
    <>
      {/* Mounted here rather than in the root layout: the rail points at DOM
          ids this page declares, and must not appear on pages that do not. */}
      <PageRail />

      <Hero />
      <RecognitionStrip />
      <CoreScopeMatrix />
      <IncomeAxis />
      <WhyItMatters />
      <PricingSection content={pricing} reassurance />
      <FaqSection items={homepageFaq} headline={homepageFaqHeadline} />
      <FinalCtaSection content={finalCta} />
    </>
  );
}
