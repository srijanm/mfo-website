import type { Metadata } from "next";

import { AudiencePage } from "@/components/templates/AudiencePage";
import { audienceBySlug } from "@/lib/content/audiences";
import { pageMetadata } from "@/lib/metadata";

const audience = audienceBySlug("freelancers")!;

export const metadata: Metadata = pageMetadata({
  title: audience.name,
  description: audience.metaDescription,
  path: "/freelancers",
});

export default function FreelancersPage() {
  return <AudiencePage audience={audience} />;
}
