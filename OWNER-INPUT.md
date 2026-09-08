# Owner input needed

Everything in this document is a **business fact nobody on the build side can
supply**. None of it has been guessed at, and none of it is blocking any of the
engineering work — the site renders correctly without every item here, and says
honestly what it does not yet know.

Each row names the exact file and field the answer populates. Fill the field and
the site starts rendering it; leave it and the site keeps saying nothing rather
than something invented.

**Launch blockers** are marked 🔴. The rest can follow.

---

## 1. Public contact details

**File:** `lib/content/contact.ts` → `publicContact`

| Field | What is needed | Status |
|---|---|---|
| `email` | A monitored **public** address. 🔴 | Missing |
| `phone` | A public number, if the firm publishes one. | Missing |
| `bookingUrl` | A scheduling link, if one exists. | Optional |
| `responseTime` | Approved wording, e.g. "within two working days". | Missing |

🔴 **This is a launch blocker.** Right now the enquiry form is the *only* way to
reach the firm. `/contact` says so plainly and the form no longer advertises
`/contact` as an alternative — the two used to point at each other in a loop,
which is fixed — but a site with a single machine-dependent contact route has no
fallback if delivery breaks.

> **Do not use `LEAD_TO_EMAIL` for this.** That is where enquiries are delivered
> and may well be a private internal inbox. It is deliberately never read by any
> page.

`responseTime` stays null until approved: the success screen currently promises
**no** turnaround, because promising one that is not met is worse than promising
nothing.

---

## 2. Firm identity

**File:** `lib/content/firm.ts` → `firm`

| Field | What is needed | Status |
|---|---|---|
| `registeredName` | Registered entity name, if different from the trading name. | Missing |
| `registrationLine` | e.g. the ICAI firm registration line, exactly as approved. | Missing |
| `address` | Registered address, as approved for publication. | Missing |
| `publishTeam` | **A decision, not a fact.** Currently `false`. | Decided: no |
| `statements` | Any approved professional statements. | Empty |

The sentence announcing that the team is "not published on this site yet" has
been **removed** — it made the firm read as unfinished. Nothing replaced it. If
`publishTeam` stays `false` that is a complete answer and the site will simply
never discuss people.

Also unset: `legalEntity` in `lib/content/navigation.ts`, which is the footer's
registration line.

---

## 3. Commercial terms

**File:** `lib/content/pricing.ts`, `lib/content/pricing-scope.ts`

The three annual figures — **₹19,999 / ₹24,999 / ₹34,999** — are authoritative
and unchanged. Everything below is not known:

| Missing input | Where it goes | Consequence today |
|---|---|---|
| **Tier mapping** — which fee covers which work | `pricing-scope.ts` → `approvedPlanScope` (currently `null`) | The three are presented as *fee levels*, not selectable plans. No comparison table is rendered, and none was fabricated. |
| **Tax treatment of the displayed fees** — inclusive or exclusive of GST | `pricing.ts` | The page says neither. 🔴 A displayed price whose tax treatment is unstated is a commercial risk. |
| **Exclusions** — what is explicitly not covered | `pricing.ts` | The page says scope is agreed in writing, and nothing more. |
| **Payment terms** — when the annual fee is due, instalments, refunds | `pricing.ts` | Not mentioned anywhere. |
| **What happens if scope changes mid-year** | `pricing.ts` | Not mentioned anywhere. |

Until the mapping exists, the pricing section shows *what a visitor can know
now* beside *what is confirmed after review*. That replaced a line that
dismissed comparison tables without explaining the offer.

---

## 4. Legal documents

**File:** `lib/content/legal.ts` → `legalPages[].document`

| Document | Status |
|---|---|
| Privacy policy | 🔴 Missing — page renders a "being prepared" notice |
| Terms of service | 🔴 Missing — page renders a "being prepared" notice |

Both templates are wired: supply approved text in `document` and the page renders
it instead of the notice. **No legal text has been drafted here** — a privacy
policy is a document with consequences and is not something to generate.

The enquiry form carries a short, truthful statement of how enquiry information
is used. It links to `/privacy` **only once a real document exists**
(`legalPublished()`), because linking to a page that says "this is being
prepared" is worse than not linking.

---

## 5. Delivery configuration

**Environment variables, set in the hosting platform — never committed.**

| Variable | Purpose | Status |
|---|---|---|
| `RESEND_API_KEY` | Provider credential | 🔴 Not set in production |
| `LEAD_TO_EMAIL` | Where enquiries are delivered | 🔴 Not set in production |
| `LEAD_FROM_EMAIL` | Sender; falls back to Resend's shared sender | Optional |

🔴 **Until these are set, every enquiry fails.** The form now says so honestly
and keeps the person's answers, but nothing is delivered and nothing is stored —
the server log is *not* a lead store and is no longer written with lead
contents.

Verified by inspection only; no real message was sent and no secret was printed.

---

## 6. Measurement

**File:** `lib/analytics/track.ts`

No analytics provider is configured, and none was installed. The adapter is
provider-neutral and does nothing unless a provider is already present on the
page (`window.va`, `window.plausible` or `window.gtag`).

**Measurement is therefore not live.** To turn it on, enable one provider — Vercel
Web Analytics is the zero-dependency option for this deployment — and the funnel
starts reporting with no code change.

---

## 7. Search

| Item | Status |
|---|---|
| `SITE_INDEXABLE` | Not set in production, so the live site is `noindex, follow`. **This is deliberate** and stays until content is signed off. |
| Guides | Written but unreviewed. Out of navigation and out of the sitemap. Add them only when genuinely ready. |

---

## Summary of launch blockers

1. 🔴 A public contact route — currently the form is the only way in.
2. 🔴 `RESEND_API_KEY` and `LEAD_TO_EMAIL` — without them no enquiry is delivered.
3. 🔴 Tax treatment of the three displayed fees.
4. 🔴 Approved privacy policy and terms.

Items 1 and 2 together mean the site currently **cannot receive an enquiry at
all**. That is the single most important thing on this page.
