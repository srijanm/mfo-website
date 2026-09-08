import { Button, Container, Section } from "@/components/foundation";
import { YearComparison } from "@/components/graphics";
import { whyItMatters } from "@/lib/content/homepage";
import { factValue } from "@/lib/content/reviewed";
import { cx } from "@/lib/cx";

import styles from "./WhyItMatters.module.css";

/**
 * The one supporting section, where there used to be two.
 *
 * The homepage spent a full section on delayed problems and another comparing
 * four alternatives, both of them before the service had been described. They
 * made the same point twice and pushed the offer six sections down the page.
 *
 * This keeps every approved example, states the mismatch in one sentence
 * instead of a table, and sends anyone who wants the full comparison to
 * /how-we-work — where it still exists in full.
 *
 * The examples are things that can happen, not things that happen to everyone.
 * Each is stated once, flatly. Nothing here counts down, escalates or warns.
 */
export function WhyItMatters() {
  const { examples } = whyItMatters;
  const lastIndex = examples.length - 1;

  return (
    <Section labelledBy="latent-problem">
      <Container>
        <div className={styles.layout}>
          <div className={styles.statement}>
            <h2 id="latent-problem" className={cx("section-headline", styles.headline)}>
              {whyItMatters.headline}
            </h2>
            <p className={styles.follow}>{whyItMatters.follow}</p>
            <p className={styles.intro}>{whyItMatters.intro}</p>
          </div>

          <ol className={styles.timeline}>
            {examples.map((example, index) => {
              const opensYearThree = index === lastIndex;
              return (
                <li
                  key={example.id}
                  className={cx(styles.entry, opensYearThree && styles.entryLate)}
                >
                  {index === 0 || opensYearThree ? (
                    <p className={styles.year}>
                      {opensYearThree ? whyItMatters.railEnd : whyItMatters.railStart}
                    </p>
                  ) : null}

                  <div className={styles.entryBody}>
                    <span aria-hidden="true" className={styles.marker} />
                    <p className={styles.entryText}>{factValue(example.summary)}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* The same point, drawn: one year that looks like every other, and one
            that does not. Supporting evidence, not a second hero. */}
        <YearComparison className={styles.comparison} />

        <div className={styles.closing}>
          <p className={styles.closingText}>{whyItMatters.closing}</p>
          <Button
            href={whyItMatters.closingCta.href}
            tone="secondary"
            placement="section"
          >
            {whyItMatters.closingCta.label}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
