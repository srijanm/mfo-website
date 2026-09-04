import type { Metadata } from "next";

import { Container, Section } from "@/components/foundation";
import { FinalCtaSection } from "@/components/shared";
import { howWeWork } from "@/lib/content/how-we-work";
import { standardClose } from "@/lib/content/standard-blocks";
import { pageMetadata } from "@/lib/metadata";

import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata({
  title: "How we work",
  description: howWeWork.lead,
  path: "/how-we-work",
});

/**
 * /how-we-work, replacing /about. No people, stated plainly rather than
 * avoided: the page says who signs, how software is used and what the firm
 * refuses to do, in the order the structure doc gives.
 */
export default function HowWeWorkPage() {
  return (
    <>
      <section className={styles.hero} aria-labelledby="how-we-work-headline">
        <Container>
          <h1 id="how-we-work-headline" className={styles.headline}>
            {howWeWork.headline}
          </h1>
          <p className={styles.lead}>{howWeWork.lead}</p>
        </Container>
      </section>

      {howWeWork.sections.map((section) => (
        <Section key={section.id} labelledBy={section.id}>
          <Container>
            <div className={styles.split}>
              <h2 id={section.id} className={styles.sectionTitle}>
                {section.title}
              </h2>
              <div className={styles.body}>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className={styles.paragraph}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </Container>
        </Section>
      ))}

      <Section labelledBy="wont-do">
        <Container>
          <h2 id="wont-do" className="section-headline">
            {howWeWork.wontDo.title}
          </h2>
          <ul className={styles.rows}>
            {howWeWork.wontDo.rows.map((row) => (
              <li key={row.id} className={styles.row}>
                <h3 className={styles.rowTitle}>{row.title}</h3>
                <p className={styles.rowBody}>{row.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <FinalCtaSection content={standardClose} />
    </>
  );
}
