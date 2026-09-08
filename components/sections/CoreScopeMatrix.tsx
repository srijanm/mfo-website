import { Button, Container, Section } from "@/components/foundation";
import { coreScopeSection } from "@/lib/content/homepage";
import { primaryCta } from "@/lib/content/navigation";
import { cx } from "@/lib/cx";

import styles from "./CoreScopeMatrix.module.css";

type CoreScopeMatrixProps = {
  /** Small muted label above the heading, where a page names the register. */
  label?: string;
  /** Overrides the homepage headline — /pricing titles this "What the fee covers". */
  headline?: string;
  /** The pricing page closes with its own action, so it turns this one off. */
  showAction?: boolean;
};

/**
 * H08 — the core CA and compliance work.
 *
 * Eight identical bordered cards became a four-column introduction beside an
 * eight-column list in two columns. Each entry is an index, a title, a
 * description and a hairline under it — open rows rather than boxes, so the
 * section reads as a list of areas instead of a wall of tiles.
 *
 * Layer A only. §20 forbids FX, insurance, loans, wealth planning and MIS from
 * appearing here, so this reads exclusively from `coreScope`; lib/content
 * asserts at module load that no Layer B item has leaked into that list. It
 * describes the core relationship, never what any plan includes.
 *
 * The qualifications in the descriptions — "where relevant", "according to the
 * scope of your engagement" — are part of the approved copy and are rendered
 * verbatim.
 */
export function CoreScopeMatrix({ label, headline, showAction = true }: CoreScopeMatrixProps) {
  const { items } = coreScopeSection;

  return (
    <Section id="core-scope" dense labelledBy="core-scope-headline">
      <Container>
        <div className={styles.layout}>
          <div className={styles.intro}>
            {label ? <p className="section-label">{label}</p> : null}
            <h2 id="core-scope-headline" className={cx("section-headline", styles.headline)}>
              {headline ?? coreScopeSection.headline}
            </h2>

            {/* The way out of the section, beside the heading rather than
                stranded under the list. */}
            {showAction ? (
              <div className={styles.action}>
                <Button href={primaryCta.href} tone="secondary">
                  {primaryCta.label}
                </Button>
              </div>
            ) : null}
          </div>

          <ol className={styles.list}>
            {items.map((item, index) => (
              <li key={item.id} className={styles.entry}>
                <span aria-hidden="true" className={cx(styles.index, "data-number")}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className={styles.entryBody}>
                  <h3 className={styles.entryTitle}>{item.title}</h3>
                  <p className={styles.entryText}>{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
