import type { Metadata } from "next";

import { Container, Grid, Section } from "@/components/foundation";
import { cx } from "@/lib/cx";
import { TrustLedger } from "@/components/sections";
import { FinalCtaSection } from "@/components/shared";
import { about } from "@/lib/content/about";
import { finalCta } from "@/lib/content/homepage";
import { pageMetadata } from "@/lib/metadata";

import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description: about.headline,
  path: "/about",
});

/**
 * /about.
 *
 * Operating principles are the trust ledger — that section already is the
 * firm's operating principles, so it is reused rather than restated. How
 * technology is used, and why the answer is sometimes "not yet", quote the
 * approved answers verbatim.
 *
 * Why MFO exists has no approved copy and is the firm's own account of itself,
 * so it is left unwritten rather than drafted here.
 */
export default function AboutPage() {
  const members = about.people.members;

  return (
    <>
      <section className={styles.hero} aria-labelledby="about">
        <Container>
          <Grid>
            <div className={styles.copy}>
              <h1 id="about" className={styles.title}>
                {about.headline}
              </h1>
              {about.why ? <p className={styles.why}>{about.why}</p> : null}
            </div>
          </Grid>
        </Container>
      </section>

      {/* Operating principles */}
      <TrustLedger />

      {/* Named professionals and credentials */}
      <Section labelledBy="people">
        <Container>
          <div className={cx("rule-grid", "rule-grid--4-8", styles.split)}>
            <h2 id="people" className={styles.sectionTitle}>
              {about.people.title}
            </h2>
            <div>
              {members && members.length > 0 ? (
                <ul className={styles.members}>
                  {members.map((member) => (
                    <li key={member.name}>
                      {member.portrait ? (
                        /* Real photographs only. Dimensions are required so the
                           page does not shift as they load. */
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          className={styles.portrait}
                          src={member.portrait.src}
                          width={member.portrait.width}
                          height={member.portrait.height}
                          alt={member.portrait.alt}
                        />
                      ) : null}
                      <p className={styles.memberName}>{member.name}</p>
                      <p className={styles.memberRole}>{member.role}</p>
                      {member.credential ? (
                        <p className={styles.memberCredential}>{member.credential}</p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.pending}>{about.people.pending}</p>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* How technology is used */}
      <Section labelledBy="technology">
        <Container>
          <div className={cx("rule-grid", "rule-grid--4-8", styles.split)}>
            <h2 id="technology" className={styles.sectionTitle}>
              {about.technology.title}
            </h2>
            <p className={styles.sectionBody}>{about.technology.body}</p>
          </div>
        </Container>
      </Section>

      {/* When the answer is not yet */}
      <Section labelledBy="not-yet">
        <Container>
          <div className={cx("rule-grid", "rule-grid--4-8", styles.split)}>
            <h2 id="not-yet" className={styles.sectionTitle}>
              {about.notYet.title}
            </h2>
            <p className={styles.sectionBody}>{about.notYet.body}</p>
          </div>
        </Container>
      </Section>

      <FinalCtaSection content={finalCta} />
    </>
  );
}
