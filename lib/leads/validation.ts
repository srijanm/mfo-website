/**
 * One set of validation rules, used by the browser and by the route.
 *
 * The form imports these so the message a person sees before submitting is the
 * same message the server would have produced, and so a rule can only be
 * changed in one place. The server still validates independently — a request
 * can always arrive without ever touching the form — but it now shares this
 * copy rather than keeping a second, drifting one.
 */

import { intakeSteps } from "@/lib/content/get-started";

export type LeadField = "paidBy" | "stage" | "needs" | "name" | "email" | "phone" | "note";

export const MAX = { name: 100, email: 254, phone: 32, note: 2000 } as const;

/**
 * Deliberately permissive: a shape check, never a claim that the address
 * exists. Rejecting valid-but-unusual addresses loses real enquiries.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Phone is optional. When given, only its length is checked — numbering plans
 *  vary too much for anything stricter to be safe. */
const PHONE_MIN = 6;

export const messages = {
  paidBy: "Choose how you are paid.",
  stage: "Choose where you are now.",
  needs: "Choose at least one option.",
  nameMissing: "Tell us your name.",
  nameLong: "That name is too long.",
  emailMissing: "Tell us your email address.",
  emailShape: "That does not look like an email address.",
  phoneShort: "That phone number looks too short.",
  phoneLong: "That phone number is too long.",
  noteLong: "That note is too long.",
} as const;

export function optionsFor(id: "paidBy" | "stage" | "needs"): readonly string[] {
  return intakeSteps.find((step) => step.id === id)!.options;
}

export function trimmed(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * The contact fields, validated on their own so the browser can check exactly
 * what the server checks before a request is made.
 *
 * Phone is optional: it is not required to reply to an enquiry, and requiring
 * it turned people away at the last step for no reason.
 */
export function validateContactFields(input: {
  name: string;
  email: string;
  phone: string;
  note: string;
}): Partial<Record<LeadField, string>> {
  const errors: Partial<Record<LeadField, string>> = {};

  const name = input.name.trim();
  const email = input.email.trim();
  const phone = input.phone.trim();
  const note = input.note.trim();

  if (!name) errors.name = messages.nameMissing;
  else if (name.length > MAX.name) errors.name = messages.nameLong;

  if (!email) errors.email = messages.emailMissing;
  else if (email.length > MAX.email || !EMAIL.test(email)) errors.email = messages.emailShape;

  /* Optional — empty is valid. Only a value that was actually entered is
     checked, and only for plausibility. */
  if (phone) {
    if (phone.length > MAX.phone) errors.phone = messages.phoneLong;
    else if (phone.replace(/[^\d]/g, "").length < PHONE_MIN) errors.phone = messages.phoneShort;
  }

  if (note.length > MAX.note) errors.note = messages.noteLong;

  return errors;
}

/** The choice steps, validated against the canonical option lists. */
export function validateChoices(input: {
  paidBy: string;
  stage: string;
  needs: readonly string[];
}): Partial<Record<LeadField, string>> {
  const errors: Partial<Record<LeadField, string>> = {};

  if (!optionsFor("paidBy").includes(input.paidBy.trim())) errors.paidBy = messages.paidBy;
  if (!optionsFor("stage").includes(input.stage.trim())) errors.stage = messages.stage;

  if (
    input.needs.length === 0 ||
    !input.needs.every((item) => optionsFor("needs").includes(item))
  ) {
    errors.needs = messages.needs;
  }

  return errors;
}

/** Which step owns a field, so an error can send the reader to the right one. */
export const stepOwnerOf: Record<LeadField, number> = {
  paidBy: 0,
  stage: 1,
  needs: 2,
  name: 3,
  email: 3,
  phone: 3,
  note: 3,
};
