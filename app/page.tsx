import {
  Hero,
  IncomeAxis,
  LatentProblemTable,
  OperatingModel,
  RecognitionStrip,
  StructuralMismatch,
  TemporalLedger,
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
    </>
  );
}
