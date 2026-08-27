# MyFinanceOfficer — Master Build Specification

# 1. Product architecture

The website has one acquisition wedge:

> A modern CA firm built around the way modern independent and internationally paid professionals actually earn.

The broader product is organised into two layers.

## Layer A — Core CA & compliance

This is the primary product story and should dominate the first 75–80% of the homepage.

The site should communicate that MFO:
- tells the customer what they need and what they do not need;
- gets the setup right;
- knows the relevant modern-income workflows;
- runs the compliance calendar;
- prepares drafts before filing;
- takes responsibility for filing/signing/support according to the engagement;
- warns before something becomes late.

## Layer B — Additional financial support

Secondary capabilities:
- FX optimisation;
- insurance optimisation;
- loan optimisation;
- wealth planning;
- MIS.

These are introduced only after the core CA/compliance proposition and pricing context are understood.

Correct framing:

> Because we already understand how you earn, we can also help with adjacent financial decisions when they become relevant.

Incorrect framing:

> Tax + GST + FX + insurance + loans + wealth + MIS: all-in-one financial office.

The second framing destroys the positioning and must not be used.

---

# 2. Visual concept

## The system behind your income

The site should look as though financial and compliance information has been mapped, ordered and made legible.

Primary visual materials:
- amounts;
- dates;
- records;
- filing states;
- threshold nodes;
- timelines;
- ruled matrices;
- short plain-language annotations.

The site should not use:
- stock photos;
- calculators;
- rupee icons;
- coins;
- handshake imagery;
- generic finance illustrations;
- 3D finance objects;
- glassmorphism;
- gradients;
- oversized rounded SaaS cards;
- decorative serif typography;
- decorative eyebrows;
- generic numbered feature labels such as `03 / SERVICES`.

---

# 3. Typography

## Typeface

Use **Geist** only.

Preferred React/Next.js setup:

```tsx
import { Geist } from "next/font/google";

export const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});
```

Use:
- 400 Regular — dominant
- 500 Medium — UI/emphasis
- 600 Semibold — rare

Do not use 700+ as normal brand styling.

## Desktop scale

- Display 1: clamp(60px, 6.1vw, 88px)
- Display 2: clamp(48px, 4.7vw, 68px)
- H1: clamp(42px, 4vw, 60px)
- H2: clamp(34px, 3vw, 48px)
- H3: clamp(24px, 2vw, 32px)
- Lead: 20px
- Body: 17px
- UI: 15px
- Small: 13px

Display treatment:
```css
font-weight: 400;
line-height: .96;
letter-spacing: -.045em;
```

Body:
```css
font-weight: 400;
line-height: 1.52;
letter-spacing: -.012em;
```

Financial numbers:
```css
font-variant-numeric: tabular-nums lining-nums;
```

## Rules

- sentence case;
- left align long copy;
- large headlines regular weight;
- no serif;
- no italic-brand treatment;
- no decorative small caps;
- small labels only when they are actual data, e.g. `Draft`, `Foreign income`, `FY 2026–27`.

---

# 4. Colour system

These are final design values. Developer does not need to retrieve colours elsewhere.

```text
Paper                #F6F7F2
White                #FFFFFF
Ink                  #11130F
Ink secondary        #343731
Muted text           #6A6E66
Acid                 #D7FF00
Focus blue           #2457FF
Functional error     #B42318
Functional success   #2D6A4F
Rule                 rgba(17,19,15,.16)
Rule strong          rgba(17,19,15,.34)
```

Usage:
- Paper is the normal canvas.
- White is reserved for literal document/payment objects.
- Acid is the only brand signal colour.
- Acid is used for primary CTA, active nodes, selected states and the final CTA field.
- Error/success colours are functional only; never use them for marketing decoration.

Do not alternate section background colours for variety.

Homepage:
- H01–H11: paper
- H12 final CTA: acid
- footer: paper

---

# 5. Thin-rule system

Thin lines are the site's main grouping device.

Default:
```css
border: 1px solid rgba(17,19,15,.16);
```

Use horizontal rules:
- under navigation;
- at every major section boundary;
- between data rows;
- between FAQ questions;
- between plan blocks;
- between trust rows.

Use vertical rules on desktop:
- split-copy layouts;
- multi-column recognition;
- operating-model columns;
- pricing columns.

On mobile:
- remove nonessential vertical rules;
- preserve horizontal rules.

Cards are not a replacement for rules.

---

# 6. Graphic primitive

Primary primitive:

```text
────────────○────────────
```

Active:

```text
────────────●────────────
```

The node means:

> Something changes here.

Use it only where that meaning is real:
- Income Axis
- timeline/calendar
- selected stage
- progress/state diagrams

Active node:
- acid fill
- black outline if needed
- active preceding line segment can become 2px acid.

---

# 7. Grid

## Desktop
- max page width: 1440px
- page gutter: 32px
- 12 columns
- 20px gap

## Tablet
- page gutter: 24px
- 8 columns
- 16px gap

## Mobile
- page gutter: 16px
- 4 columns
- 12px gap

Section vertical padding:
- major desktop: 104–128px
- dense desktop: 64–80px
- major mobile: 72px
- dense mobile: 48–56px

---

# 8. Shape and elevation

Buttons:
- radius 2px

Literal record/document surfaces:
- radius 6px maximum

No generic 16–32px card radius.

No content shadows.

Overlay/menu only:
```css
box-shadow: 0 12px 40px rgba(17,19,15,.08);
```

---

# 9. Navigation

Height:
- desktop 64px
- mobile 60px

Style:
- sticky
- paper background
- 1px bottom rule
- no shadow
- no glass effect

Desktop navigation:
- MyFinanceOfficer logo/wordmark
- How it works
- Who it's for
- Pricing
- Guides
- About
- primary CTA: `See what I need`

Hover:
- text darkens
- optional 1px underline
- no pill hover backgrounds

Mobile:
- logo + menu button
- menu rows separated by 1px rules
- CTA at bottom

---

# 10. Buttons

Primary:
- 48px minimum height
- 18px horizontal padding
- acid background
- ink text
- 1px ink border
- 2px radius
- Geist 500, 15px

Hover on fine pointer:
- ink background
- paper text

Secondary:
- plain text link
- arrow
- no surrounding card/button chrome unless needed for touch target.

Only one dominant acid CTA per viewport.

---

# 11. Information objects

Information is the illustration.

## Incoming payment object

Visual anatomy:

```text
INCOMING PAYMENT
────────────────────────────
$5,000.00

From              Overseas company
Received          03 Sep 2026
Into              Indian bank account
Frequency         Monthly

Indian payroll    Not handled here
India-side setup  Needs its own answer
```

Important:
Do not claim that every overseas payslip has the same tax treatment.

Approved marketing interpretation:

> A payslip from abroad does not mean there is an Indian employer handling the India-side tax and compliance for you.

## Filing object

```text
INCOME TAX RETURN
────────────────────────────
Status            Draft
Prepared          18 Jul
Sent to you       19 Jul
Approved          —
Filed             —
```

## Deadline object

```text
NEXT OBLIGATION
────────────────────────────
What              [reviewed obligation]
When              [reviewed date]
Status            MFO tracks
```

No fake government logos.
No imitation of an official government form.

---

# 12. Homepage architecture

Order is locked:

1. Hero
2. Recognition
3. Latent problem
4. Structural mismatch
5. Income Axis
6. Operating model
7. Managed calendar
8. Core CA/compliance scope
9. Trust ledger
10. Pricing
11. Additional financial support
12. FAQ
13. Final acid CTA
14. Footer

The broader financial services do not appear before pricing.

---

# 13. H01 Hero

Desktop:
- minimum ~700px
- target `calc(100svh - 64px)`
- 12-column grid
- headline approx cols 1–9
- subhead/CTA approx cols 1–5
- IncomingPayment object approx cols 8–12, lower right

Do not centre the hero.

Mobile:
copy → CTA → payment object.

Hero animation is specified in motion section.

---

# 14. H02 Recognition

Desktop:
4 equal cells separated by vertical rules.

No icons.

Mobile:
one ruled row each.

---

# 15. H03 Latent problem

Large proposition on left/top.
Below/right: 3-column ruled table.

Columns:
- What started
- Why it matters later
- What the customer notices

Do not use warning red.

---

# 16. H04 Structural mismatch

Desktop:
- 5/7 split
- 1px vertical rule

Right-side rows:
- Traditional CA relationship
- Filing software
- Service marketplace
- Internet advice

Row columns:
- Where it helps
- What it does not own

Tone:
fit, not attack.

---

# 17. H05 Income Axis

This is the signature interaction.

## Public content model

Do **not** hard-code universal tax thresholds into the visual system.

Default public milestones:

1. First income
2. First year
3. Registration becomes relevant
4. Income and obligations grow
5. Structure needs reviewing

A CA-reviewed content file may later add numeric values such as a threshold, but design and layout must not depend on a specific number.

## Desktop behaviour

Section scroll length: approximately 300–340vh.

Sticky panel:
```css
position: sticky;
top: 64px;
height: calc(100svh - 64px);
```

Normal document scrolling only.

Lower portion:
full-width line/node axis.

Each milestone has:
- label;
- customer question;
- what changes;
- what MFO does.

Active state:
- preceding line fills acid;
- node fills acid;
- node grows to 1.18 scale;
- detail crossfades.

## Mobile and reduced-motion
Use a vertical sequence.
All content visible as normal HTML.
No sticky dependence.

---

# 18. H06 Operating model

Headline:
`You shouldn't have to know which question to ask.`

Three desktop columns with vertical rules:

1. We start you off right.
2. We run it, not you.
3. We're on the hook.

No icons.
No cards.

---

# 19. H07 Managed calendar

Do not build a conventional monthly calendar.

Use a vertical temporal ledger.

Desktop:
- copy 4 cols
- vertical rule
- ledger 7 cols

Structure:
```text
YOUR YEAR

START
│
● Setup / registrations if relevant
│
● Tax/compliance checkpoint
│
● Filing preparation
│
● Next obligation
│
YEAR END
```

The exact dates/obligations come from reviewed content.

Marketing message:
`Your exact calendar depends on how you earn. Once you're with MFO, tracking it is our job.`

---

# 20. H08 Core scope

This section was redesigned to resolve the previous product-positioning conflict.

Headline:
`The CA and compliance work we are built to run.`

Use a ruled matrix/list with these categories:

- Setup & registrations
- Income tax
- GST & export compliance where relevant
- Advance-tax planning/filing where relevant
- Drafts & filing
- Notices
- Ongoing tax/compliance questions
- Income documentation / proof

Do **not** include:
- FX
- insurance
- loans
- wealth planning
- MIS

in H08.

This section describes the core relationship, not exact plan inclusion.

Exact plan inclusion belongs to pricing data.

---

# 21. H09 Trust ledger

Headline:
`Judge us by what happens before we file anything.`

Ruled two-column rows:
- What we do
- Why it matters

Content candidates:
- You see a draft before anything gets filed.
- Your own contact details stay on your portals.
- A named ICAI-registered signatory is attached to the return.
- Notice support follows the agreed scope.
- If you do not need something yet, we say so.

No green check-card grid.

---

# 22. H10 Pricing

The homepage must show all three exact annual price points:

- ₹19,999 / year
- ₹24,999 / year
- ₹34,999 / year

Layout:
one ruled pricing system with three adjacent desktop columns.

Do not use:
- floating cards;
- shadows;
- fake discounts;
- `most popular` unless actual data exists;
- crossed-out prices;
- monthly equivalents.

Because exact plan names and plan-by-plan inclusions were not established in the supplied material, homepage pricing uses **price-first tiers**.

Each tier contains:
- annual price;
- `Annual plan`;
- one line: `Your exact scope is confirmed before you sign up.`;
- CTA: `Find the right plan`.

Under all tiers:
`The plan you need depends on the CA/compliance work you need and whether broader financial support is relevant. We tell you before you commit.`

Once the owner provides the exact plan mapping, populate `pricing-scope.ts`; the component can reveal the comparison without redesign.

---

# 23. H11 Additional financial support

This is intentionally secondary.

Headline:
`And when something else comes up.`

Intro:
`Tax and compliance are the part we run all year. Because we already understand how you earn, some plans can also include help with adjacent financial decisions.`

Ruled rows/columns:
- FX optimisation
- Insurance optimisation
- Loan optimisation
- Wealth planning
- MIS

No icons.
No separate long selling sections.

Do not describe MFO as an “all-in-one financial office” here.

---

# 24. H12 FAQ

Ruled accordion.

Minimum row:
- 64px desktop
- 56px mobile

Questions:
- I don't earn enough for this yet.
- My family already has a CA.
- Why not just use filing software?
- Is this cheaper than a normal CA?
- Are you using AI to do my taxes?
- I get a payslip from abroad. Is this still for me?
- What if I also need help with FX, insurance or a loan?

---

# 25. H13 Final CTA

Full acid background.

Headline:
`Tell us how you earn. We'll tell you what you actually need.`

Support:
`If the answer is “not yet”, we'll tell you that too.`

CTA:
- ink background
- paper text
- `See what I need`

Optional pointer effect is specified under motion and must not be required.

---

# 26. Footer

Paper background.
Top rule.

Columns:
- Product
- Who it's for
- Learn
- Company
- Legal

No oversized decorative footer wordmark required.

---

# 27. CTA behaviour

All primary `See what I need` / `Find the right plan` actions route to `/get-started`.

The page should be buildable without an external CRM.

## Get-started form

Step 1:
`How are you paid?`
- An overseas company
- Indian clients
- Both
- Creator / brand income
- Independent professional practice
- Something else

Step 2:
`Where are you now?`
- Just started
- First year
- Already filing
- Switching from another CA
- Not sure

Step 3:
`What do you need help with?`
- I don't know yet
- Getting set up
- GST / compliance
- Filing / tax
- Foreign income
- Switching CA
- Something else

Step 4:
- Name
- Email
- Phone
- optional free-text note

Frontend posts to `/api/leads`.

Server-side integration is isolated behind:
```ts
submitLead(payload)
```

If the business later chooses CRM/email tooling, only this adapter changes.

Success state:
`Got it. We'll review how you earn and tell you what makes sense from here.`

No automatic plan recommendation based on tax rules unless the logic is reviewed.

---

# 28. Motion system

Motion should feel like the system draws itself around information.

Repeated choreography:
1. rule draws;
2. proposition reveals;
3. object/data resolves.

## Global timings

- fast: 140ms
- normal: 220ms
- slow: 360ms
- headline: 520ms
- major rule: 720ms
- internal rule: 420ms
- word stagger: 40ms
- standard travel: 12px
- reveal easing: cubic-bezier(.16,1,.3,1)
- system easing: cubic-bezier(.22,.75,.18,1)

No bounce.
No elastic-brand spring.

## Hero
- masked line/word reveal
- payment object constructs in <800ms
- CTA appears once
- then stops

## Section rules
- first entrance only
- horizontal rule scaleX 0→1
- 650–800ms
- reduced motion: present immediately

## Information objects
Rows resolve sequentially.
No typing effect.
Hover: maximum -2px lift on fine pointer.

## Income Axis
Largest motion budget.
- acid progress line
- active node fill
- node scale 1→1.18
- one subtle pulse
- detail crossfade
- 8–12px copy travel

No scroll-jacking.

## Temporal ledger
- vertical line draws
- nodes resolve
- one active/current state can become acid

## FAQ
- 180–240ms open/close
- reduced motion: immediate

## Final CTA
Optional subtle pointer-local distortion.
Rules:
- desktop fine pointer only;
- disabled on mobile;
- disabled with reduced motion;
- lazy-loaded;
- one canvas maximum;
- no particles;
- no cursor trail;
- no content distortion;
- remove entirely if it affects performance.

The site must be complete without WebGL.

---

# 29. Responsive behaviour

Breakpoints:
- 0–767 mobile
- 768–1023 tablet
- 1024+ desktop
- 1440+ wide

Mobile is not compressed desktop.

Must recompose:
- vertical rules removed where cramped;
- Income Axis vertical;
- pricing stacked;
- scope rows stack labels/values;
- hero object follows copy;
- no pointer effect;
- all information available without hover.

---

# 30. Accessibility

Target WCAG 2.2 AA.

Required:
- normal text 4.5:1 minimum;
- large text 3:1;
- all project interaction targets at least 44×44px;
- visible focus;
- semantic buttons/links;
- one H1;
- logical heading order;
- skip-to-content;
- no hover-only content;
- no colour-only meaning;
- accordion uses `aria-expanded`;
- Income Axis is HTML, not canvas-only;
- reduced-motion support;
- 200% zoom works;
- 320px width works;
- form errors associated to fields.

---

# 31. Performance

- Geist only.
- Prefer framework self-hosting of Google Font at build time.
- No Three.js in initial bundle.
- No continuous requestAnimationFrame for normal sections.
- Use IntersectionObserver.
- Use transform and opacity.
- Optional WebGL dynamically imported only when visible.
- Width/height set on all media.
- Avoid layout shift.

Targets:
- LCP ≤ 2.5s target
- CLS ≤ 0.1
- INP ≤ 200ms target

---

# 32. Developer component tree

```text
App
├── SiteHeader
├── HomePage
│   ├── Hero
│   │   └── IncomingPaymentRecord
│   ├── RecognitionStrip
│   ├── LatentProblemTable
│   ├── StructuralMismatch
│   ├── IncomeAxis
│   │   └── IncomeAxisMilestone[]
│   ├── OperatingModel
│   ├── TemporalLedger
│   ├── CoreScopeMatrix
│   ├── TrustLedger
│   ├── PricingGrid
│   ├── AdditionalFinancialSupport
│   ├── FAQ
│   └── FinalCTA
├── SiteFooter
└── GetStartedPage
    └── LeadForm
```

Secondary pages use the same primitives and are specified separately.

---

# 33. Content architecture rule

Never hard-code:
- tax thresholds;
- tax due dates;
- plan inclusions;
- legal guarantees;
- foreign-income tax conclusions

inside JSX/SVG/animation code.

All such content must come from typed content/config objects.

This prevents design from becoming legally stale.

---

# 34. Definition of done

A screenshot with the logo removed should still feel like MFO because it contains:
- Geist;
- near-black on paper;
- acid as signal;
- 1px rules;
- line/node threshold language;
- real-looking financial information objects;
- huge regular-weight propositions;
- almost no generic cards.

A visitor should understand, in order:
1. this is for how I earn;
2. it is a CA firm;
3. MFO is proactive rather than filing-only;
4. MFO understands foreign/modern income;
5. MFO runs the core compliance relationship;
6. broader financial services are additional, not the category;
7. there are three known annual price points;
8. the next step is describing how I earn.
