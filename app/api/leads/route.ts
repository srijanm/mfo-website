import { NextResponse } from "next/server";

import { LIMITS, rateLimit } from "@/lib/leads/rate-limit";
import { submitLead } from "@/lib/leads/submit-lead";
import { HONEYPOT_FIELD, validateLead } from "@/lib/leads/types";

/** Leads are sent, never rendered, so this route is always dynamic. */
export const dynamic = "force-dynamic";

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  const client = clientKey(request);

  /* Loose ceiling on requests: enough to stop a script, not so tight that a
     person tripping validation a few times locks themselves out. */
  const requestLimit = rateLimit(`req:${client}`, LIMITS.requests);

  if (!requestLimit.allowed) {
    return NextResponse.json(
      { ok: false, errors: { form: "rate-limited" } },
      { status: 429, headers: { "Retry-After": String(requestLimit.retryAfterSeconds) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, errors: { form: "The submission was not readable." } },
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
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  /* Tight ceiling on actual sends, applied only once a payload is valid. */
  const deliveryLimit = rateLimit(`send:${client}`, LIMITS.deliveries);

  if (!deliveryLimit.allowed) {
    return NextResponse.json(
      { ok: false, errors: { form: "rate-limited" } },
      { status: 429, headers: { "Retry-After": String(deliveryLimit.retryAfterSeconds) } },
    );
  }

  const result = await submitLead(payload);

  if (!result.ok) {
    /* Never report success for something that did not send. The payload is in
       the server log either way, so the lead itself is not lost. */
    return NextResponse.json({ ok: false, errors: { form: result.reason } }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
