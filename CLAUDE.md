# MyFinanceOfficer — build contract

Marketing site for a modern CA firm serving people whose income is not handled
by a normal Indian employer-payroll setup. The complete implementation contract
is in `/docs`. Build from those files only.

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
| Tokens | `docs/design-tokens.css` |
| Content data | `docs/site-content.ts`, `docs/pricing-scope.ts` |
| Motion values | `docs/motion-tokens.ts` |
| Before saying anything is done | `docs/QA_CHECKLIST.md` |

Read the relevant doc before writing code for that area. Never work from this
summary alone.

## Positioning hierarchy — the thing most likely to go wrong

Layer A is core CA, tax and compliance. It dominates the first 75–80% of the
homepage.

Layer B (FX, insurance, loans, wealth, MIS) is subordinate. It appears only
**after** pricing, and is framed as "because we already understand how you earn,
we can also help with adjacent decisions when they become relevant."

Never frame MFO as an all-in-one financial office. Never list Layer B services
as co-equal reasons to hire MFO. Never put a Layer B service above the fold.

## Locked visual system

- **Geist only**, via `next/font/google`, `display: swap`. Weights 400
  (dominant), 500 (UI), 600 (rare). No 700+. No serif. No second family.
  Sentence case.
- **Colour.** Paper `#F6F7F2` · White `#FFFFFF` (literal document objects only) ·
  Ink `#11130F` · Ink-2 `#343731` · Muted `#6A6E66` · Acid `#D7FF00` ·
  Focus `#2457FF`. Error `#B42318` and Success `#2D6A4F` are functional only,
  never decorative.
- **Rules.** `rgba(17,19,15,.16)`, strong `rgba(17,19,15,.34)`. 1px. Never
  0.5px. Rules are the main grouping device; cards are not a substitute.
- **Backgrounds.** Do not alternate section backgrounds for variety.
  H01–H11 paper, H12 final CTA acid, footer paper.
- **Graphic primitive.** Line + node. Hollow = inactive, acid fill = active.
  It means "something changes here." Use it only where that meaning is real.
- **Shape.** Radius 2px buttons, 6px maximum on literal record surfaces. No
  content shadows. Shadow permitted only on overlay/menu:
  `0 12px 40px rgba(17,19,15,.08)`.
- **Grid.** 1440px max. 12 col desktop / 8 tablet / 4 mobile.

## Never build

Stock photos · calculators · rupee icons · coins · handshakes · generic finance
illustrations · 3D objects · glassmorphism · gradients · oversized rounded SaaS
cards · serif display type · decorative eyebrows · numbered feature labels
(`03 / SERVICES`) · warning red · green check-card grids · scroll-jacking ·
fake government forms or logos · a Services mega-menu · bouncy or elastic
motion.

## Hard rules

1. **Prices are exactly ₹19,999 / ₹24,999 / ₹34,999.** Never invent plan names.
   Never state which tier includes which feature.
2. **`approvedPlanScope` is `null`.** Render price-first tiers with no
   comparison checkmarks. The comparison component may exist, but stays hidden
   behind the null check.
3. **Never hard-code tax thresholds, due dates, plan inclusions, legal
   guarantees or foreign-income conclusions** in JSX, SVG or animation code. All
   of it comes from typed content objects in `lib/content/`.
4. **Never sell with fear.** State a consequence once, flat, and move on. No
   countdowns, no red screens, no "you could be fined."
5. **Never attack the family CA.** Frame it as fit and mismatch.
6. **Banned phrases.** expert CAs · X+ professionals · transparent pricing · no
   hidden charges · 100% online · hassle-free · one-stop shop · all-in-one ·
   end-to-end · India's #1 / largest / most trusted · AI-powered · file in
   minutes · maximum refund · starting at ₹999 · hassle · boring · tedious ·
   paperwork. Do not call tax rules "simple" or "easy."
7. **Content must be visible at rest.** `globals.css` kills all animation under
   `prefers-reduced-motion` with `!important`, so any section whose content
   starts at `opacity: 0` will render **blank** for those users. Animate from a
   visible resting state, or gate the initial hidden state behind
   `@media (prefers-reduced-motion: no-preference)`.
8. **No Three.js in the initial bundle.** The only permitted WebGL is an
   optional, lazy-loaded, desktop-only pointer effect on the final CTA, which
   must be removable without trace.
9. **All primary CTAs route to `/get-started`.**
10. **Secrets are never committed.** API keys and recipient addresses come from
    environment variables. Add them to `.env.example` with empty values only.

## Workflow

Work on a branch per session. Run `npm run check` before committing. Commit with
a conventional-commit message. Open a PR and report the Vercel preview URL.

## Definition of done for any section or page

- Renders correctly with JS disabled and with `prefers-reduced-motion: reduce`
- Works at 320px, at 200% zoom, and keyboard-only with visible focus
- Interaction targets ≥ 44×44px, normal text contrast ≥ 4.5:1
- All content from `lib/content/`, no literals in components
- `npm run check` passes
