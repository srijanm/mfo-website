import { intakeSteps } from "@/lib/content/get-started";

export type LeadPayload = {
  paidBy: string;
  stage: string;
  needs: string;
  name: string;
  email: string;
  phone: string;
  note: string;
};

export type FieldErrors = Partial<Record<keyof LeadPayload | "form", string>>;

const MAX = { name: 100, email: 254, phone: 32, note: 2000 } as const;

/** Deliberately permissive: shape only, never a claim that an address exists. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function optionsFor(id: "paidBy" | "stage" | "needs"): readonly string[] {
  return intakeSteps.find((step) => step.id === id)!.options;
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Server-side validation. The browser validates too, but this is the copy that
 * decides — a request can always arrive without ever touching the form.
 *
 * Choice fields are checked against the canonical option lists rather than
 * merely being non-empty, so a hand-rolled POST cannot introduce values the
 * intake never offered.
 */
export function validateLead(input: unknown): {
  payload?: LeadPayload;
  errors: FieldErrors;
} {
  const errors: FieldErrors = {};

  if (typeof input !== "object" || input === null) {
    return { errors: { form: "The submission was not readable." } };
  }

  const raw = input as Record<string, unknown>;

  const paidBy = text(raw.paidBy);
  const stage = text(raw.stage);
  const needs = text(raw.needs);
  const name = text(raw.name);
  const email = text(raw.email);
  const phone = text(raw.phone);
  const note = text(raw.note);

  if (!optionsFor("paidBy").includes(paidBy)) errors.paidBy = "Choose how you are paid.";
  if (!optionsFor("stage").includes(stage)) errors.stage = "Choose where you are now.";
  if (!optionsFor("needs").includes(needs)) errors.needs = "Choose what you need help with.";

  if (!name) errors.name = "Tell us your name.";
  else if (name.length > MAX.name) errors.name = "That name is too long.";

  if (!email) errors.email = "Tell us your email.";
  else if (email.length > MAX.email || !EMAIL.test(email))
    errors.email = "That does not look like an email address.";

  if (!phone) errors.phone = "Tell us your phone number.";
  else if (phone.length > MAX.phone) errors.phone = "That phone number is too long.";

  if (note.length > MAX.note) errors.note = "That note is too long.";

  if (Object.keys(errors).length > 0) return { errors };

  return { payload: { paidBy, stage, needs, name, email, phone, note }, errors: {} };
}

/** Field a real person never sees and never fills. */
export const HONEYPOT_FIELD = "company";
