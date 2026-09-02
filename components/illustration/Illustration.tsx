import { cx } from "@/lib/cx";

import styles from "./Illustration.module.css";

type Props = { className?: string };

/**
 * Candidate line art for three slots.
 *
 * Every drawing here obeys the same rules: strokes only and no fills, neutral
 * lines in currentColor so they invert on the ink surface, acid on exactly one
 * element — the one that is active or changing — and an explicit viewBox so
 * nothing reflows while the page loads.
 *
 * None of them carries text. A drawing that needed a label would be carrying
 * content, and content lives in lib/content/; these carry structure only, so
 * every one of them is hidden from assistive tech.
 *
 * Sizes are set in CSS rather than on the element, because a width attribute in
 * percent would put a percent sign inside an SVG, and guardrails reads that as
 * an illustration drawing a rate.
 */
function Frame({
  viewBox,
  className,
  children,
}: Props & { viewBox: string; children: React.ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      className={cx(styles.svg, className)}
    >
      {children}
    </svg>
  );
}

/* ------------------------------------------------- A. The shape of a year */

/** A1 — the year as a closed cycle in four quarters, one of them live. */
export function YearQuarters({ className }: Props) {
  return (
    <Frame viewBox="0 0 160 160" className={className}>
      <circle cx="80" cy="80" r="36" />
      <path className="acid" d="M136 80 A56 56 0 0 1 80 136" />
      <path d="M80 136 A56 56 0 0 1 24 80" />
      <path d="M24 80 A56 56 0 0 1 80 24" />
      <path d="M80 24 A56 56 0 0 1 136 80" />
      <path d="M128 80 H148 M80 128 V148 M32 80 H12 M80 32 V12" />
    </Frame>
  );
}

/** A2 — the year as a band seen at an angle, divided into twelve. */
export function YearBand({ className }: Props) {
  const A = { x: 16, y: 76 };
  const B = { x: 208, y: 32 };
  const D = { x: 32, y: 92 };
  const C = { x: 224, y: 48 };
  const at = (from: { x: number; y: number }, to: { x: number; y: number }, t: number) => ({
    x: from.x + (to.x - from.x) * t,
    y: from.y + (to.y - from.y) * t,
  });
  const divisions = Array.from({ length: 11 }, (_, i) => {
    const t = (i + 1) / 12;
    const top = at(A, B, t);
    const bottom = at(D, C, t);
    return `M${top.x.toFixed(1)} ${top.y.toFixed(1)} L${bottom.x.toFixed(1)} ${bottom.y.toFixed(1)}`;
  }).join(" ");
  const live = { top: at(A, B, 4 / 12), next: at(A, B, 5 / 12) };

  return (
    <Frame viewBox="0 0 240 120" className={className}>
      <path d={`M${A.x} ${A.y} L${B.x} ${B.y} L${C.x} ${C.y} L${D.x} ${D.y} Z`} />
      <path d={divisions} />
      <path
        className="acid"
        d={`M${live.top.x.toFixed(1)} ${live.top.y.toFixed(1)} L${live.next.x.toFixed(1)} ${live.next.y.toFixed(1)}`}
      />
    </Frame>
  );
}

/** A3 — the year as one continuous line that folds back on itself. */
export function YearFolded({ className }: Props) {
  return (
    <Frame viewBox="0 0 240 140" className={className}>
      <path d="M24 26 H198 A16 16 0 0 1 198 58 H42 A16 16 0 0 0 42 90 H198 A16 16 0 0 1 198 122 H24" />
      <circle className="node" cx="214" cy="42" r="5" />
      <circle className="node acid" cx="26" cy="74" r="5" />
      <circle className="node" cx="214" cy="106" r="5" />
    </Frame>
  );
}

/* --------------------------------------- B. A system watching a sequence */

/** B1 — one bracket over the whole line, attending to a single point. */
export function WatchBracket({ className }: Props) {
  return (
    <Frame viewBox="0 0 240 120" className={className}>
      <path d="M24 58 V34 H216 V58" />
      <path d="M24 88 H216" />
      <path d="M120 34 V82" />
      <circle className="node" cx="24" cy="88" r="5" />
      <circle className="node" cx="72" cy="88" r="5" />
      <circle className="node acid" cx="120" cy="88" r="5" />
      <circle className="node" cx="168" cy="88" r="5" />
      <circle className="node" cx="216" cy="88" r="5" />
    </Frame>
  );
}

/** B2 — the sequence sits inside the thing that is watching it. */
export function WatchEnclosure({ className }: Props) {
  return (
    <Frame viewBox="0 0 240 120" className={className}>
      <rect x="14" y="14" width="212" height="92" rx="12" />
      <rect x="34" y="34" width="172" height="52" rx="6" />
      <path d="M62 48 V72 M104 48 V72 M188 48 V72" />
      <path className="acid" d="M146 44 V76" />
    </Frame>
  );
}

/** B3 — one place, several things, one of them moving. */
export function WatchSightlines({ className }: Props) {
  return (
    <Frame viewBox="0 0 240 140" className={className}>
      <rect x="18" y="58" width="24" height="24" rx="2" />
      <path d="M42 70 L196 28 M42 70 L196 70 M42 70 L196 112" />
      <path d="M204 20 V120" />
      <circle className="node" cx="196" cy="28" r="5" />
      <circle className="node acid" cx="196" cy="70" r="5" />
      <circle className="node" cx="196" cy="112" r="5" />
    </Frame>
  );
}

/* ------------------------------------- C. A record moving through states */

/** C1 — the same record, four times along a track. */
export function RecordTrack({ className }: Props) {
  const sheets = [20, 76, 132, 188];
  return (
    <Frame viewBox="0 0 240 140" className={className}>
      {sheets.map((x) => (
        <g key={x}>
          <path d={`M${x} 46 L${x + 34} 32 L${x + 34} 72 L${x} 86 Z`} />
          <path d={`M${x + 7} 58 L${x + 27} 51 M${x + 7} 68 L${x + 22} 63`} />
        </g>
      ))}
      <path d="M24 112 H216" />
      <circle className="node" cx="37" cy="112" r="5" />
      <circle className="node" cx="93" cy="112" r="5" />
      <circle className="node" cx="149" cy="112" r="5" />
      <circle className="node acid" cx="205" cy="112" r="5" />
    </Frame>
  );
}

/** C2 — one record, resolving a line at a time. */
export function RecordStates({ className }: Props) {
  const frames = [
    { x: 20, lines: 1 },
    { x: 76, lines: 2 },
    { x: 132, lines: 3 },
    { x: 188, lines: 3 },
  ];
  return (
    <Frame viewBox="0 0 240 120" className={className}>
      {frames.map((frame) => (
        <g key={frame.x}>
          <rect x={frame.x} y="20" width="36" height="52" rx="4" />
          <path
            d={Array.from({ length: frame.lines }, (_, i) => `M${frame.x + 8} ${34 + i * 11} H${frame.x + 28}`).join(" ")}
          />
        </g>
      ))}
      <path className="acid" d="M196 67 H216" />
      <path d="M38 88 H206" />
    </Frame>
  );
}

/** C3 — a record passing gates, with the one it is clearing marked. */
export function RecordGates({ className }: Props) {
  return (
    <Frame viewBox="0 0 240 120" className={className}>
      <path d="M16 60 H224" />
      <path d="M56 34 V86 M104 34 V86 M200 34 V86" />
      <path className="acid" d="M152 30 V90" />
      <rect x="122" y="50" width="20" height="20" rx="2" />
    </Frame>
  );
}
