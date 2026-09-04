import { PageRail } from "@/components/chrome";
import {
  CoreScopeMatrix,
  Hero,
  IncomeAxis,
  LatentProblemTable,
  RecognitionStrip,
  StructuralMismatch,
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
 * Four sections that MASTER_BUILD_SPEC.md §12 places here were cut on the
 * owner's instruction: the operating model (H06), the managed calendar (H07),
 * the trust ledger (H09) and additional financial support (H11). Three of the
 * four still run on the pages that own them — the calendar on /how-it-works and
 * inside the audience template, the trust ledger on /about, additional support
 * on /pricing — so only their appearance here is gone. The operating model has
 * no other home and is now unused; its component is left in place rather than
 * deleted, so restoring it is one import.
 *
 * Surfaces alternate. Every section carried the same paper background and a
 * hairline rule, which is why consecutive sections read as one undifferentiated
 * column; paper and white now alternate down every page — see `main > section`
 * in globals.css — with the ink chapter and the acid close where CLAUDE.md puts
 * them: at most one of each, never adjacent.
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
      <PricingSection content={pricing} />
      <FaqSection items={homepageFaq} headline={homepageFaqHeadline} />
      <FinalCtaSection content={finalCta} />
    </>
  );
}
