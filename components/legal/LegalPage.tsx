import { Container, TextLink } from "@/components/foundation";
import { legalContact, type LegalPage as LegalPageContent } from "@/lib/content/legal";

import styles from "./LegalPage.module.css";

type LegalPageProps = {
  content: LegalPageContent;
};

/**
 * A legal page.
 *
 * While `document` is null the page states plainly that the document is being
 * prepared and offers a route to a person. It does not draft a policy: a
 * privacy notice or a set of terms is a legal instrument with consequences for
 * the business and for the reader, and inventing one would be worse than
 * admitting it is not written.
 *
 * When the approved text is supplied, it renders here and the notice goes.
 */
export function LegalPage({ content }: LegalPageProps) {
  return (
    <Container className={styles.page}>
      <h1 className={styles.title}>{content.headline}</h1>

      {content.document ? (
        <div className={styles.document}>{content.document}</div>
      ) : (
        <>
          <p className={styles.body}>{content.body}</p>
          <div className={styles.actions}>
            <p className={styles.prompt}>{legalContact.prompt}</p>
            <TextLink href={legalContact.href}>{legalContact.label}</TextLink>
            <TextLink href={legalContact.altHref}>{legalContact.altLabel}</TextLink>
          </div>
        </>
      )}
    </Container>
  );
}
