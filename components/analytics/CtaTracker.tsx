"use client";

import { useEffect } from "react";

import { track } from "@/lib/analytics/track";
import type { CtaPlacement } from "@/lib/analytics/events";

const PLACEMENTS: readonly string[] = [
  "header",
  "hero",
  "mobile-menu",
  "section",
  "pricing",
  "closing",
  "contact",
];

/**
 * One delegated listener for every call to action on the site.
 *
 * The alternative — an onClick on each button — would turn every Button into a
 * client component and scatter the same three lines across a dozen files. One
 * listener on the document reads the `data-cta-*` attributes a Button already
 * renders, so the buttons stay server-rendered and there is exactly one place
 * where a CTA click becomes an event.
 *
 * What is sent: the placement, the pathname, and the button's own label. Never
 * the query string, and never anything a person typed.
 */
export function CtaTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const cta = target?.closest<HTMLElement>("[data-cta-placement]");
      if (!cta) return;

      const placement = cta.dataset.ctaPlacement ?? "";
      if (!PLACEMENTS.includes(placement)) return;

      track({
        name: "cta_click",
        props: {
          placement: placement as CtaPlacement,
          /* Pathname only. A query string can carry anything. */
          page: window.location.pathname,
          label: cta.dataset.ctaLabel ?? "",
        },
      });
    };

    /* An independent contact route being used is a conversion too, and it is
       the one the form cannot report. Method id only — never the address. */
    const onContactClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const link = target?.closest<HTMLElement>("[data-contact-method]");
      if (!link) return;
      track({
        name: "contact_method_click",
        props: { method: link.dataset.contactMethod ?? "" },
      });
    };

    document.addEventListener("click", onClick);
    document.addEventListener("click", onContactClick);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("click", onContactClick);
    };
  }, []);

  return null;
}
