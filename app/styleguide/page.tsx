import type { Metadata } from "next";

import {
  Button,
  Container,
  Disclosure,
  Grid,
  GridItem,
  Rule,
  Section,
  TextLink,
  ThresholdNode,
} from "@/components/foundation";
import {
  DeadlineRecord,
  FilingRecord,
  IncomingPaymentRecord,
} from "@/components/objects";
import { reviewed, unreviewed } from "@/lib/content/reviewed";
import {
  RecordGates,
  RecordStates,
  RecordTrack,
  WatchBracket,
  WatchEnclosure,
  WatchSightlines,
  YearBand,
  YearFolded,
  YearQuarters,
} from "@/components/illustration";
import { Plate } from "@/components/plates";
import { specimens as SAMPLE } from "@/lib/content/specimens";
import { defaultMilestones } from "@/lib/content/site-content";
import { cx } from "@/lib/cx";
import { absoluteUrl } from "@/lib/site-url";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Styleguide",
  /* Internal. Not indexed, and not linked from the site. */
  robots: { index: false, follow: false },
  alternates: { canonical: absoluteUrl("/styleguide") },
};


const PALETTE = [
  { name: "Paper", token: "--paper", value: "#F6F7F2" },
  { name: "White", token: "--white", value: "#FFFFFF" },
  { name: "Ink", token: "--ink", value: "#11130F" },
  { name: "Ink secondary", token: "--ink-2", value: "#343731" },
  { name: "Muted", token: "--muted", value: "#6A6E66" },
  { name: "Acid", token: "--acid", value: "#D7FF00" },
  { name: "Focus", token: "--focus", value: "#2457FF" },
  { name: "Error", token: "--error", value: "#B42318" },
  { name: "Success", token: "--success", value: "#2D6A4F" },
] as const;

const TYPE_SCALE = [
  { name: "Display 1", className: "display-1", token: "--fs-display-1" },
  { name: "Display 2", className: "display-2", token: "--fs-display-2" },
  { name: "H1", className: styles.h1Sample, token: "--fs-h1" },
  { name: "H2", className: styles.h2Sample, token: "--fs-h2" },
  { name: "H3", className: styles.h3Sample, token: "--fs-h3" },
  { name: "Lead", className: styles.lead, token: "--fs-lead" },
  { name: "Body", className: undefined, token: "--fs-body" },
  { name: "UI", className: styles.ui, token: "--fs-ui" },
  { name: "Small", className: styles.small, token: "--fs-small" },
] as const;

/* Two reviewed states, so the difference is visible rather than theoretical. */
const OBLIGATION_REVIEWED = {
  what: reviewed("Quarterly checkpoint", "Sample reviewer, ICAI", "2026-08-27"),
  when: reviewed("15 Sep", "Sample reviewer, ICAI", "2026-08-27"),
};

const OBLIGATION_PENDING = {
  what: unreviewed("Placeholder obligation"),
  when: unreviewed("Placeholder date"),
};

const SURFACES = [
  { id: "paper", className: "surface-paper", label: "Paper — the default" },
  { id: "white", className: "surface-white", label: "White — document objects" },
  { id: "ink", className: "surface-ink", label: "Ink — the chapter break" },
  { id: "acid", className: "surface-acid", label: "Acid — the closing panel" },
] as const;

/**
 * The same primitive, four times, once on each surface.
 *
 * This is the point of the section: a component that hard-codes a paper-surface
 * colour looks correct everywhere else and disappears on ink, and the only
 * reliable way to find that is to put it there and look.
 */
function OnEverySurface({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.surfaceRow}>
      <p className={styles.surfaceRowLabel}>{label}</p>
      <div className={styles.surfaceGrid}>
        {SURFACES.map((surface) => (
          <div key={surface.id} className={cx(styles.surfaceCell, surface.className)}>
            <span className={styles.surfaceName}>{surface.label}</span>
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Candidate line art, three per slot.
 *
 * Every candidate is shown on paper and on ink, and at two sizes: the width it
 * would take in a section, and the width it would take in a 320px viewport.
 * A drawing that only survives one of those four is not a candidate.
 */
const ILLUSTRATION_SLOTS = [
  {
    id: "year",
    title: "A. The shape of a compliance year",
    note: "For H07. The year as a structure, not a calendar grid.",
    candidates: [
      { id: "a1", label: "A1 — four quarters, one live", render: YearQuarters },
      { id: "a2", label: "A2 — the year as a band, seen at an angle", render: YearBand },
      { id: "a3", label: "A3 — one continuous line, folded", render: YearFolded },
    ],
  },
  {
    id: "watch",
    title: "B. A system watching a sequence",
    note: "For H06, which is three columns of text and nothing else.",
    candidates: [
      { id: "b1", label: "B1 — one bracket over the whole line", render: WatchBracket },
      { id: "b2", label: "B2 — the sequence inside the thing watching it", render: WatchEnclosure },
      { id: "b3", label: "B3 — one place, several things", render: WatchSightlines },
    ],
  },
  {
    id: "record",
    title: "C. A record moving through states",
    note: "For H09. Draft to filed, without naming any particular filing.",
    candidates: [
      { id: "c1", label: "C1 — the same record, four times along a track", render: RecordTrack },
      { id: "c2", label: "C2 — one record, resolving a line at a time", render: RecordStates },
      { id: "c3", label: "C3 — a record passing gates", render: RecordGates },
    ],
  },
] as const;

function Specimen({
  state,
  wide,
  children,
}: {
  state: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={
        wide ? `${styles.specimen} ${styles.specimenWide}` : styles.specimen
      }
    >
      <span className={styles.state}>{state}</span>
      {children}
    </div>
  );
}

export default function StyleguidePage() {
  return (
    <>
      <Container className={styles.intro}>
        <h1 className={styles.pageTitle}>Styleguide</h1>
        <p className={styles.pageIntro}>
          Every foundation primitive and information object, in every state.
          This page is the visual anchor for the build: if something renders
          correctly here and nowhere else, the section is wrong, not the
          primitive.
        </p>
      </Container>

      <Section labelledBy="colour" dense>
        <Container>
          <h2 id="colour" className={styles.groupTitle}>
            Colour
          </h2>
          <p className={styles.groupNote}>
            The locked palette. Acid is the only signal colour. Error and success
            are functional states and are never used for decoration.
          </p>
          <div className={styles.swatches}>
            {PALETTE.map((entry) => (
              <div key={entry.token} className={styles.swatch}>
                <div
                  className={styles.swatchChip}
                  style={{ background: `var(${entry.token})` }}
                />
                <div className={styles.swatchMeta}>
                  <div>{entry.name}</div>
                  <div className={styles.swatchToken}>{entry.token}</div>
                  <div className={styles.swatchToken}>{entry.value}</div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section labelledBy="type" dense>
        <Container>
          <h2 id="type" className={styles.groupTitle}>
            Type
          </h2>
          <p className={styles.groupNote}>
            Geist at 400, 500 and 600 only. Headlines are regular weight;
            hierarchy comes from scale and spacing rather than boldness.
          </p>
          {TYPE_SCALE.map((entry) => (
            <div key={entry.name} className={styles.typeRow}>
              <p className={styles.typeMeta}>
                {entry.name} · {entry.token}
              </p>
              <p
                className={
                  entry.className
                    ? `${entry.className} ${styles.typeSample}`
                    : styles.typeSample
                }
              >
                You do the work. We run the tax and compliance around it.
              </p>
            </div>
          ))}
          <div className={styles.typeRow}>
            <p className={styles.typeMeta}>Tabular figures · .data-number</p>
            <p className={`${styles.typeSample} data-number`}>
              1,048,576 · 03 Sep 2026 · 15 Sep
            </p>
          </div>
        </Container>
      </Section>

      <Section labelledBy="grid" dense>
        <Container>
          <h2 id="grid" className={styles.groupTitle}>
            Grid
          </h2>
          <p className={styles.groupNote}>
            12 columns on desktop, 8 on tablet, 4 on mobile. Resize to watch the
            cells recompose — the spans are declared once and each breakpoint
            reads its own.
          </p>
          <div className={styles.stack}>
            <Specimen state="Twelve single columns" wide>
              <Grid>
                {Array.from({ length: 12 }, (_, index) => (
                  <GridItem key={index} desktop={1} tablet={1} mobile={1}>
                    <div className={styles.gridCell}>{index + 1}</div>
                  </GridItem>
                ))}
              </Grid>
            </Specimen>
            <Specimen state="Five / seven split" wide>
              <Grid>
                <GridItem desktop={5} tablet={8} mobile={4}>
                  <div className={styles.gridCell}>5</div>
                </GridItem>
                <GridItem desktop={7} tablet={8} mobile={4}>
                  <div className={styles.gridCell}>7</div>
                </GridItem>
              </Grid>
            </Specimen>
          </div>
        </Container>
      </Section>

      <Section labelledBy="rules" dense>
        <Container>
          <h2 id="rules" className={styles.groupTitle}>
            Rules
          </h2>
          <p className={styles.groupNote}>
            1px lines are the grouping device and replace most containers.
            Vertical rules are a desktop device and disappear below 1024px rather
            than being squeezed.
          </p>
          <div className={styles.stack}>
            <Specimen state="Rule — default" wide>
              <Rule />
            </Specimen>
            <Specimen state="Rule — strong" wide>
              <Rule strong />
            </Specimen>
            <Specimen state="Rule — active threshold segment, 2px acid" wide>
              <Rule active />
            </Specimen>
            <Specimen state="rule-grid — bounded, gap 0, divider on both rules" wide>
              <div className={cx("rule-grid", styles.splitDemo)}>
                <p className={styles.splitPane}>
                  Left cell. Spacing is cell padding, never grid gap: a gap
                  beside a cell border leaves that border floating in empty
                  space.
                </p>
                <p className={styles.splitPane}>
                  Right cell. The divider is this cell&rsquo;s left border, so
                  it terminates on the block&rsquo;s top and bottom rules.
                  Never border-right, and never both sides of two adjacent
                  cells.
                </p>
              </div>
            </Specimen>
            <Specimen state="rule-grid — 4/8, divider on the 12-column line" wide>
              <div className={cx("rule-grid", "rule-grid--4-8", styles.splitDemo)}>
                <p className={styles.splitPane}>Four columns.</p>
                <p className={styles.splitPane}>
                  Eight columns. The left track is sized so the divider stands
                  on the gutter centre a 12-column layout would put it on.
                </p>
              </div>
            </Specimen>
          </div>
        </Container>
      </Section>

      <Section labelledBy="threshold" dense>
        <Container>
          <h2 id="threshold" className={styles.groupTitle}>
            Threshold node
          </h2>
          <p className={styles.groupNote}>
            Line plus node. Hollow means nothing has changed here yet; acid fill
            means it has. Used only where that meaning is real.
          </p>
          <div className={styles.stack}>
            <Specimen state="Inactive · active · labelled">
              <div className={styles.specimens}>
                <ThresholdNode />
                <ThresholdNode active />
                <ThresholdNode label="First income" />
                <ThresholdNode active label="First income" />
              </div>
            </Specimen>

            <Specimen
              state="Horizontal axis — third milestone active, preceding segments filled"
              wide
            >
              <div className={styles.axisScroll}>
                <div className={styles.axis}>
                  {defaultMilestones.map((milestone, index) => (
                    <ThresholdNode
                      key={milestone.id}
                      label={milestone.label}
                      active={index === 2}
                      lineBefore={index > 0}
                      lineBeforeActive={index <= 2}
                      lineAfter={index === defaultMilestones.length - 1}
                    />
                  ))}
                </div>
              </div>
            </Specimen>

            <Specimen state="Vertical ledger orientation">
              <div className={styles.axisVertical}>
                {defaultMilestones.slice(0, 3).map((milestone, index) => (
                  <ThresholdNode
                    key={milestone.id}
                    orientation="vertical"
                    label={milestone.label}
                    active={index === 0}
                    lineAfter={index < 2}
                  />
                ))}
              </div>
            </Specimen>
          </div>
        </Container>
      </Section>

      <Section labelledBy="actions" dense>
        <Container>
          <h2 id="actions" className={styles.groupTitle}>
            Actions
          </h2>
          <p className={styles.groupNote}>
            One dominant acid call to action per viewport. The reversed variant
            exists for the single acid field at the end of the page. Secondary
            actions are plain text links with an arrow and no button chrome.
          </p>
          <div className={styles.specimens}>
            <Specimen state="Primary — acid, as link">
              <Button href="/get-started">See what I need</Button>
            </Specimen>
            <Specimen state="Primary — acid, as button">
              <Button type="submit">Find the right plan</Button>
            </Specimen>
            <Specimen state="Primary — disabled">
              <Button disabled>See what I need</Button>
            </Specimen>
            <Specimen state="Primary — reversed, on acid">
              <div className={styles.onAcid}>
                <Button href="/get-started" tone="ink">
                  See what I need
                </Button>
              </div>
            </Specimen>
            <Specimen state="TextLink — with arrow">
              <TextLink href="/pricing">View pricing</TextLink>
            </Specimen>
            <Specimen state="TextLink — without arrow">
              <TextLink href="/pricing" arrow={false}>
                View pricing
              </TextLink>
            </Specimen>
          </div>
        </Container>
      </Section>

      <Section labelledBy="disclosure" dense>
        <Container>
          <h2 id="disclosure" className={styles.groupTitle}>
            Disclosure
          </h2>
          <p className={styles.groupNote}>
            A real button carrying aria-expanded, in a ruled row. The panel stays
            in the DOM and is toggled with the hidden attribute, so open and
            closed markup differ by one attribute. Opening is instant.
          </p>
          <div>
            <Disclosure summary="Closed by default">
              <p>
                The panel content sits in the document at all times. Assistive
                tech reaches it through aria-controls rather than a re-render.
              </p>
            </Disclosure>
            <Disclosure summary="Open by default" defaultOpen>
              <p>
                This one starts open so both states are visible on the page at
                once without anyone having to click.
              </p>
            </Disclosure>
            <Disclosure summary="A longer question, to show how a multi-line trigger wraps against the state marker">
              <p>
                The trigger holds its 64px minimum row height, 56px on mobile.
              </p>
            </Disclosure>
          </div>
        </Container>
      </Section>

      <Section labelledBy="objects" dense>
        <Container>
          <h2 id="objects" className={styles.groupTitle}>
            Information objects
          </h2>
          <p className={styles.groupNote}>
            Information is the illustration. These are the only card-shaped
            surfaces on the site, permitted because the content is itself an
            object. White is reserved for exactly this. Every value is a prop.
          </p>
          <div className={styles.specimens}>
            <Specimen state="IncomingPaymentRecord — populated">
              <IncomingPaymentRecord
                amount={SAMPLE.payment.amount}
                from={SAMPLE.payment.from}
                received={SAMPLE.payment.received}
                into={SAMPLE.payment.into}
                frequency={SAMPLE.payment.frequency}
                indianPayroll={SAMPLE.payment.indianPayroll}
                indiaSideSetup={SAMPLE.payment.indiaSideSetup}
                note={SAMPLE.payment.note}
              />
            </Specimen>
            <Specimen state="IncomingPaymentRecord — amount only, empty markers">
              <IncomingPaymentRecord amount={SAMPLE.payment.amount} />
            </Specimen>
            <Specimen state="FilingRecord — in progress">
              <FilingRecord
                status={SAMPLE.filingInProgress.status}
                prepared={SAMPLE.filingInProgress.prepared}
                sentToYou={SAMPLE.filingInProgress.sentToYou}
              />
            </Specimen>
            <Specimen state="FilingRecord — complete">
              <FilingRecord
                status={SAMPLE.filingComplete.status}
                prepared={SAMPLE.filingComplete.prepared}
                sentToYou={SAMPLE.filingComplete.sentToYou}
                approved={SAMPLE.filingComplete.approved}
                filed={SAMPLE.filingComplete.filed}
              />
            </Specimen>
            <Specimen state="DeadlineRecord — reviewed fact">
              <DeadlineRecord
                what={OBLIGATION_REVIEWED.what}
                when={OBLIGATION_REVIEWED.when}
                status="MFO tracks"
              />
            </Specimen>
            <Specimen state="DeadlineRecord — fact still awaiting review">
              <DeadlineRecord
                what={OBLIGATION_PENDING.what}
                when={OBLIGATION_PENDING.when}
                status="Upcoming"
              />
            </Specimen>
          </div>
        </Container>
      </Section>

      <Section labelledBy="reviewed" dense>
        <Container>
          <h2 id="reviewed" className={styles.groupTitle}>
            Reviewed facts
          </h2>
          <p className={styles.groupNote}>
            Anything carrying tax meaning is typed ReviewedFact rather than
            string, so a bare literal will not compile and every such value
            declares whether a CA has signed it off. The two DeadlineRecords above
            render identically on purpose: review status is a content question,
            not a visual one.
          </p>
          <div className={styles.factList}>
            {[
              OBLIGATION_REVIEWED.what,
              OBLIGATION_REVIEWED.when,
              OBLIGATION_PENDING.what,
            ].map((fact) => (
              <div key={fact.value} className={styles.factRow}>
                <div>{fact.value}</div>
                <div className={styles.factFlag}>
                  {fact.requiresReview
                    ? "requiresReview: true — not yet signed off"
                    : `reviewed by ${fact.reviewedBy} on ${fact.reviewedAt}`}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section labelledBy="illustration" dense>
        <Container>
          <h2 id="illustration" className={styles.groupTitle}>
            Illustration candidates
          </h2>
          <p className={styles.groupNote}>
            Line art only: strokes and no fills, neutral lines in
            <code> currentColor</code> so they invert on ink, and acid on
            exactly one element — the one that is active or changing. Strokes
            are non-scaling, so a 1px line is 1px at any render size. None of
            them carries text, and none is on the homepage yet.
          </p>
          <p className={styles.groupNote}>
            The narrow column is 128px, which is tighter than a 320px viewport
            actually gives — at that width this page drops to one column and a
            drawing gets about 248px. Anything legible at 128px is legible
            there. Resize the window to see the real one.
          </p>

          {ILLUSTRATION_SLOTS.map((slot) => (
            <div key={slot.id} className={styles.slot}>
              <h3 className={styles.slotTitle}>{slot.title}</h3>
              <p className={styles.slotNote}>{slot.note}</p>

              {slot.candidates.map((candidate) => {
                const Drawing = candidate.render;
                return (
                  <div key={candidate.id} className={styles.candidate}>
                    <p className={styles.candidateLabel}>{candidate.label}</p>
                    <div className={styles.candidateGrid}>
                      <div className={cx(styles.drawingCell, "surface-paper")}>
                        <span className={styles.cellNote}>Paper · section width</span>
                        <Drawing />
                      </div>
                      <div className={cx(styles.drawingCell, "surface-ink")}>
                        <span className={styles.cellNote}>Ink · section width</span>
                        <Drawing />
                      </div>
                      <div className={cx(styles.drawingCell, "surface-paper")}>
                        <span className={styles.cellNote}>Paper · narrow, 128px</span>
                        <div className={styles.narrow}>
                          <Drawing />
                        </div>
                      </div>
                      <div className={cx(styles.drawingCell, "surface-ink")}>
                        <span className={styles.cellNote}>Ink · narrow, 128px</span>
                        <div className={styles.narrow}>
                          <Drawing />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </Container>
      </Section>

      <Section labelledBy="surfaces" dense>
        <Container>
          <h2 id="surfaces" className={styles.groupTitle}>
            Every primitive, on every surface
          </h2>
          <p className={styles.groupNote}>
            Four surfaces, and a page carries at most one ink block and one acid
            block. Each surface rebinds the rule tokens, so a nested component
            inherits the right rules rather than hard-coding them. What it does
            not rebind is <code>--muted</code>: muted on ink is 3.6:1 and fails,
            so a component on ink has to ask for <code>--muted-on-ink</code> by
            name. Anything below that vanishes or greys out on the ink row is a
            component still assuming it is on paper.
          </p>

          <OnEverySurface label="Rule — default, strong, active">
            <div className={styles.surfaceStack}>
              <Rule />
              <Rule strong />
              <Rule active />
            </div>
          </OnEverySurface>

          <OnEverySurface label="Threshold node — inactive, active, labelled">
            <div className={styles.surfaceInline}>
              <ThresholdNode />
              <ThresholdNode active />
              <ThresholdNode active label="First income" />
            </div>
          </OnEverySurface>

          <OnEverySurface label="Type — body, lead, small label">
            <div className={styles.surfaceStack}>
              <p className={styles.typeSample}>Row title at body weight 500.</p>
              <p className={cx(styles.typeSample, styles.lead)}>
                Section intro at the lead step.
              </p>
              <p className={cx(styles.typeSample, styles.small, styles.mutedSample)}>
                Data label, small and muted
              </p>
            </div>
          </OnEverySurface>

          <OnEverySurface label="Actions — primary, reversed, text link">
            <div className={styles.surfaceInline}>
              <Button href="/get-started">See what I need</Button>
              <Button href="/get-started" tone="ink">
                See what I need
              </Button>
              <TextLink href="/pricing">View pricing</TextLink>
            </div>
          </OnEverySurface>

          <OnEverySurface label="Disclosure">
            <Disclosure summary="A question, in a ruled row">
              <p className={styles.typeSample}>
                The panel keeps its own measure on any surface.
              </p>
            </Disclosure>
          </OnEverySurface>

          <OnEverySurface label="Information object — white by definition">
            <DeadlineRecord
              what={OBLIGATION_REVIEWED.what}
              when={OBLIGATION_REVIEWED.when}
              status="MFO tracks"
            />
          </OnEverySurface>

          <OnEverySurface label="Section mark">
            <Plate kind="recognition" />
          </OnEverySurface>
        </Container>
      </Section>
    </>
  );
}
