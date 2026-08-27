/**
 * Reviewed content wrapper.
 *
 * MASTER_BUILD_SPEC.md §33 forbids hard-coding tax thresholds, due dates, plan
 * inclusions, legal guarantees and foreign-income conclusions into components.
 * A comment cannot enforce that. A type can: any prop carrying tax meaning is
 * typed `ReviewedFact` rather than `string`, so a bare literal is a compile
 * error and every such value has to declare whether a CA has signed it off.
 *
 * Presentation components read the value through `factValue`. They must not
 * branch on `requiresReview` to decide what the copy says — that is an editorial
 * decision, not a rendering one.
 */

export type ReviewedFact<T = string> = {
  /** What is rendered. */
  value: T;
  /** True until a CA has confirmed this is correct and current. */
  requiresReview: boolean;
  /** Who reviewed it. Present only once reviewed. */
  reviewedBy?: string;
  /** ISO date of review, e.g. "2026-08-27". Present only once reviewed. */
  reviewedAt?: string;
};

/** A fact a CA has signed off. */
export function reviewed<T>(value: T, reviewedBy: string, reviewedAt: string): ReviewedFact<T> {
  return { value, requiresReview: false, reviewedBy, reviewedAt };
}

/**
 * A fact that has not been reviewed yet. Safe to render — it is still real
 * content — but it is flagged so a pre-launch sweep can find every one of them.
 */
export function unreviewed<T>(value: T): ReviewedFact<T> {
  return { value, requiresReview: true };
}

export function factValue<T>(fact: ReviewedFact<T>): T {
  return fact.value;
}

export function isReviewed(fact: ReviewedFact<unknown>): boolean {
  return !fact.requiresReview;
}

/** Every fact still awaiting sign-off. Use in a pre-launch check. */
export function pendingReview(
  facts: ReadonlyArray<ReviewedFact<unknown>>,
): ReviewedFact<unknown>[] {
  return facts.filter((fact) => fact.requiresReview);
}
