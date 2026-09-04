import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AudiencePage } from "@/components/templates/AudiencePage";
import { audienceBySlug, audiences } from "@/lib/content/audiences";
import { pageMetadata } from "@/lib/metadata";

/* One audience page renders the same dated example payment the homepage hero
   does, so like the homepage this cannot keep its build date forever. */
export const revalidate = 3600;

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

  if (!audience) return {};

  return pageMetadata({
    title: audience.name,
    description: audience.summary,
    path: `/who-its-for/${audience.slug}`,
  });
}

export default async function AudienceRoute({ params }: PageProps) {
  const { slug } = await params;
  const audience = audienceBySlug(slug);

  if (!audience) notFound();

  return <AudiencePage audience={audience} />;
}
