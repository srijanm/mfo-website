/**
 * A small in-memory sliding window.
 *
 * This is best-effort and per-instance: on serverless it resets on cold start
 * and does not coordinate across instances. It is enough to stop a script
 * hammering the route from one address; it is not a substitute for a shared
 * store if abuse ever becomes real.
 */
const WINDOW_MS = 10 * 60 * 1000;

const hits = new Map<string, number[]>();

export type RateLimitResult = { allowed: boolean; retryAfterSeconds: number };

export function rateLimit(key: string, max: number, now = Date.now()): RateLimitResult {
  const recent = (hits.get(key) ?? []).filter((at) => now - at < WINDOW_MS);

  if (recent.length >= max) {
    hits.set(key, recent);
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((WINDOW_MS - (now - recent[0])) / 1000),
    };
  }

  recent.push(now);
  hits.set(key, recent);

  // Keep the map from growing without bound on a long-lived instance.
  if (hits.size > 5000) {
    for (const [k, times] of hits) {
      if (times.every((at) => now - at >= WINDOW_MS)) hits.delete(k);
    }
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

/**
 * Two ceilings rather than one.
 *
 * Rejected requests are cheap, and a real person can plausibly trip validation
 * several times while filling four steps — counting those against a single
 * tight limit would lock them out of their own enquiry. So requests get a loose
 * ceiling that only stops hammering, and actual delivery attempts get a tight
 * one.
 */
export const LIMITS = { requests: 20, deliveries: 5 } as const;
