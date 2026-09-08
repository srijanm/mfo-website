import type { Metadata } from "next";

import { Container, Grid } from "@/components/foundation";
import { LeadForm } from "@/components/get-started/LeadForm";
import { audiences } from "@/lib/content/audiences";
import { getStarted } from "@/lib/content/get-started";
import { pageMetadata } from "@/lib/metadata";

import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Get started",
  description: getStarted.lead,
  path: "/get-started",
  /* An intake form. Nothing here to find in a search result. */
  noIndex: true,
});

/**
 * Where a `?from=` value is allowed to point.
 *
 * A closed list, not a pass-through: the parameter is only ever used to say
 * "you came from this page" back to the reader and to the person who reads the
 * enquiry. An unknown value is dropped rather than displayed, so nothing
 * arbitrary can be injected into the enquiry through a link.
 *
 * It is context, never an answer. Nothing infers how someone is paid from the
 * page they happened to arrive from — the questions do that, and the reader can
 * see exactly what is being passed along.
 */
const SOURCES: Record<string, { path: string; label: string }> = {
  ...Object.fromEntries(
    audiences.map((audience) => [
      audience.slug,
      { path: `/${audience.slug}`, label: audience.name },
    ]),
  ),
  pricing: { path: "/pricing", label: "Pricing" },
  "how-we-work": { path: "/how-we-work", label: "How we work" },
  home: { path: "/", label: "the homepage" },
};

/**
 * The enquiry: three short questions, then contact details.
 *
 * Nothing here recommends a plan or assesses anyone's position. The form
 * collects how someone earns and where they are; what follows is a person
 * reading it, not logic applied to tax rules.
 */
export default async function GetStartedPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  const source = from ? SOURCES[from] : undefined;

  return (
    <Container className={styles.page}>
      <Grid>
        <div className={styles.intro}>
          <h1 className={styles.title}>{getStarted.title}</h1>
          <p className={styles.lead}>{getStarted.lead}</p>
        </div>

        <LeadForm sourcePage={source?.path} sourceLabel={source?.label} />
      </Grid>
    </Container>
  );
}
