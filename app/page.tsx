import {
  Hero,
  LatentProblemTable,
  RecognitionStrip,
  StructuralMismatch,
} from "@/components/sections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <RecognitionStrip />
      <LatentProblemTable />
      <StructuralMismatch />
    </>
  );
}
