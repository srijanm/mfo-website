import {
  MAX,
  trimmed,
  validateChoices,
  validateContactFields,
  type LeadField,
} from "./validation";

export type LeadPayload = {
  paidBy: string;
  stage: string;
  /** Step 3 accepts more than one answer, so this is always a list. */
  needs: string[];
  name: string;
  email: string;
  /** Optional. Empty string means "not given", never "invalid". */
  phone: string;
  note: string;
  /**
   * Which page the enquiry started from. Context for the person reading it,
   * never a fact about the enquirer: it says where they were, not how they are
   * paid. Nothing downstream may infer a tax position from it.
   */
  sourcePage: string;
};

export type FieldErrors = Partial<Record<LeadField | "form", string>>;

/** Validated separately so an unknown value cannot become page context. */
const SOURCE_MAX = 128;

function sourcePageOf(value: unknown): string {
  const raw = trimmed(value);
  /* A site-relative path and nothing else: no origin, no query string, no
     fragment. Anything else is dropped rather than recorded. */
  if (!raw.startsWith("/") || raw.startsWith("//")) return "";
  if (raw.includes("?") || raw.includes("#") || raw.includes("://")) return "";
  return raw.slice(0, SOURCE_MAX);
}

/**
 * The multi-select arrives as an array; a lone string is still accepted so a
 * hand-rolled POST in the old shape keeps working. Deduplicated, so a replayed
 * value cannot inflate the list.
 */
function textList(value: unknown): string[] {
  const list = Array.isArray(value) ? value.map(trimmed) : [trimmed(value)];
  return [...new Set(list.filter((item) => item.length > 0))];
}

/**
 * Server-side validation. The browser validates too, using the same rules from
 * lib/leads/validation.ts, but this is the copy that decides — a request can
 * always arrive without ever touching the form.
 *
 * Choice fields are checked against the canonical option lists rather than
 * merely being non-empty, so a hand-rolled POST cannot introduce values the
 * intake never offered.
 */
export function validateLead(input: unknown): {
  payload?: LeadPayload;
  errors: FieldErrors;
} {
  if (typeof input !== "object" || input === null) {
    return { errors: { form: "The submission was not readable." } };
  }

  const raw = input as Record<string, unknown>;

  const fields = {
    paidBy: trimmed(raw.paidBy),
    stage: trimmed(raw.stage),
    needs: textList(raw.needs),
    name: trimmed(raw.name),
    email: trimmed(raw.email),
    phone: trimmed(raw.phone),
    note: trimmed(raw.note),
  };

  const errors: FieldErrors = {
    ...validateChoices(fields),
    ...validateContactFields(fields),
  };

  if (Object.keys(errors).length > 0) return { errors };

  return {
    payload: {
      ...fields,
      note: fields.note.slice(0, MAX.note),
      sourcePage: sourcePageOf(raw.sourcePage),
    },
    errors: {},
  };
}

/** Field a real person never sees and never fills. */
export const HONEYPOT_FIELD = "company";
