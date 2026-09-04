import "server-only";

import type { LeadPayload } from "./types";

/**
 * The one place a lead leaves this application.
 *
 * Everything else — the form, the route, validation — is delivery-agnostic.
 * Swapping Resend for a CRM means changing this file and nothing else.
 *
 * Sent over Resend's HTTP API rather than its SDK, so the project takes no
 * dependency for a single POST.
 */

export type SubmitResult =
  | { ok: true }
  | { ok: false; reason: string };

const RESEND_ENDPOINT = "https://api.resend.com/emails";

/** Resend's shared sender, usable without verifying a domain first. */
const DEFAULT_FROM = "MyFinanceOfficer <onboarding@resend.dev>";

function formatEmail(payload: LeadPayload): string {
  const lines = [
    `How they are paid: ${payload.paidBy}`,
    `Where they are now: ${payload.stage}`,
    `What they need: ${payload.needs.join(", ")}`,
    "",
    `Name:  ${payload.name}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone}`,
    "",
    payload.note ? `Note:\n${payload.note}` : "No note.",
  ];

  return lines.join("\n");
}

/**
 * Logs the lead before attempting delivery, so a submission is recoverable from
 * the server log even when the provider is down. The log is the record of last
 * resort; it is written first for that reason, and it is written whether or not
 * the send succeeds.
 */
export async function submitLead(payload: LeadPayload): Promise<SubmitResult> {
  console.info("[lead] received", JSON.stringify(payload));

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_TO_EMAIL;
  const from = process.env.LEAD_FROM_EMAIL || DEFAULT_FROM;

  if (!apiKey || !to) {
    const reason = "Lead delivery is not configured (RESEND_API_KEY or LEAD_TO_EMAIL missing).";
    console.error(`[lead] not sent — ${reason}`);
    return { ok: false, reason };
  }

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: payload.email,
        subject: `New enquiry — ${payload.name}`,
        text: formatEmail(payload),
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      const reason = `Provider responded ${response.status}.`;
      console.error(`[lead] not sent — ${reason} ${detail}`);
      return { ok: false, reason };
    }

    console.info("[lead] sent");
    return { ok: true };
  } catch (error) {
    const reason = "Provider request failed.";
    console.error(`[lead] not sent — ${reason}`, error);
    return { ok: false, reason };
  }
}
