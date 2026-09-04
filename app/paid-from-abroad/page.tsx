import type { Metadata } from "next";

import { AudiencePage } from "@/components/templates/AudiencePage";
import { audienceBySlug } from "@/lib/content/audiences";
import { pageMetadata } from "@/lib/metadata";

/* This page renders the same dated example payment the homepage hero does, so
   like the homepage it cannot keep its build date forever. */
export const revalidate = 3600;

const audience = audienceBySlug("paid-from-abroad")!;

export const metadata: Metadata = pageMetadata({
  title: audience.name,
  description: audience.metaDescription,
  path: "/paid-from-abroad",
});

export default function PaidFromAbroadPage() {
  return <AudiencePage audience={audience} />;
}
