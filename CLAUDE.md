# MyFinanceOfficer — build contract (v2)

Marketing site for a modern CA firm serving people whose income is not handled
by a normal Indian employer-payroll setup. The implementation contract is in
`/docs`. Build from those files only.

**This file supersedes the visual constraints in `/docs` where they conflict.**
The brief was amended by the owner. `/docs` remains authoritative for
positioning, copy, IA, product, pricing and legal.

Do not browse design reference sites. Do not look up the old
myfinanceofficer.com. Do not invent plan names, feature mappings, tax
thresholds or legal facts.

## Which doc to read for which task

| Task | Read |
|---|---|
| Anything at all, first | `docs/README_FIRST.md` |
| Layout, sections, behaviour, component tree | `docs/MASTER_BUILD_SPEC.md` |
| Any copy on the homepage | `docs/HOMEPAGE_COPY_AND_CONTENT.md` |
| Any page other than `/` and `/get-started` | `docs/SECONDARY_PAGE_SPECS.md` |
| Motion values | `docs/motion-tokens.ts` |
| Content data | `lib/content/` |
| Before saying anything is done | `docs/QA_CHECKLIST.md` |

Where `/docs` bans illustration, colour blocking or radii above 6px, **this
file wins**. Everything else in `/docs` stands.

## Positioning hierarchy — the thing most likely to go wrong

Layer A is core CA, tax and compliance. It dominates the first 75–80% of the
homepage.

Layer B (FX, insurance, loans, wealth, MIS) is subordinate. It appears only
**after** pricing, framed as "because we already understand how you earn, we can
also help with adjacent decisions when they become relevant."

Never frame MFO as an all-in-one financial office. Never put a Layer B service
above the fold. Layer B must also read as visually lighter than Layer A.

## Typography — unchanged

Geist only, via `next/font/google`, `display: swap`. Weights 400 (dominant),
500 (UI and row titles), 600 (rare). No 700+. No serif. No second family.
Sentence case.

Hierarchy pattern, applied consistently:

- Section intro: `--fs-lead`, `--ink-2`, sits above the first rule
- Data label: `--fs-small`, `--muted`, weight 400
- Data value: `--fs-body`, `--ink`
- Row title: `--fs-body`, weight 500, `--ink`
- Row description: `--fs-body`, weight 400, `--ink-2`

## Colour — one hue, four surfaces

No second accent colour. The palette stays monochrome plus acid.

| Surface | Background | Text | Rules |
|---|---|---|---|
| Paper (default) | `#F6F7F2` | `--ink` | `rgba(17,19,15,.16)` |
| White (document objects) | `#FFFFFF` | `--ink` | `rgba(17,19,15,.16)` |
| Ink (chapter break) | `#11130F` | `--paper` | `rgba(246,247,242,.20)` |
| Acid (closing panel) | `#D7FF00` | `--ink` | `rgba(17,19,15,.24)` |

New token required: `--muted-on-ink: #9A9E96`. Plain `--muted` on ink is 3.6:1
and fails AA — never use it on a dark surface.

Verified contrast: ink on paper 17.4:1 · paper on ink 17.4:1 · acid on ink
16.2:1 · ink on acid 16.2:1 · muted on paper 4.8:1 · muted-on-ink on ink 6.9:1.

Colour-block rules:

- At most **one ink section** and **one acid section** per page.
- They must not be adjacent.
- On the homepage: H05 Income Axis is the ink chapter, H13 final CTA stays acid.
  Everything else is paper; literal document objects stay white.
- A colour block spans the full viewport width, with content still on the
  container grid inside it.
- Acid never signals danger or error.

## Shape and depth — relaxed

Radius scale:

- Buttons and inputs: 2px
- Information objects and records: 8px
- Section-level panels and colour blocks: 12px
- Never above 12px

Depth. Two shadow tokens only:

```
--shadow-object: 0 1px 2px rgba(17,19,15,.04), 0 8px 24px rgba(17,19,15,.06);
--shadow-overlay: 0 12px 40px rgba(17,19,15,.08);
```

`--shadow-object` may be used only on an information object that sits **on top
of a colour block**. Objects on paper stay flat. Never on ruled rows, tables,
text blocks, pricing columns or section containers.

## Illustration — now permitted, within limits

Line art only. Qualifying work is:

- 1px or 1.5px strokes, in `--ink` or `--rule`
- acid used only for the one element that is active or changing
- no fills except acid accents and flat paper/ink
- geometric, isometric or axonometric — a technical drawing register, not a
  friendly vector-people register
- inline SVG, never raster
- legible at 320px, or shipped with a simpler mobile variant
- `aria-hidden` unless it carries information not present in text

Subject matter is systems, not objects: flows, sequences, calendars,
thresholds, records, structures, the shape of a year.

Never draw: people, coins, calculators, handshakes, rupee symbols, buildings,
briefcases, shields, checkmark badges, government forms or logos, or anything
that reads as a stock icon set.

## Still banned

Stock or generic photography · 3D renders · gradients of any kind ·
glassmorphism · a second typeface · a second hue · icons as decoration beside
headings · fake dashboards · warning red · scroll-jacking · perpetual or looping
motion · a Services mega-menu · decorative uppercase eyebrows
(`OUR APPROACH`, `03 / SERVICES`).

Small muted data labels that carry real information are not eyebrows and remain
fine.

## Hard rules

1. **Prices are exactly ₹19,999 / ₹24,999 / ₹34,999.** Never invent plan names
   or state which tier includes which feature.
2. **`approvedPlanScope` is `null`.** Price-first tiers, no comparison
   checkmarks. The matrix component stays hidden behind the null check.
3. **Never hard-code tax thresholds, due dates, plan inclusions, legal
   guarantees or foreign-income conclusions** in JSX, SVG or animation code.
   All of it comes from `lib/content/`. This includes illustration — an SVG may
   not draw a date, a threshold or an amount.
4. **Never sell with fear.** State a consequence once, flat, and move on.
5. **Never attack the family CA.** Frame it as fit and mismatch.
6. **Banned phrases.** expert CAs · X+ professionals · no
   hidden charges · 100% online · hassle-free · one-stop shop · all-in-one ·
   end-to-end · India's #1 / largest / most trusted · AI-powered · file in
   minutes · maximum refund · starting at ₹999 · hassle · boring · tedious ·
   paperwork. Do not call tax rules "simple" or "easy."

   *Amended 2026-09-04 by the owner: "transparent pricing" was struck from this
   list and is now the pricing headline. No other phrase changed.*
7. **Content must be visible at rest.** `globals.css` kills animation under
   `prefers-reduced-motion` with `!important`, so anything starting at
   `opacity: 0` renders **blank** for those users. Gate initial hidden states
   behind `@media (prefers-reduced-motion: no-preference)`.
8. **No Three.js in the initial bundle.** The only permitted WebGL is an
   optional, lazy, desktop-only pointer effect on the final CTA.
9. **All primary CTAs route to `/get-started`.**
10. **Secrets never committed.** Environment variables only.

## Workflow

Branch per session. `npm run check` before committing. Conventional-commit
message. Open a PR and report the Vercel preview URL.

## Definition of done

- Renders correctly with JS disabled and with `prefers-reduced-motion: reduce`
- Works at 320px, at 200% zoom, and keyboard-only with visible focus
- Targets ≥ 44×44px, normal text contrast ≥ 4.5:1 **on whichever surface it
  sits on**
- All content from `lib/content/`, no literals in components
- `npm run check` passes
