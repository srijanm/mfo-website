import {
  AdditionalFinancialSupport,
  CoreScopeMatrix,
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
    </>
  );
}
