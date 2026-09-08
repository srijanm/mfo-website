import { PageRail } from "@/components/chrome";
import {
  CoreScopeMatrix,
  Hero,
  IncomeAxis,
  RecognitionStrip,
  TrustLedger,
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
 * 6. What we commit to before filing anything
 * 7. The annual fee levels
 * 8. Questions people ask
 * 9. The closing enquiry
 *
 * Two sections were consolidated into one and the full alternatives comparison
 * moved to /how-we-work, where a reader who wants it has already chosen to
 * look. The page is shorter than it was, not longer.
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
      <TrustLedger />
      <PricingSection content={pricing} />
      <FaqSection items={homepageFaq} headline={homepageFaqHeadline} />
      <FinalCtaSection content={finalCta} />
    </>
  );
}
