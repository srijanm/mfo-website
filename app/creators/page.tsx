import type { Metadata } from "next";

import { AudiencePage } from "@/components/templates/AudiencePage";
import { audienceBySlug } from "@/lib/content/audiences";
import { pageMetadata } from "@/lib/metadata";

const audience = audienceBySlug("creators")!;

export const metadata: Metadata = pageMetadata({
  title: audience.name,
  description: audience.metaDescription,
  path: "/creators",
});

export default function CreatorsPage() {
  return <AudiencePage audience={audience} />;
}
