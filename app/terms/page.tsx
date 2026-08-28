import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LegalPage } from "@/components/legal/LegalPage";
import { legalPageBySlug } from "@/lib/content/legal";

const content = legalPageBySlug("terms");

export const metadata: Metadata = {
  title: content?.title,
  /* Not indexed while this is a notice rather than the terms themselves. */
  robots: content?.document ? undefined : { index: false, follow: true },
};

export default function TermsPage() {
  if (!content) notFound();
  return <LegalPage content={content} />;
}
