import { PageRail } from "@/components/chrome";
import {
  CoreScopeMatrix,
  Hero,
  IncomeAxis,
  LatentProblemTable,
  RecognitionStrip,
  StructuralMismatch,
  TrustLedger,
} from "@/components/sections";
import { FaqSection, FinalCtaSection, PricingSection } from "@/components/shared";
import { finalCta, homepageFaq, homepageFaqHeadline } from "@/lib/content/homepage";
import { pricing } from "@/lib/content/pricing";

/**
 * The homepage argument.
 *
 * The order is the argument: recognition before problem, problem before
 * mismatch, mismatch before the system, and the whole core relationship before
 * price.
 *
 * 1. Hero
 * 2. Recognition
 * 3. Latent problem
 * 4. Structural mismatch
 * 5. Income Axis
 * 6. Core CA/compliance scope
 * 7. Pricing
 * 8. FAQ
 * 9. Final acid CTA
 * 10. Footer (in the root layout)
 *
 * Three sections that MASTER_BUILD_SPEC.md §12 places here stay cut on the
 * owner's instruction: the operating model (H06), the managed calendar (H07)
 * and additional financial support (H11) — the last still runs on /pricing.
 * The trust ledger (H09) is back per the final structure doc, carrying the
 * amended signatory row and the filing sequence that moved here when
 * /how-it-works was retired.
 *
 * Surfaces follow the contract: paper is the default, white is reserved for
 * literal document objects, and the ink chapter and acid close sit where
 * CLAUDE.md puts them — at most one of each, never adjacent.
 */
/**
 * The hero's example payment is dated today, so this page cannot be a build
 * artefact that keeps its build date forever. An hour is far finer than the
 * day the date is stated to, and the page is otherwise entirely static.
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
      <LatentProblemTable />
      <StructuralMismatch />
      <IncomeAxis />
      <CoreScopeMatrix />
      <TrustLedger />
      <PricingSection content={pricing} />
      <FaqSection items={homepageFaq} headline={homepageFaqHeadline} />
      <FinalCtaSection content={finalCta} />
    </>
  );
}
