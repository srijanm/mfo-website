# The conversion funnel

What is measured, what is deliberately not, and how to read it.

**Measurement is not live.** No analytics provider is installed or configured.
`lib/analytics/track.ts` is provider-neutral and does nothing unless a provider
is already on the page. Enable one provider and every event below starts
reporting with no code change. Until then, no claim about conversion rates can
be made from this site, and none is made anywhere in it.

## The journey

```
  land on any page
        │
        ├─ cta_click            { placement, page, label }
        ▼
  /get-started
        │
        ├─ enquiry_start        { page }        ← once per page life
        │
        ├─ enquiry_step_complete { step, index } ← paidBy → stage → needs
        │
        ├─ enquiry_validation_error { step, fields, code }
        │                        code: "client" (before sending)
        │                              "server" (422 came back)
        ▼
  press "Send enquiry"
        │
        ├─ enquiry_submit_attempt  { step: "details" }
        │
        ├─ enquiry_submit_success  {}
        │
        └─ enquiry_submit_failure  { reason }
                                   reason: delivery | timeout
                                           rate-limited | network | validation

  independent contact route (when one exists)
        └─ contact_method_click  { method }
```

## Reading it

**Completion rate by landing page.** `enquiry_start` carries `page` — the
validated `?from=` value, so an enquiry begun from `/creators` is
distinguishable from one begun cold. Divide `enquiry_submit_success` by
`enquiry_start`, split by that property.

**Where people leave.** `enquiry_step_complete` fires with `index` 1–3. The drop
between consecutive indices is the step that is losing people. A step with a
high `enquiry_validation_error` count *and* a low completion is a step whose
question is unclear, not one whose validation is too strict.

**By device.** Every provider listed already records viewport or device class on
its own. Cross that with `enquiry_start` — nothing device-specific is sent from
here, because it would be duplicating what the provider already has.

**Delivery health.** `enquiry_submit_attempt` minus `enquiry_submit_success`
should equal the sum of `enquiry_submit_failure`. A gap means requests are
being abandoned before a response arrives. `reason: "timeout"` is specifically
*uncertain* delivery — the enquiry may have arrived — and is counted separately
from `"delivery"`, which is a definite refusal.

## What is never sent

Enforced twice: the event types in `lib/analytics/events.ts` have no property
that could hold any of it, and `scrub()` in `track.ts` drops the keys anyway,
along with any string containing `@`, `?` or `://`.

- Names, email addresses, phone numbers, free-text notes.
- Any answer describing how somebody earns or what they need.
- Full URLs and query strings. `page` is a pathname only.

Field **names** and error **codes** are sent. Field *values* never are.

## Guarantees

- **Analytics can never break the form.** Every call is wrapped; a provider that
  throws, half-loads or is blocked by an extension is swallowed silently.
- **No duplicate events on rerender.** `enquiry_start` goes through `trackOnce`,
  keyed per page life. CTA clicks come from one delegated document listener, so
  a rerendered button cannot double-fire.
- **No provider, no network calls.** With nothing configured, `track()` returns
  after a type check. In development it logs to `console.debug` so the funnel can
  be exercised locally.
