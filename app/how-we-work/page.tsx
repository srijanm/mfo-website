import type { Metadata } from "next";

import { Button, Container, Section } from "@/components/foundation";
import { FaqSection, FinalCtaSection } from "@/components/shared";
import { howWeWork } from "@/lib/content/how-we-work";
import { conversionAssurance } from "@/lib/content/navigation";
import { standardClose } from "@/lib/content/standard-blocks";
import { pageMetadata } from "@/lib/metadata";

import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata({
  title: "How we work",
  description: howWeWork.lead,
  path: "/how-we-work",
});

/**
 * /how-we-work — what happens when you become a client.
 *
 * One job, and everything that was not that job is gone: the origin story, the
 * four-alternative comparison, the "How we behave" block and the "What we won't
 * do" list. Those were the homepage's argument repeated, and the same four
 * commitments were on all three audience pages as well.
 *
 * The five steps are the page. Each one says what you do and what we do, and
 * carries the reassurance that belongs to it — the fee with agreeing scope,
 * portal access with setup, professional responsibility with the work, draft
 * approval with filing.
 *
 * Steps four and five are marked as the recurring part, so the service does not
 * read as a sequence that finishes after one filing.
 */
export default function HowWeWorkPage() {
  const { journey } = howWeWork;

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

      <Section labelledBy="journey">
        <Container>
          <h2 id="journey" className="section-headline section-headline--wide">
            {journey.title}
          </h2>

          <div className={styles.phases}>
            {journey.phases.map((phase) => (
              <section key={phase.id} className={styles.phase} aria-label={phase.label}>
                <h3 className={styles.phaseLabel}>
                  {phase.label}
                  {"recurring" in phase && phase.recurring ? (
                    <span className={styles.recurring}>Every year</span>
                  ) : null}
                </h3>

                <ol className={styles.steps}>
                  {phase.steps.map((step) => (
                    <li key={step.id} className={styles.step}>
                      <h4 className={styles.stepTitle}>{step.title}</h4>

                      <dl className={styles.stepParts}>
                        <div className={styles.stepPart}>
                          <dt className={styles.stepWho}>You</dt>
                          <dd className={styles.stepText}>{step.you}</dd>
                        </div>
                        <div className={styles.stepPart}>
                          <dt className={styles.stepWho}>We</dt>
                          <dd className={styles.stepText}>{step.us}</dd>
                        </div>
                      </dl>

                      {step.note ? <p className={styles.stepNote}>{step.note}</p> : null}
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>

          {/* The one commitment the five steps do not already make. */}
          <p className={styles.distinct}>{howWeWork.distinct}</p>

          <div className={styles.action}>
            <Button href={standardClose.cta.href} placement="section">
              {standardClose.cta.label}
            </Button>
            <p className={styles.assurance}>{conversionAssurance}</p>
          </div>
        </Container>
      </Section>

      {/* One question, because people genuinely ask it about a small firm. */}
      <FaqSection items={howWeWork.questions} headline="One question people ask." />

      <FinalCtaSection content={standardClose} />
    </>
  );
}
