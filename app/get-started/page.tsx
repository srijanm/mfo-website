import type { Metadata } from "next";

import { Container, Grid } from "@/components/foundation";
import { LeadForm } from "@/components/get-started/LeadForm";
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
 * The four-step intake from §27.
 *
 * Nothing here recommends a plan. The form collects how someone earns and
 * where they are; what follows is a conversation, not logic applied to tax
 * rules.
 */
export default function GetStartedPage() {
  return (
    <Container className={styles.page}>
      <Grid>
        <div className={styles.intro}>
          <h1 className={styles.title}>{getStarted.title}</h1>
          <p className={styles.lead}>{getStarted.lead}</p>
        </div>

        <LeadForm />
      </Grid>
    </Container>
  );
}
