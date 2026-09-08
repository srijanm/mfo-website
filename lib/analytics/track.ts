"use client";

import { FORBIDDEN_PROPS, type AnalyticsEvent } from "./events";

/**
 * A provider-neutral tracking adapter.
 *
 * It installs nothing. No analytics package is a dependency of this project and
 * none is loaded by it: this looks for a provider that the hosting platform or
 * a tag has already put on `window`, and if none is there it does nothing at
 * all. Measurement is therefore *not* live until a provider is configured, and
 * this file never pretends otherwise — `analyticsProvider()` reports honestly.
 *
 * Three rules hold regardless of provider:
 *
 *  1. Nothing personal leaves. The event types permit only field names and
 *     error codes, and `scrub()` below drops any forbidden key anyway. Full
 *     URLs and query strings are never sent — `page` is a pathname the caller
 *     supplies, and pathnames on this site carry no query data.
 *  2. Analytics can never break the form. Every call is wrapped; a provider
 *     that throws, is half-loaded, or is blocked by an extension is swallowed.
 *  3. Duplicate suppression is the caller's job for render-driven events, and
 *     `trackOnce` is provided for exactly that.
 */

type Provider = "vercel" | "plausible" | "gtag" | "none";

type WindowWithProviders = Window & {
  va?: (event: string, name?: string, props?: Record<string, unknown>) => void;
  plausible?: (name: string, options?: { props?: Record<string, unknown> }) => void;
  gtag?: (command: string, name: string, props?: Record<string, unknown>) => void;
};

/** Which provider is actually present right now. "none" is the honest default. */
export function analyticsProvider(): Provider {
  if (typeof window === "undefined") return "none";
  const w = window as WindowWithProviders;
  if (typeof w.va === "function") return "vercel";
  if (typeof w.plausible === "function") return "plausible";
  if (typeof w.gtag === "function") return "gtag";
  return "none";
}

/** True when something is actually listening. Never assumed. */
export function analyticsIsLive(): boolean {
  return analyticsProvider() !== "none";
}

/**
 * Drops any property that could carry personal data, whatever the types said.
 * Also caps string length, so a field-name list cannot become a payload.
 */
function scrub(props: Record<string, unknown>): Record<string, string | number | boolean> {
  const safe: Record<string, string | number | boolean> = {};

  for (const [key, value] of Object.entries(props)) {
    if (FORBIDDEN_PROPS.includes(key)) continue;
    if (typeof value === "number" || typeof value === "boolean") {
      safe[key] = value;
      continue;
    }
    if (typeof value === "string") {
      /* Anything that looks like an address or a query string is dropped
         rather than truncated — truncating would still leak the front of it. */
      if (value.includes("@") || value.includes("?") || value.includes("://")) continue;
      safe[key] = value.slice(0, 64);
    }
  }

  return safe;
}

/**
 * Send one event. Safe to call anywhere, including where no provider exists and
 * on the server, where it is a no-op.
 */
export function track(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;

  const props = scrub(event.props as Record<string, unknown>);
  const w = window as WindowWithProviders;

  try {
    switch (analyticsProvider()) {
      case "vercel":
        w.va?.("event", event.name, props);
        break;
      case "plausible":
        w.plausible?.(event.name, { props });
        break;
      case "gtag":
        w.gtag?.("event", event.name, props);
        break;
      case "none":
        /* Visible while developing so the funnel can be exercised without a
           provider, and silent in production so nothing is logged in a real
           browser session. */
        if (process.env.NODE_ENV === "development") {
          console.debug("[analytics:no-provider]", event.name, props);
        }
        break;
    }
  } catch {
    /* Measurement is never allowed to interrupt what the person came to do. */
  }
}

const fired = new Set<string>();

/**
 * Send an event at most once per page life, keyed by name plus an optional
 * discriminator. For events driven by render or by entering a state, where a
 * rerender must not produce a second event.
 */
export function trackOnce(event: AnalyticsEvent, key = ""): void {
  const id = `${event.name}:${key}`;
  if (fired.has(id)) return;
  fired.add(id);
  track(event);
}

/** Test seam: forget what has been sent. Not used by application code. */
export function resetTrackOnce(): void {
  fired.clear();
}
