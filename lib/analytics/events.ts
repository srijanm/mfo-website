/**
 * The conversion funnel, as a closed set of events.
 *
 * Names and payload shapes live here so the form, the buttons and the tests all
 * refer to the same things, and so what may be sent is reviewable in one file.
 *
 * The hard rule, enforced by the payload types below: nothing that identifies a
 * person or describes their finances ever becomes an analytics property. Field
 * *names* and error *codes* are allowed; field values are not. There is no
 * property anywhere in this file that could hold a name, an email address, a
 * phone number, a note, or an answer about how someone earns.
 */

export type CtaPlacement =
  | "header"
  | "hero"
  | "mobile-menu"
  | "section"
  | "pricing"
  | "closing"
  | "contact";

/** Which enquiry step, by index and stable id — never the answer given. */
export type StepId = "paidBy" | "stage" | "needs" | "details";

export type AnalyticsEvent =
  | { name: "cta_click"; props: { placement: CtaPlacement; page: string; label: string } }
  | { name: "enquiry_start"; props: { page: string } }
  | { name: "enquiry_step_complete"; props: { step: StepId; index: number } }
  | {
      name: "enquiry_validation_error";
      /** Field names and error codes only. Never the rejected value. */
      props: { step: StepId; fields: string; code: "client" | "server" };
    }
  | { name: "enquiry_submit_attempt"; props: { step: StepId } }
  | { name: "enquiry_submit_success"; props: Record<string, never> }
  | {
      name: "enquiry_submit_failure";
      props: { reason: "delivery" | "timeout" | "rate-limited" | "network" | "validation" };
    }
  | { name: "contact_method_click"; props: { method: string } };

export type AnalyticsEventName = AnalyticsEvent["name"];

/**
 * Property keys that must never appear on any event, checked at runtime by the
 * adapter. A belt-and-braces guard: the types above already make these
 * impossible to construct, and this catches anything added later that slips
 * past review.
 */
export const FORBIDDEN_PROPS: readonly string[] = [
  "name",
  "email",
  "phone",
  "note",
  "paidBy",
  "stage",
  "needs",
  "answers",
  "payload",
  "query",
  "search",
  "url",
  "href",
];
