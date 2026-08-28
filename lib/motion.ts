export const MFO_MOTION = {
  duration: {
    fast: 0.14,
    normal: 0.22,
    slow: 0.36,
    headline: 0.52,
    ruleMajor: 0.72,
    ruleInternal: 0.42,
    nodePulse: 0.42,
  },
  stagger: {
    headline: 0.04,
    row: 0.05,
  },
  distance: {
    objectRow: 5,
    copy: 10,
    max: 16,
  },
  easing: {
    reveal: [0.16, 1, 0.3, 1] as const,
    system: [0.22, 0.75, 0.18, 1] as const,
  },
  incomeAxis: {
    activeNodeScale: 1.18,
    lineDuration: 0.32,
  },
} as const;

/** Milliseconds, for CSS custom properties. */
export const ms = (seconds: number): string => `${Math.round(seconds * 1000)}ms`;
