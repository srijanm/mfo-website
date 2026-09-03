"use client";

import { useRevealOnce } from "@/components/motion";
import { cx } from "@/lib/cx";

import styles from "./Illustration.module.css";

type Props = { className?: string };

/**
 * Line art for three slots on the homepage.
 *
 * Every drawing obeys the same rules: strokes only and no fills, neutral lines
 * in currentColor so they invert on the ink surface, acid on exactly one
 * element — the one that is active or changing — and an explicit viewBox and
 * pixel dimensions so nothing reflows while the page loads.
 *
 * None carries text. A drawing that needed a label would be carrying content,
 * and content lives in lib/content/; these carry structure only, so every one
 * is hidden from assistive tech.
 *
 * Each has a simpler form below 768px: the parts marked `detail` are dropped,
 * and every drawing is composed so that dropping them leaves a complete figure
 * rather than a gap. No size is set as a percentage — a percent sign inside an
 * SVG reads to guardrails as an illustration drawing a rate — so the responsive
 * width lives in the stylesheet.
 *
 * Each draws itself on once, the first time it is reached: the strokes run out
 * from nothing over 700ms and the acid element resolves after them, so the
 * figure assembles and the one thing that is changing arrives last. It never
 * replays — the observer disconnects the moment it fires — and nothing here
 * rotates, pulses or loops.
 *
 * The mechanism is `stroke-dashoffset` over shapes that declare
 * `pathLength="1"`, which is what lets a single dash length cover a 350-unit
 * arc and a 12-unit tick alike. That resting state is gated in the stylesheet,
 * so with no JavaScript or under reduced motion no dash is applied at all and
 * the drawing is simply there, complete, at full stroke.
 */
function Frame({
  viewBox,
  width,
  height,
  className,
  children,
}: Props & {
  viewBox: string;
  width: number;
  height: number;
  children: React.ReactNode;
}) {
  /* Observed on the drawing itself rather than on a wrapper. A wrapper would
     either take part in the section's grid, or use display:contents and
     generate no box at all — and an element with no box is never intersected,
     so the drawing would stay at zero stroke forever. */
  const { ref, revealed } = useRevealOnce<SVGSVGElement>();

  return (
    <svg
      ref={ref}
      aria-hidden="true"
      focusable="false"
      viewBox={viewBox}
      width={width}
      height={height}
      preserveAspectRatio="xMidYMid meet"
      className={cx(styles.svg, revealed && styles.isDrawn, className)}
    >
      {children}
    </svg>
  );
}

/**
 * H07 — the shape of a compliance year.
 *
 * A closed cycle in four quarters with one of them live. It replaces the tick
 * dial: a dial invites a reading of where in the year something falls, and this
 * says only that a year is a closed thing in parts.
 *
 * Narrow: the inner ring goes and the quarters carry it alone.
 */
export function YearQuarters({ className }: Props) {
  return (
    <Frame viewBox="0 0 160 160" width={160} height={160} className={className}>
      <circle className="detail" pathLength={1} cx="80" cy="80" r="36" />
      <path className="acid" pathLength={1} d="M136 80 A56 56 0 0 1 80 136" />
      <path pathLength={1} d="M80 136 A56 56 0 0 1 24 80" />
      <path pathLength={1} d="M24 80 A56 56 0 0 1 80 24" />
      <path pathLength={1} d="M80 24 A56 56 0 0 1 136 80" />
      <path pathLength={1} d="M128 80 H148 M80 128 V148 M32 80 H12 M80 32 V12" />
    </Frame>
  );
}

/**
 * H06 — a system watching a sequence.
 *
 * One bracket over the whole line, attending to a single point on it. That is
 * the operating model stated as a shape: the sequence is yours, the watching
 * is ours.
 *
 * Narrow: the two unmarked intermediate nodes go, leaving three still evenly
 * spaced along the same line.
 */
export function WatchBracket({ className }: Props) {
  return (
    <Frame viewBox="0 0 240 120" width={240} height={120} className={className}>
      <path pathLength={1} d="M24 58 V34 H216 V58" />
      <path pathLength={1} d="M24 88 H216" />
      <path pathLength={1} d="M120 34 V82" />
      <circle pathLength={1} className="node" cx="24" cy="88" r="5" />
      <circle pathLength={1} className="node detail" cx="72" cy="88" r="5" />
      <circle pathLength={1} className="node acid" cx="120" cy="88" r="5" />
      <circle pathLength={1} className="node detail" cx="168" cy="88" r="5" />
      <circle pathLength={1} className="node" cx="216" cy="88" r="5" />
    </Frame>
  );
}

/**
 * H09 — a record moving through states.
 *
 * One record, resolving a line at a time, with the last line marked. It names
 * no filing and no stage: the shape is four states and a finish, and the words
 * beside it are what say which.
 *
 * Narrow: the internal hairlines go and the four frames carry it, so the figure
 * loses density rather than losing a state.
 */
export function RecordStates({ className }: Props) {
  const frames = [
    { x: 20, lines: 1 },
    { x: 76, lines: 2 },
    { x: 132, lines: 3 },
    { x: 188, lines: 3 },
  ];

  return (
    <Frame viewBox="0 0 240 120" width={240} height={120} className={className}>
      {frames.map((frame) => (
        <g key={frame.x}>
          <rect pathLength={1} x={frame.x} y="20" width="36" height="52" rx="4" />
          <path
            pathLength={1}
            className="detail"
            d={Array.from(
              { length: frame.lines },
              (_, i) => `M${frame.x + 8} ${34 + i * 11} H${frame.x + 28}`,
            ).join(" ")}
          />
        </g>
      ))}
      <path className="acid" pathLength={1} d="M196 67 H216" />
      <path pathLength={1} d="M38 88 H206" />
    </Frame>
  );
}
