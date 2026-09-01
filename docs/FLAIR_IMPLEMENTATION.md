# Flair implementation

Fifteen items that add character to the build without touching a proposition,
a price, a date or a threshold. Read this with `CLAUDE.md`; where the two
disagree, `CLAUDE.md` wins.

---

## §1. The seven invariants

These are the rules the flair work is most likely to break. Each maps to a line
in `CLAUDE.md` or to `scripts/guardrails.mjs`.

1. **No literal hex.** Guardrails scans for hex outside the locked palette. Use
   `var(--acid)`, `var(--ink)`, `var(--rule)`, `var(--rule-strong)`,
   `var(--muted)`, `var(--paper)`, `var(--white)` only.
2. **No gradients.** Not for texture, not for a fade, not for an arc. Fades are
   built from stepped solid strips; arcs are built from discrete ticks.
3. **Content visible at rest.** Every `opacity: 0` or `transform` start state
   sits inside `@media (prefers-reduced-motion: no-preference)` **and** under
   `:global(html.js)`. Copy this pattern verbatim from `motion.module.css`.
4. **Radius ceiling.** 2px buttons, 6px on literal record surfaces, `50%` on
   circular nodes (percentage radius is exempt). Nothing else gets a radius.
5. **No content shadows.** Depth in a plate comes from offset and rule weight,
   never a shadow. The overlay/menu shadow is the only permitted one.
6. **No new content in components.** Plate labels, stage names, milestone names,
   coverage truth values — all typed in `lib/content/`. A plate must render
   correctly when a field is `null`.
7. **Decorative means decorative.** Every plate and axis carries
   `aria-hidden="true"`, and everything it marks exists as real text nearby.
   Motion is one pass; nothing loops.

Two more, from `tests/site.spec.ts`: no horizontal scroll at 320px, and the page
must be identical with JavaScript disabled. Anything drawn in JS is therefore
decorative only.

---

## §2. New primitives

Build these before touching any section.

### 2.1 `components/motion/useScrollProgress.ts`
An intersection-driven "which stop am I on" hook. Sentinel strip, viewport
midpoint. Never a `scroll` listener plus a one-shot `getBoundingClientRect()`:
that latches the wrong stop before layout settles.

### 2.2 `components/motion/CountUp.tsx`
Renders the already-formatted final string at rest, so no-JS and reduced-motion
are correct. Animates once, never loops. The formatter lives in
`lib/content/format.ts`.

### 2.3 `components/plates/Plate.tsx` + `Plate.module.css`
One component, a `kind` union, sixteen identical `.part` spans positioned
entirely from CSS by `:nth-child()`. No inline styles, no numbers in the TSX.
88px square, 1px rule, `aria-hidden`.

| kind | geometry |
|---|---|
| `recognition` | 3x3 grid of 10px hollow nodes, centre node acid |
| `latentProblem` | horizontal `--rule-strong` line, four nodes; the third drops 20px on a 1px acid riser and fills acid |
| `mismatch` | two 44px hairline squares offset by 22px; acid node at the single intersection |
| `incomeAxis` | four ascending steps, 17px runs and 14px risers; first two acid at 2px, rest `--rule-strong` at 1px |
| `calendar` | 56px hairline circle, twelve 8px ticks by `rotate`; first four acid |
| `coreScope` | 4x4 of 12px squares; five filled acid with an `--ink` border, rest `--rule-strong` hollow |
| `trust` | two concentric bracket sets (four 12px corners each) in `--rule-strong`, plus a 12px acid square at the centre |

Mount in the left gutter beside the H2. Never add a plate to a section whose
idea it does not literally describe.

### 2.4 `components/plates/index.ts`
Barrel file, matching `components/foundation/index.ts`.

---

## §3. Items

### 01 - The record composes itself
`RecordSurface.module.css`, `RecordSurface.tsx`, `Hero.tsx`

- Keep the existing `Reveal variant="rows"` stagger.
- Scanline: `::before` on `.surface`, 2px wide, `var(--acid)`, 64px tall,
  `animation: scanDown var(--motion-slow) var(--ease-system) both`, inside both
  gates. `overflow: hidden` on `.surface`.
- Counting figure: wrap `{amount}` in `<CountUp>`. Numeric value and formatter
  come from `hero.paymentExample`; add `amountValue` beside `amount`.
- Terminal node: `RecordRow` grows `state?: "unresolved"`. When set, the value
  renders with a `<ThresholdNode>` before it. Set it on `indiaSideSetup`. The
  node fills acid last, on a 760ms delay.
- The note's top rule draws with `transform: scaleX()` from `left center`.

### 02 - Measure field behind the hero
`Hero.module.css`, `Hero.tsx`

- One `aria-hidden` div, `position: absolute; inset: 0; overflow: hidden;
  pointer-events: none`, behind the `Container`.
- Column hairlines: nested 12-column grid, `border-left: 1px solid var(--ink)`,
  `opacity: .075` on the wrapper.
- Baselines: nine absolutely-positioned 1px spans at 48px intervals. Never
  `repeating-linear-gradient`.
- Fade: ten flex strips of `--paper` at stepped alpha
  (1, 1, .92, .8, .66, .52, .38, .24, .12, 0), left to right.
- Pointer drift: `--field-x` / `--field-y` from `pointermove`, 400ms transition,
  travel capped at 6px. Gated on `(hover: hover) and (pointer: fine)` and
  reduced motion; listener dropped below 1024px.

### 03 - Time rail on the latent problem
`LatentProblemTable.*` - applies to the interim `.split` rendering.

- Right cell gets `position: relative` and a 1px `var(--rule)` rail in a 60px
  left inset, with a `var(--acid)` 2px fill driven by the active index.
- One `<ThresholdNode>` per `.summaryRow`, on the rail at the row's first-line
  optical centre (26px down).
- Driven by `useScrollProgress(examples.length)` and a sentinel strip.
- `railStart` / `railEnd` are new copy in `latentProblem`. No due dates.
- Reduced motion / no-JS: rail present, nodes hollow, no fill.

### 04 - Coverage strips on the mismatch table
`lib/content/homepage.ts`, `StructuralMismatch.*`

- Content first: `coverageStages` (five labels, no dates) and an
  `owns: readonly CoverageStageId[] | null` field per alternative, `null` until
  a CA reviews it. The strip renders only when `owns !== null`.
- Strip: five 8px flex segments, hollow `1px solid var(--rule-strong)`, owned
  `1px solid var(--ink)` + `background: var(--acid)`. Adjacent owned segments
  drop the shared border.
- Hover (fine pointers): row seats onto `var(--white)`, second line fades in.

**Needs a human decision before it can go live.**

### 05 - Income Axis as a step plot
`components/foundation/StepAxis.*`, `IncomeAxis.tsx`

- Sibling to `NodeAxis`, same props, drop-in swap.
- Geometry in percentages, never pixels. Levels come from the stop index, not
  from content: the y-axis is unlabelled and means nothing quantitative.
- Passed runs and risers 2px `var(--acid)`; ahead 1px `var(--rule-strong)`.
  Active node scales to 1.18 and pulses once, reusing `nodePulse` and
  `MFO_MOTION.incomeAxis`.
- Three faint `var(--ink)` guides at 25/50/75%, `opacity: .075`.
- `aria-hidden="true"`.

### 06 - Scope matrix as an instrument
`CoreScopeMatrix.module.css` - pure CSS beyond `position: relative` on `.row`.

Hover, fine pointers only: row seats onto `var(--white)`, lifts 2px, top rule
goes to `--rule-strong`, and a 10px gutter node fills acid.

### 07 - One clause carries acid
`MaskedText.tsx`, `motion.module.css`, `lib/content/homepage.ts`

- `MaskedText` grows `emphasis?: string`, split on the content string, never an
  index. If not found, render unchanged.
- `headlineEmphasis` is content.
- Band: `::before`, `bottom: .1em`, `height: .38em`, `var(--acid)`,
  `scaleX(0)` from `left center`, released at 780ms. Behind both gates.
- Exactly one emphasis per page, hero only.

### 08 - Controls that answer back
`Button.module.css`, `TextLink.module.css`, `LeadForm.module.css`

- Button: `::after` wipe from `left center` in `var(--ink)`, label above it at
  `z-index: 1`, label to `var(--paper)` on hover. Children wrap in a label span.
- TextLink: underline as a scaling `::after`, arrow steps 3px.
- LeadForm: on `:focus-within`, a 2px `var(--acid)` rule scales in at the
  field's base, border to `var(--ink)`, label to `var(--ink)`. The existing
  `:focus-visible` outline stays. A valid field resolves its trailing node to
  acid, driven from the form's validation state.

### 09 - The page rail
`components/chrome/PageRail.*`, `app/layout.tsx`

Bends the contract: a persistent decorative element. Not scroll-jacking - the
wheel is never touched - but decide deliberately.

- `null` below 1024px and under reduced motion. `fixed` in the left gutter,
  below the sticky header.
- Stops from a `sectionIndex` array in `lib/content/navigation.ts`. Not rendered
  on pages that do not declare an index.
- Nodes are `<a href="#id">`, keyboard reachable, and work with JS disabled.
- Driven by `useScrollProgress` over the real sections.

### 10 - A mark for every section
`components/plates/*`, plus one line per section component

`RecognitionStrip`, `LatentProblemTable`, `StructuralMismatch`, `IncomeAxis`,
`TemporalLedger`, `CoreScopeMatrix`, `TrustLedger` - one each, no others.

### 11 - Two grids that don't register
`components/plates/OffsetGridPlate.*`, `StructuralMismatch.tsx`

- Two grids, 10x6, all geometry in percentages. Base in `var(--rule)`; the
  offset grid translated by half a cell, in `var(--rule-strong)`, inset by half
  a cell so it does not overhang.
- Four acid nodes where the grids coincide, at `[[2,1],[5,3],[8,2],[6,5]]`.
- Draws column by column on entry via `Reveal`, nodes last. Behind both gates.
- H04 right cell on desktop; hidden below 1024px.

### 12 - The routing plate
`components/plates/RoutePlate.*`

- Percentages. Source node at 0, the India-side rule at 42%, 8% branch runs,
  labels from 50% to the right edge.
- Three destination labels come from `coreScope` - take the first three.
- The crossing rule is 1px `var(--ink)`, the only strong vertical. Its label is
  new copy in the content file.
- Far-side nodes hollow with exactly one acid. Never all three.
- Home is `/how-it-works`, not the hero.

### 13 - The year, as a ring
`components/plates/YearRing.*`, `TemporalLedger.tsx`

- 60 ticks at `rotate(6deg * n)`; every fifth is 14px instead of 7px. The
  passed arc is the ticks recoloured to `var(--acid)` - no gradient, no SVG.
- Five stage nodes at 72 degree intervals from `temporalLedger.entries`. The
  passed tick count must land exactly on a stage node (12 ticks per stage).
- Centre caption is content at rest; hovering a stage node swaps it. Hover only.
- Never a date, a month name or a threshold. Renders fully under reduced motion.

### 14 - Draft, then filing
`components/plates/SheetStack.*`, `OperatingModel.tsx`

- Three 236x168 `var(--white)` rectangles, `border-radius: var(--radius-object)`,
  1px `var(--rule)` (front sheet `var(--rule-strong)`), stepped 16px. Front
  sheet carries four hairline text-lines and one acid node on an approval line.
- Hover fans the stack 4px per sheet. No shadow - the offset is the depth.
- Abstract only: no field labels, no form title, nothing resembling a government
  document.

### 15 - A year of income, as a field
`components/plates/EventField.*`, `lib/content/*`

- 52 columns x 4-5 rows of `aspect-ratio: 1` cells, 3px gap. Hollow
  `var(--rule)`, a payment `var(--rule-strong)`, something-to-do `var(--ink)`
  border + `var(--acid)` fill.
- The pattern is content, not code, and the caption says it is illustrative.
- Two-state toggle; both states are valid resting states.
- Below 768px drop to 26 columns or hide. Never force a horizontal scroll.

---

## §4. Guardrail traps

| What you'll reach for | Why it fails | Do this instead |
|---|---|---|
| `repeating-linear-gradient` for baselines | guardrails: gradients | absolutely-positioned 1px spans |
| `linear-gradient` for a fade | guardrails: gradients | stepped strips of `--paper` at decreasing alpha |
| `conic-gradient` for the ring arc | guardrails: gradients | recolour the discrete ticks |
| a literal hex in a module | guardrails: hex outside palette | `var(--acid)` |
| `border-radius: 12px` on a plate | 6px ceiling | 2px, 6px, or `50%` |
| `box-shadow` for stack depth | no content shadows | offset + rule weight |
| `font-weight: 700` on a plate label | no 700+ | 500 |
| `opacity: 0` at rest, ungated | invariant 3 - renders blank | wrap in both gates |
| inline `style={{ left: 300 }}` geometry | 320px scroll test | percentages |
| a label typed into a plate | content lives in `lib/content/` | add a typed field |

---

## §5. QA additions

In `tests/site.spec.ts`:

1. Plates are invisible to assistive tech - every plate and the rail's
   decorative fill resolve to `aria-hidden="true"`.
2. Reduced motion renders everything - non-zero opacity on the hero record rows,
   the acid clause's parent, and each plate.
3. No-JS parity holds, including the page rail.
4. No horizontal scroll at 320px. Do not weaken it; fix the plate.

In `scripts/guardrails.mjs`: add a check for
`animation-iteration-count: infinite`. Nothing on this site loops.

---

## §6. Phasing

| Phase | Items | Why here |
|---|---|---|
| 1 | §2 primitives, 01, 06, 08 | Highest ratio of felt quality to risk. |
| 2 | 10, 14 | The plate system and its easiest member. |
| 3 | 02, 07, 03 | Hero character, then the first scroll-linked item. |
| 4 | 05, 13 | Two diagram upgrades, both swaps into existing sections. |
| 5 | 11, 12, 15 | The large plates. Each needs a content decision. |
| 6 | 04, 09 | Blocked on a human decision. Ship only once someone says yes. |

Phases 1-4 are additive and reversible. Nothing before phase 5 touches a
proposition, a price, a date or a threshold.
