import {
  AdditionalFinancialSupport,
  CoreScopeMatrix,
  Hero,
  IncomeAxis,
  LatentProblemTable,
  OperatingModel,
  RecognitionStrip,
  StructuralMismatch,
  TemporalLedger,
  TrustLedger,
} from "@/components/sections";
import { FaqSection, FinalCtaSection, PricingSection } from "@/components/shared";
import { finalCta, homepageFaq } from "@/lib/content/homepage";
import { pricing } from "@/lib/content/pricing";

/**
 * The homepage argument, in the order locked by MASTER_BUILD_SPEC.md §12.
 * The order is the argument: recognition before problem, problem before
 * mismatch, mismatch before the system, and the whole core relationship
 * before any mention of broader financial services.
 *
 * 1. Hero
 * 2. Recognition
 * 3. Latent problem
 * 4. Structural mismatch
 * 5. Income Axis
 * 6. Operating model
 * 7. Managed calendar
 * 8. Core CA/compliance scope
 * 9. Trust ledger
 * 10. Pricing
 * 11. Additional financial support
 * 12. FAQ
 * 13. Final acid CTA
 * 14. Footer (in the root layout)
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <RecognitionStrip />
      <LatentProblemTable />
      <StructuralMismatch />
      <IncomeAxis />
      <OperatingModel />
      <TemporalLedger />
      <CoreScopeMatrix />
      <TrustLedger />
      <PricingSection content={pricing} />
      <AdditionalFinancialSupport />
      <FaqSection items={homepageFaq} />
      <FinalCtaSection content={finalCta} />
    </>
  );
}
