import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LegalPage } from "@/components/legal/LegalPage";
import { legalPageBySlug } from "@/lib/content/legal";
import { pageMetadata } from "@/lib/metadata";

const content = legalPageBySlug("privacy");

export const metadata: Metadata = pageMetadata({
  title: content?.title ?? "",
  description: content?.body ?? "",
  path: "/privacy",
  /* Not indexed while this is a notice, not the policy. */
  noIndex: !content?.document,
});

export default function PrivacyPage() {
  if (!content) notFound();
  return <LegalPage content={content} />;
}
