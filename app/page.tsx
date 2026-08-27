import {
  AdditionalFinancialSupport,
  CoreScopeMatrix,
  Faq,
  FinalCta,
  Hero,
  IncomeAxis,
  LatentProblemTable,
  OperatingModel,
  PricingGrid,
  RecognitionStrip,
  StructuralMismatch,
  TemporalLedger,
  TrustLedger,
} from "@/components/sections";

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
      <PricingGrid />
      <AdditionalFinancialSupport />
      <Faq />
      <FinalCta />
    </>
  );
}
