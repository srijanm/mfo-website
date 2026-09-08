import type { IncomeSourceIconName } from "@/lib/content/graphics";

import styles from "./IncomeSourceIcon.module.css";
import { cx } from "@/lib/cx";

type IncomeSourceIconProps = {
  name: IncomeSourceIconName;
  className?: string;
};

/**
 * Graphic B — the four ways money reaches you, as line drawings.
 *
 * One shared 64x48 viewBox, one stroke weight, one corner radius and exactly
 * one filled acid detail each, so the four read as a set drawn by the same hand
 * rather than as icons pulled from a pack. The stroke is `currentColor`, so a
 * drawing placed on the ink chapter would invert with its surroundings instead
 * of disappearing.
 *
 * These are decorative: every one sits directly above a visible text label that
 * says the same thing, so they are hidden from assistive technology. Nothing
 * here is an emoji or a third-party glyph.
 */
export function IncomeSourceIcon({ name, className }: IncomeSourceIconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 64 48"
      width="64"
      height="48"
      className={cx(styles.icon, className)}
    >
      {ART[name]}
    </svg>
  );
}

/* Drawn against the shared grid rather than traced: 1.5px strokes, 2px corners,
   and one acid element per drawing marking where the money lands. */
const ART: Record<IncomeSourceIconName, React.ReactNode> = {
  /* Paid by a company somewhere else: a document abroad, an arrow inward, and
     the destination it arrives at. */
  enterprise: (
    <>
      <rect x="3.75" y="7.75" width="25" height="32.5" rx="2" className={styles.stroke} />
      <path d="M9 16h14M9 22h14M9 28h9" className={styles.stroke} />
      <path d="M33 24h17" className={styles.stroke} />
      <path d="M46 19.5 50.5 24 46 28.5" className={styles.stroke} />
      <rect x="53.75" y="19.75" width="6.5" height="8.5" rx="1.5" className={styles.fill} />
    </>
  ),

  /* Consulting: two invoice sheets, slightly offset, and the line that gets
     signed. */
  consulting: (
    <>
      <rect x="9.75" y="5.75" width="22" height="29" rx="2" className={styles.stroke} />
      <rect x="19.75" y="12.75" width="24" height="29" rx="2" className={styles.sheet} />
      <path d="M25 21h13M25 27h9" className={styles.stroke} />
      <path d="M25 34h13" className={styles.accentStroke} />
    </>
  ),

  /* Creator and brand income: a media frame, and the slip that follows it. */
  creator: (
    <>
      <rect x="5.75" y="5.75" width="35" height="23" rx="2" className={styles.stroke} />
      <path d="M19.5 12.5 28.5 17.5 19.5 22.5Z" className={styles.stroke} />
      <rect x="31.75" y="25.75" width="26" height="16" rx="2" className={styles.sheet} />
      <path d="M36 31h14" className={styles.stroke} />
      <rect x="36" y="35" width="9" height="3.5" rx="1" className={styles.fill} />
    </>
  ),

  /* Independent professional income: a record, and the tab that marks it. */
  professional: (
    <>
      <rect x="11.75" y="7.75" width="31" height="32.5" rx="2" className={styles.stroke} />
      <path d="M17 17h16M17 24h20M17 31h12" className={styles.stroke} />
      <rect x="38.75" y="13.75" width="12.5" height="7.5" rx="1.5" className={styles.fill} />
    </>
  ),
};
