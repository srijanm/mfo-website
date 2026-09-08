import type { Metadata } from "next";

import { Button, Container } from "@/components/foundation";
import { contactMethods, hasPublicContact, publicContact } from "@/lib/content/contact";
import { conversionAssurance, primaryCta } from "@/lib/content/navigation";
import { pageMetadata } from "@/lib/metadata";

import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: "How to reach MyFinanceOfficer.",
  path: "/contact",
});

/**
 * /contact.
 *
 * This page and the enquiry form used to point at each other: the form
 * advertised /contact as the way through if you would rather not use a form and
 * as its fallback when a send failed, and /contact's only content was a button
 * back to the form. Someone whose submission had just failed was sent in a
 * circle.
 *
 * The loop is broken from both ends. The form offers this page only when a
 * genuinely independent route exists, and this page renders what actually
 * exists rather than a promise:
 *
 *  - With approved public contact details, they are shown, and they are a real
 *    alternative to the form.
 *  - Without them, the page says plainly that the form is currently the only
 *    way in. It does not claim to be a workaround it cannot be, and it does not
 *    publish LEAD_TO_EMAIL — that is where enquiries are delivered and may well
 *    be a private inbox.
 */
export default function ContactPage() {
  const methods = contactMethods();
  const hasContact = hasPublicContact();

  return (
    <Container className={styles.page}>
      <h1 className={styles.title}>Get in touch.</h1>

      {hasContact ? (
        <>
          <p className={styles.lead}>
            Any of these reaches a person. If you would rather answer a few questions
            first, the enquiry form is the quickest way to give us what we need.
          </p>

          <ul className={styles.methods}>
            {methods.map((method) => (
              <li key={method.id} className={styles.method}>
                <span className={styles.methodLabel}>{method.label}</span>
                <a
                  href={method.href}
                  className={styles.methodValue}
                  data-contact-method={method.id}
                >
                  {method.value}
                </a>
              </li>
            ))}
          </ul>

          {publicContact.responseTime ? (
            <p className={styles.note}>{publicContact.responseTime}</p>
          ) : null}
        </>
      ) : (
        <>
          {/* Honest rather than reassuring. Saying "contact details are being
              finalised" and offering only a link back to the form told the
              reader nothing they could act on. */}
          <p className={styles.lead}>
            We don’t publish a phone number or a general inbox yet, so the enquiry form
            is currently the only way to reach us. It goes to a person, not an
            autoresponder.
          </p>
          <p className={styles.note}>
            If a submission failed, nothing was lost at your end — your answers stay on
            the page and you can send again.
          </p>
        </>
      )}

      <div className={styles.action}>
        <Button href={primaryCta.href} placement="contact">
          {primaryCta.label}
        </Button>
        <p className={styles.assurance}>{conversionAssurance}</p>
      </div>
    </Container>
  );
}
