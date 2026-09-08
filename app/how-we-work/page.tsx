import type { Metadata } from "next";

import { Container, Section } from "@/components/foundation";
import { StructuralMismatch, TrustLedger } from "@/components/sections";
import { FinalCtaSection } from "@/components/shared";
import { howWeWork } from "@/lib/content/how-we-work";
import { standardClose } from "@/lib/content/standard-blocks";
import { pageMetadata } from "@/lib/metadata";
import { cx } from "@/lib/cx";

import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata({
  title: "How we work",
  description: howWeWork.lead,
  path: "/how-we-work",
});

/**
 * /how-we-work.
 *
 * Rebuilt around the client experience. The page used to open with why the firm
 * exists and how it uses software, which is the firm talking about itself; a
 * visitor arriving here wants to know what actually happens to them, in what
 * order, and who is responsible for it.
 *
 * So: the five steps first, split at the point where someone becomes a client;
 * then who provides what; then the accountability commitments; then the
 * comparison that used to sit on the homepage, where a reader who has got this
 * far may genuinely want it; and only then the origin story and the software
 * explanation, which are context rather than answers.
 */
export default function HowWeWorkPage() {
  const { journey, responsibilities } = howWeWork;

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

      {/* What happens, in order. */}
      <Section labelledBy="journey">
        <Container>
          <p className="section-label">{journey.label}</p>
          <h2 id="journey" className="section-headline section-headline--wide">
            {journey.title}
          </h2>

          <div className={styles.phases}>
            {journey.phases.map((phase) => (
              <section key={phase.id} className={styles.phase} aria-label={phase.label}>
                <h3 className={styles.phaseLabel}>{phase.label}</h3>
                <ol className={styles.steps}>
                  {phase.steps.map((step) => (
                    <li key={step.id} className={styles.step}>
                      <h4 className={styles.stepTitle}>{step.title}</h4>
                      <p className={styles.stepBody}>{step.body}</p>
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>
        </Container>
      </Section>

      {/* Who provides what. */}
      <Section dense labelledBy="responsibilities">
        <Container>
          <h2 id="responsibilities" className="section-headline section-headline--wide">
            {responsibilities.title}
          </h2>
          <div className={styles.responsibilities}>
            {[responsibilities.yours, responsibilities.ours].map((column) => (
              <div key={column.title} className={styles.responsibility}>
                <h3 className={styles.responsibilityTitle}>{column.title}</h3>
                <ul className={styles.responsibilityList}>
                  {column.rows.map((row) => (
                    <li key={row} className={styles.responsibilityRow}>
                      {row}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* The accountability commitments, and the filing sequence. */}
      <TrustLedger />

      {/* The comparison that used to delay the homepage. A reader who has come
          this far has chosen to look at it. */}
      <StructuralMismatch />

      {/* Context: why the firm exists, how it uses software, who signs. Below
          the answers rather than in front of them. */}
      {howWeWork.sections.map((section) => (
        <Section key={section.id} dense labelledBy={section.id}>
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

      <Section dense labelledBy="wont-do">
        <Container>
          <h2 id="wont-do" className={cx("section-headline", "section-headline--wide")}>
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
