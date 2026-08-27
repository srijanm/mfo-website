import {
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
    </>
  );
}
