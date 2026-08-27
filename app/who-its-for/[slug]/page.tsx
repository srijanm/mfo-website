import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AudiencePage } from "@/components/templates/AudiencePage";
import { audienceBySlug, audiences } from "@/lib/content/audiences";

type PageProps = {
  params: Promise<{ slug: string }>;
};

/** One route for all four audiences, generated from the content list. */
export function generateStaticParams() {
  return audiences.map((audience) => ({ slug: audience.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const audience = audienceBySlug(slug);

  return audience ? { title: audience.name, description: audience.summary } : {};
}

export default async function AudienceRoute({ params }: PageProps) {
  const { slug } = await params;
  const audience = audienceBySlug(slug);

  if (!audience) notFound();

  return <AudiencePage audience={audience} />;
}
