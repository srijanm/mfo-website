import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LegalPage } from "@/components/legal/LegalPage";
import { legalPageBySlug } from "@/lib/content/legal";

const content = legalPageBySlug("privacy");

export const metadata: Metadata = {
  title: content?.title,
  /* Not indexed while this is a notice rather than the policy itself. */
  robots: content?.document ? undefined : { index: false, follow: true },
};

export default function PrivacyPage() {
  if (!content) notFound();
  return <LegalPage content={content} />;
}
