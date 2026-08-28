import type { Metadata } from "next";

import { Container } from "@/components/foundation";
import { TextLink } from "@/components/foundation";
import { primaryCta } from "@/lib/content/navigation";
import { pageMetadata } from "@/lib/metadata";

import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: "How to reach MyFinanceOfficer.",
  path: "/contact",
});

/**
 * Minimal for now, but it must exist: the intake links here when a send fails
 * and as the route through for anyone who would rather not use a form. A dead
 * link on an error path is worse than a thin page.
 */
export default function ContactPage() {
  return (
    <Container className={styles.page}>
      <h1 className={styles.title}>Get in touch.</h1>
      <p className={styles.lead}>
        Contact details are being finalised. In the meantime, the quickest route is to
        tell us how you earn and we will come back to you.
      </p>
      <div className={styles.action}>
        <TextLink href={primaryCta.href}>{primaryCta.label}</TextLink>
      </div>
    </Container>
  );
}
