import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LegalPage } from "@/components/legal/LegalPage";
import { legalPageBySlug } from "@/lib/content/legal";
import { pageMetadata } from "@/lib/metadata";

const content = legalPageBySlug("terms");

export const metadata: Metadata = pageMetadata({
  title: content?.title ?? "",
  description: content?.body ?? "",
  path: "/terms",
  /* Not indexed while this is a notice, not the terms. */
  noIndex: !content?.document,
});

export default function TermsPage() {
  if (!content) notFound();
  return <LegalPage content={content} />;
}
