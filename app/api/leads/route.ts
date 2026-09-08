import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import { LIMITS, rateLimit } from "@/lib/leads/rate-limit";
import { submitLead } from "@/lib/leads/submit-lead";
import { HONEYPOT_FIELD, validateLead } from "@/lib/leads/types";

/** Leads are sent, never rendered, so this route is always dynamic. */
export const dynamic = "force-dynamic";

/**
 * Stable public messages.
 *
 * The client is told what happened in terms it can act on. It is never told
 * which environment variable is missing or what the provider said — that is
 * operator information and it goes to the server log, keyed by submission id.
 */
const PUBLIC = {
  unreadable: "The submission was not readable.",
  delivery: "We could not send your enquiry just now.",
  timeout: "timeout",
  rateLimited: "rate-limited",
} as const;

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

/**
 * The client may supply a submission id so that a retry of the *same* enquiry
 * reuses it and the provider's idempotency key suppresses a duplicate send.
 * Validated rather than trusted: anything that is not a plain uuid is replaced.
 */
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function submissionIdOf(body: unknown): string {
  const raw = (body as Record<string, unknown> | null)?.submissionId;
  return typeof raw === "string" && UUID.test(raw) ? raw : randomUUID();
}

export async function POST(request: Request) {
  const client = clientKey(request);

  /* Loose ceiling on requests: enough to stop a script, not so tight that a
     person tripping validation a few times locks themselves out. */
  const requestLimit = rateLimit(`req:${client}`, LIMITS.requests);

  if (!requestLimit.allowed) {
    return NextResponse.json(
      {
        ok: false,
        errors: { form: PUBLIC.rateLimited },
        retryAfterSeconds: requestLimit.retryAfterSeconds,
      },
      { status: 429, headers: { "Retry-After": String(requestLimit.retryAfterSeconds) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, errors: { form: PUBLIC.unreadable } },
      { status: 400 },
    );
  }

  /* A bot filled the field a person cannot see. Answer as though it worked so
     the script learns nothing, but send nothing on. */
  const honeypot = (body as Record<string, unknown> | null)?.[HONEYPOT_FIELD];
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    console.warn("[lead] discarded — honeypot filled");
    return NextResponse.json({ ok: true });
  }

  const { payload, errors } = validateLead(body);

  if (!payload) {
    /* 422, not 400: the request was understood, its contents were not
       acceptable. The client distinguishes this from a delivery failure and
       keeps the form on screen with the errors attached to their fields. */
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  /* Tight ceiling on actual sends, applied only once a payload is valid. */
  const deliveryLimit = rateLimit(`send:${client}`, LIMITS.deliveries);

  if (!deliveryLimit.allowed) {
    return NextResponse.json(
      {
        ok: false,
        errors: { form: PUBLIC.rateLimited },
        retryAfterSeconds: deliveryLimit.retryAfterSeconds,
      },
      { status: 429, headers: { "Retry-After": String(deliveryLimit.retryAfterSeconds) } },
    );
  }

  const submissionId = submissionIdOf(body);
  const outcome = await submitLead(payload, submissionId);

  if (outcome.status === "delivered") {
    /* Success is reported only on a confirmed acceptance by the provider. */
    return NextResponse.json({ ok: true, submissionId });
  }

  if (outcome.status === "timeout") {
    /* We do not know whether it arrived. 504 and a distinct code, so the form
       can say so honestly instead of claiming it definitely failed. */
    return NextResponse.json(
      { ok: false, errors: { form: PUBLIC.timeout }, submissionId },
      { status: 504 },
    );
  }

  return NextResponse.json(
    { ok: false, errors: { form: PUBLIC.delivery }, submissionId },
    { status: 502 },
  );
}
