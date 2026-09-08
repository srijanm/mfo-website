"use client";

import { useId, useRef, useState } from "react";

import { Button, Container, Section } from "@/components/foundation";
import { WorkDocket } from "@/components/graphics";
import { docketGraphic } from "@/lib/content/graphics";
import { incomeAxis } from "@/lib/content/homepage";
import { primaryCta } from "@/lib/content/navigation";
import { cx } from "@/lib/cx";

import styles from "./IncomeAxis.module.css";

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * H05 — the one dark chapter. Five stages of a working year, on demand.
 *
 * The heading, the stage control, the explanation and the graphic are one unit
 * in ordinary document flow. Nothing here pins, scrubs or advances on its own:
 * the reader picks a stage and it changes, and every stage is reachable without
 * scrolling through the other four.
 *
 * Two presentations, and only ever one of them in the document at a time —
 * `display: none` removes the other from the accessibility tree as well as from
 * the page, so nothing is announced twice:
 *
 *   - Desktop is a real tab interface: `role="tablist"` with roving tabindex,
 *     arrow/Home/End keys, and one panel naming the tab that describes it.
 *   - Below 900px it is a five-item accordion, first item open, one open at a
 *     time, each revealing its question, explanation and a compact docket in
 *     normal flow. No sideways-scrolling timeline with unreadable labels.
 *
 * Both read the same `incomeAxis.milestones`, so the controls, the copy and the
 * graphic cannot disagree about what stage three is.
 *
 * The stage panel is not given a large min-height. Switching tabs moves the
 * content below by the difference between two short paragraphs, which is a few
 * pixels, rather than by the hundreds a reserved block would cost all the time.
 */
export function IncomeAxis() {
  const { fieldLabels, milestones } = incomeAxis;
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const baseId = useId();

  const stage = milestones[active];
  const tabId = (index: number) => `${baseId}-tab-${milestones[index].id}`;
  const panelId = (index: number) => `${baseId}-panel-${milestones[index].id}`;

  const select = (index: number) => {
    setActive(index);
    listRef.current
      ?.querySelectorAll<HTMLButtonElement>("[role=tab]")
      ?.[index]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const last = milestones.length - 1;
    const moves: Record<string, number> = {
      ArrowRight: active === last ? 0 : active + 1,
      ArrowDown: active === last ? 0 : active + 1,
      ArrowLeft: active === 0 ? last : active - 1,
      ArrowUp: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    };
    const next = moves[event.key];
    if (next === undefined) return;
    event.preventDefault();
    select(next);
  };

  return (
    <Section labelledBy="income-axis" className={cx("surface-ink", styles.section)}>
      <Container>
        <div className={styles.intro}>
          <h2 id="income-axis" className="section-headline section-headline--wide">
            {incomeAxis.headline}
          </h2>
          <p className={styles.lede}>{incomeAxis.intro}</p>
        </div>

        {/* ------------------------------------------------------ desktop */}

        <div className={styles.tabs}>
          <div
            ref={listRef}
            role="tablist"
            aria-label={incomeAxis.headline}
            className={styles.tablist}
            onKeyDown={onKeyDown}
          >
            {milestones.map((milestone, index) => (
              <button
                key={milestone.id}
                type="button"
                role="tab"
                id={tabId(index)}
                aria-selected={index === active}
                aria-controls={panelId(index)}
                tabIndex={index === active ? 0 : -1}
                className={cx(styles.tab, index === active && styles.tabOn)}
                onClick={() => setActive(index)}
              >
                <span className={cx(styles.tabNumber, "data-number")}>{pad(index + 1)}</span>
                <span className={styles.tabLabel}>{milestone.label}</span>
              </button>
            ))}
          </div>

          {/* Keyed on the stage so switching tabs remounts the panel, which is
              what re-runs the 200ms entrance below. Without it React reuses the
              nodes, the animation fires once on load and never again. Focus
              lives on the tab button, not inside the panel, so nothing loses
              it. */}
          <div
            key={stage.id}
            id={panelId(active)}
            role="tabpanel"
            aria-labelledby={tabId(active)}
            tabIndex={0}
            className={styles.panel}
          >
            <div className={styles.explanation}>
              <p className={styles.fieldLabel}>{fieldLabels.question}</p>
              <p className={styles.question}>{stage.question}</p>

              <p className={styles.fieldLabel}>{fieldLabels.mfo}</p>
              <p className={styles.answer}>{stage.mfo}</p>

              <div className={styles.action}>
                <Button href={primaryCta.href} tone="secondary">
                  {primaryCta.label}
                </Button>
              </div>
            </div>

            <div className={styles.graphic}>
              <WorkDocket
                stageId={stage.id}
                index={active + 1}
                total={milestones.length}
                title={stage.label}
                work={stage.mfo}
              />
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------- narrow */}

        <div className={styles.accordion}>
          {milestones.map((milestone, index) => {
            const open = index === active;
            return (
              <div key={milestone.id} className={cx(styles.item, open && styles.itemOpen)}>
                <h3 className={styles.itemHeading}>
                  <button
                    type="button"
                    id={`${baseId}-acc-${milestone.id}`}
                    aria-expanded={open}
                    aria-controls={`${baseId}-accpanel-${milestone.id}`}
                    className={styles.itemTrigger}
                    onClick={() => setActive(index)}
                  >
                    <span className={cx(styles.itemNumber, "data-number")}>
                      {pad(index + 1)} {docketGraphic.ofLabel} {pad(milestones.length)}
                    </span>
                    <span className={styles.itemLabel}>{milestone.label}</span>
                    <span aria-hidden="true" className={styles.itemMarker} />
                  </button>
                </h3>

                <div
                  id={`${baseId}-accpanel-${milestone.id}`}
                  role="region"
                  aria-labelledby={`${baseId}-acc-${milestone.id}`}
                  hidden={!open}
                  className={styles.itemPanel}
                >
                  <p className={styles.fieldLabel}>{fieldLabels.question}</p>
                  <p className={styles.question}>{milestone.question}</p>

                  <WorkDocket
                    compact
                    stageId={milestone.id}
                    index={index + 1}
                    total={milestones.length}
                    title={milestone.label}
                    work={milestone.mfo}
                    className={styles.compactDocket}
                  />

                  <div className={styles.action}>
                    <Button href={primaryCta.href} tone="secondary">
                      {primaryCta.label}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
