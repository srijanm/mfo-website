# MyFinanceOfficer — complete visual redesign prompt

Use this file as the implementation brief in the existing website repository. Everything under “Implementation prompt” is addressed to the coding agent. This brief is self-contained; the nine original desktop screenshots are helpful references if available, but are not required to begin.

## Implementation prompt

Implement a complete visual redesign of the MyFinanceOfficer marketing page described below, including original graphics, responsive layouts, and visual verification. Work in the existing repository and deliver working code. Do not stop at an audit, a plan, a new stylesheet, or a partial hero redesign. Complete all sections and the graphics.

### 1. Context, scope, and source of truth

The owner likes the existing fonts and colours. Preserve the actual font families and core palette from the repository. The current design feels flat because the composition is weak, large empty areas disconnect related content, generic bordered cards repeat everywhere, and the graphics communicate little.

Reference URL: https://mfo-website-p6uekuobp-srijanms-projects.vercel.app/who-its-for

The supplied screenshots contain the following sequence. Locate the route containing these exact headings rather than assuming the URL identifies the route correctly:

1. Hero: “Half the work you do didn’t exist when your family’s CA started out.”
2. “How your money reaches you” — four income types and a year comparison.
3. “Nothing goes wrong in your first year.” / “It goes wrong in your third, about something from your first.”
4. “Your work changed. Most CA practices were built around a different kind of client.”
5. Dark interactive section: “Your obligations change as your income and setup change.”
6. “The CA and compliance work we are built to run.”
7. “Transparent pricing without any nasty surprises.”
8. “Questions people ask before they start.”
9. Lime closing CTA: “Tell us how you earn. We’ll tell you what you actually need.”
10. Footer.

Redesign this complete page. Update shared navigation, buttons, and reusable visual primitives where needed, and check other routes affected by those changes. Do not independently rewrite every other page or alter application logic.

Read the repository instructions first. Inspect the framework, routing, font setup, tokens, content sources, existing components, and current working-tree changes. Preserve unrelated work. Use the existing framework and styling conventions. Reuse installed animation and icon libraries only if useful; this redesign should not require a new graphics service or heavy dependency.

Preserve the positioning, approved business copy, prices, links, form behaviour, SEO metadata, and factual qualifications. Change wrapping, grouping, presentation, and concise graphic labels. Do not invent testimonials, qualifications, customer numbers, platform integrations, tax rules, deadlines, or plan inclusions. If a positioning document exists in the repository, use it to resolve messaging ambiguity.

The reviewed material consists of desktop screenshots, not source code or a tested mobile site. Inspect actual interactions and styles before diagnosing their implementation. The dimensions below are design targets in CSS pixels, not measurements extracted from the images.

### 2. The selected art direction

Create a contemporary editorial identity for a modern CA firm: oversized but controlled typography, warm paper backgrounds, precise financial-document graphics, confident lime accents, and a single substantial dark chapter.

The page should convey that modern income creates moving parts, and MFO brings order and ongoing attention to them. Express that through records, aligned rows, dates, understated stamps, and clear status markers. The graphics must explain the service and feel specific to this business.

Use three levels of visual intensity:

- **Opening:** a large headline paired with a substantial original financial-document composition.
- **Middle:** compact, well-typeset supporting sections, followed by a dark interactive explanation with a second substantial graphic.
- **Close:** clear services and pricing, a quiet FAQ, and a confident lime CTA.

Do not add gradient blobs, glass panels, 3D coins, stock business photography, floating avatars, decorative dashboards, random sparklines, marquees, or a universal bento grid. Do not put a box around every text group. Do not rely on entrance animation to make an empty layout feel designed.

### 3. Layout and type system

Establish shared tokens before implementing the sections. Reuse existing palette values; add only necessary tints of those colours.

| Element | Desktop target | Mobile target |
| --- | --- | --- |
| Content container | Maximum 1280px, centred; at least 40px side gutters | 20px side gutters; 24px when space permits |
| Main layout | 12 columns; 24–32px gaps | One column, with deliberate exceptions for small paired elements |
| Header | Approximately 76px tall | Approximately 64px tall |
| Hero heading | Fluid 60–82px; approximately 1.02–1.06 line height | Fluid 38–48px; approximately 1.05–1.1 line height |
| Section heading | Fluid 36–48px; approximately 1.1 line height | 28–34px; approximately 1.12 line height |
| Body copy | 17–19px; 1.5–1.6 line height | 16–17px; approximately 1.5 line height |
| Graphic labels | 12–14px | At least 12px, without scaling a desktop graphic down wholesale |
| Supporting section padding | Usually 64–88px vertically | Usually 44–56px vertically |
| Major section padding | Usually 88–112px vertically | Usually 56–64px vertically |
| Buttons | At least 48px high | At least 48px high |
| Corners | Consistent 4–8px for document surfaces | Same system |

Use the original font families. Tune weight and tracking instead of replacing them. Reserve tight tracking for display text; keep body text comfortable. Use tabular numerals for amounts where supported by the existing font.

Keep prose measures around 45–65 characters. Avoid long sentences spanning the full container. Let headings wrap intentionally; use balanced wrapping when supported and sensible max-width fallbacks. Do not insert universal hard line breaks that break intermediate widths.

Use a small spacing scale, for example 8, 12, 16, 24, 32, 48, 64, 80, 96. Space between a label and its content must be substantially smaller than space between unrelated groups. Avoid fixed viewport-height sections and spacer divs.

Lime is for primary actions, active markers, the hero’s supporting colour field, and the final CTA. Use dark text on lime. Secondary copy and dark-section labels must remain legible; inspect actual colour contrast rather than using extremely low opacity by habit.

### 4. Header

Retain the wordmark, link labels, destinations, and “See what I need” CTA. Align the header with the page container. Keep a quiet bottom rule and a solid background. If sticky behaviour exists, retain it only where it does not obscure content. Apply appropriate anchor scroll offsets.

On mobile, use the existing accessible menu or improve it: visible menu trigger, correct expanded state, keyboard operation, and predictable closing. The logo and CTA must not collide. Do not add a new logo treatment or a second competing navigation system.

### 5. Hero: rebuild the composition and the main graphic

Use a seven-column text area and five-column illustration area at wide desktop widths. Vertically centre the illustration against the combined heading, supporting copy, and actions. The illustration must begin beside the headline, not beneath it beside only the paragraph.

Keep the existing headline verbatim. In the wide composition, aim for four or five intentional lines. Keep the text column approximately 640–720px wide where the viewport permits. Use the line count as a compositional target, not a reason to overflow or distort the font.

Keep the supporting paragraph approximately 520–560px wide and 24–28px below the heading. Place the two existing actions 24–28px below it with a 12px gap. Use lime for the primary action and a quiet secondary treatment for “View pricing.”

Remove the page-wide spreadsheet background. Use the warm background as a calm canvas. Any faint document rules belong inside the illustration.

#### Original graphic A: Payment received / ongoing work

Build this as semantic HTML for all text and CSS plus inline SVG for decorative geometry. It must remain crisp and editable. Do not make it a screenshot of a fictional software product.

Wide-screen composition: approximately 440–500px wide and 420–500px tall, fitting its column. It contains one dominant white payment document and a smaller dark work docket in front of its lower edge. A flat lime backing rectangle, offset approximately 16px to the top/right, gives the composition presence. Keep everything inside the illustration’s layout bounds.

The main document:

- Eyebrow: “ILLUSTRATIVE PAYMENT”.
- Amount: “$5,000.00”, approximately 44–56px, the dominant detail.
- A fine rule followed by concise rows: “From / Overseas company”, “Into / Indian bank account”, “Frequency / Monthly”. These are the illustrative details already shown in the current hero.
- A small lime marker beside “Payment received”. Use a text label as well as colour.
- Approximately 24–28px interior padding; restrained border; one subtle shadow is acceptable here.

The dark docket:

- Title: “The work around it”.
- Three clearly spaced rows: “Income records”, “Relevant registrations”, “Filing calendar”.
- Lime square markers and fine dark-surface separators; no fabricated completion checkmarks or actual deadlines.
- A small qualification: “Scope depends on your setup.”

The docket should overlap the main document by only about 24–40px. Reserve physical space for it; do not hide document content underneath it. Keep it slightly narrower than the main document. Use a subtle document edge or tiny offset sheet behind the white panel, with no random rotation.

This graphic illustrates a payment and the associated work. It must not imply MFO processes payments, provides a bank account, or has completed work for a real customer. Keep “Illustrative payment” visible. Preserve any substantive existing hero qualification in nearby text if replacing the current panel would otherwise lose it.

On mobile, place the complete illustration below the actions with a 32–40px gap. Reflow it using real text sizes; reduce padding and use a 12px backing offset. Preserve the amount and essential rows. Remove only decorative sheet edges if necessary. Do not introduce horizontal overflow.

Target a hero that feels complete in roughly one desktop screen at 1440×900; allow natural overflow at shorter heights. No fixed 100vh hero. At 1440×900, the start of the next section should be reasonably close to the fold rather than separated by a blank viewport.

### 6. Income types and the year comparison

Remove the large boxed geometric icon beside “How your money reaches you.” Align the heading directly to the container grid.

Replace the four empty outlined cards with a compact four-column editorial row. Each entry has a small custom line illustration above its existing label, generous enough to read but without a surrounding card border. Use modest vertical separators on desktop if needed.

#### Original graphic B: four income illustrations

Create four inline SVGs using a shared approximately 64×48 viewBox, 1.5px strokes, consistent corners, dark strokes, and one lime detail each:

1. Global enterprise: a small document with three text rules, an outward-to-inward arrow, and one destination marker.
2. Consulting: two slightly offset invoice sheets and one highlighted signature line.
3. Creator/brand income: a small media frame with a play triangle and a compact payment slip at one corner.
4. Independent professional income: a restrained briefcase/document silhouette with a highlighted record tab.

Keep these subordinate to their labels. They are decorative beside visible text and should be hidden from assistive technology. Reuse the same stroke language elsewhere. Do not use emoji or mismatched icon packs.

Lay the entries out as four columns on desktop, two on tablet, and two or one on mobile according to label fit. Preserve real links if these categories navigate. Do not create false interactive affordances for static entries.

Keep the explanatory paragraph below the row, constrained to approximately 760px. Replace the large ambiguous heatmap with a compact, labelled “Two illustrative years” comparison:

- Two rows are visible together, labelled “A salaried year” and “A year like yours”.
- Across them, use 12 labelled month groups on desktop. Neutral equal markers suggest a regular pattern; varied markers suggest a less uniform pattern.
- Caption: “Illustrative income patterns. Not customer records; no amounts shown.”
- Use deterministic, locally defined illustration data. Do not call it actual customer data or imply exact financial measurements.
- The graphic’s message is the contrast in patterns; no tooltip or animation should be needed to understand it.
- Use dark neutral marks for income in both rows. Reserve lime for an explanatory annotation such as “More moving parts,” not a fake risk score.
- On mobile, present each year as a separate compact panel with two rows of six month groups. Keep labels readable.

Keep this visual approximately 140–200px high on desktop, including labels. It is supporting evidence, not another hero.

### 7. Delayed problems: compact editorial timeline

Preserve the “Nothing goes wrong…” statement, its second sentence, and all four existing examples. Use a five-column statement area and seven-column timeline area. Align their tops. Remove surrounding card framing.

Give the first sentence the strongest typographic emphasis. Make the second sentence somewhat smaller and muted, but comfortably legible. Place the explanatory paragraph 24px below.

On the right, use four text entries with a slim vertical rule, small markers, and clear year annotations. Group the first three under “Year one” and the final under “Year three,” as in the current screenshot. Use 20–24px vertical padding and readable line lengths. Emphasise the final marker in lime. Do not imply each issue happens to every customer.

Keep this section naturally sized. On mobile, stack the statement and timeline with a 32px gap. No oversized geometric heading icon.

### 8. Alternatives comparison: give the text room

The current long heading is squeezed next to a dense table. Rebuild this section with the full existing headline above the comparison, constrained to approximately 900px. Remove the icon that steals its width. Set supporting prose beneath it at a smaller measure.

Below, create a full-width, restrained comparison table with the existing four alternatives: Traditional CA relationship, Filing software, Service marketplace, Internet advice. Use existing “Where it helps” and “What it does not own” content, preserving qualifications.

Use approximately 25% / 32% / 43% column proportions, a quiet header row, clear typography, and horizontal rules. Avoid a heavy outside border. This section should read easily, with no aggressive red crosses or invented superiority claims.

On mobile, render each alternative as a stacked entry with explicit field labels. Preserve correct semantics and avoid duplicate visible content or an overflowing desktop table.

### 9. Dark section: one integrated interactive composition

Keep the dark background and existing heading. Rebuild the area so its heading, stage control, explanation, and graphic feel like one unit. Remove large empty bands and any scroll-pinning that demands a viewport of scrolling per small text change. Verify the existing implementation before changing it.

Use normal document scrolling. Make the five stages explicit user-controlled buttons or an accessible tab interface. Do not auto-advance, hijack scrolling, or require the user to cycle through all stages to reach the next section.

Keep the existing stage labels:

1. First income
2. First year
3. Registration becomes relevant
4. Income and obligations grow
5. Structure needs reviewing

Desktop arrangement:

- Heading and supporting line at the top, within an approximately 780px text measure.
- Stage selector 32px below, with a clearly legible active state. Numbers plus text are sufficient; a fine connecting rule is optional and decorative.
- Active content 32–40px below: five-column explanation and seven-column graphic, vertically aligned.
- The existing CTA immediately below the explanation.
- Approximately 72–88px section padding. Aim for roughly 620–760px total desktop height when the content permits, never a fixed-height crop.

Use the existing stage-specific questions and explanations. Do not replace qualified business copy with stronger claims. Keep the stage panel stable enough that switching tabs does not jerk the page position, but do not introduce hundreds of pixels of empty min-height.

#### Original graphic C: an annotated work docket

Replace the white panel that currently repeats “What: First year / Status: MFO tracks.” Build a substantial warm-white document surface with:

- Small header: “ILLUSTRATIVE WORK DOCKET”.
- Stage number, such as “02 / 05”, and the selected stage title.
- A labelled “Your question” field using the actual selected question.
- A ruled “What MFO does” area using a concise excerpt or the full approved stage explanation, whichever fits legibly.
- A lime margin bracket that visually groups the work MFO owns.
- A small footer: “Relevant to your income and setup.”

Reduce duplication: display the question prominently in the left explanation, and use the docket primarily to organise approved work into two or three short action labels. Use the exact mapping below as the first option; inspect the source content to ensure each action is supported. If an action is unsupported, omit it rather than inventing a service:

| Stage | Candidate visual action labels, subject to source support |
| --- | --- |
| First income | Review how you are paid; Identify what needs setup |
| First year | Track relevant dates; Keep the filing calendar |
| Registration becomes relevant | Review registration needs; Explain the next step |
| Income and obligations grow | Revisit the current structure; Review the filing approach |
| Structure needs reviewing | Review the setup; Explain relevant options |

Use action rows with open square markers, not checkmarks implying completed work. This is an explanation of a service, not a live dashboard. Preserve visible illustration labelling. Use the same padding, document rules, markers, and type system as the hero graphic.

On mobile, use a vertical list of five expandable stage items, with the first open by default and one active at a time. Each item reveals its question, explanation, and a compact version of the docket in normal flow. Do not horizontally scroll a five-step desktop timeline with tiny labels. Preserve keyboard access, focus, and expanded state. Respect reduced motion.

### 10. Services: replace the eight-card wall

Keep the heading and all eight services with their existing descriptions. Remove the boxed decorative icon.

Use a four-column introduction area with heading and pricing link, and an eight-column list area. The list area has two columns on desktop, each holding four open entries with a small index, service title, description, and a subtle bottom rule. Keep entries visually tidy without forcing the entire section into identical bordered cards.

Retain these services: Setup & registrations; Income tax; GST & export compliance; Advance tax; Drafts & filing; Notices; Ongoing questions; Income documentation.

Use 18–20px service titles and 16px descriptions. Preserve qualifiers such as “where relevant” and “according to the scope of your engagement.” On mobile, stack the introduction and a single list. Avoid adding an illustration to every service.

### 11. Pricing: make it finished without making up the product

Preserve the displayed annual prices: ₹19,999, ₹24,999, ₹34,999, unless the repository contains a newer authoritative pricing source. Inspect pricing content before implementation.

Keep the heading and explanation together. Present three aligned price columns on a calm paper surface, with clear typographic hierarchy and understated dividers. Use actual plan names, descriptions, and inclusions if available in the source. Place the annual period beside or immediately beneath the amount at a clearly subordinate size.

The screenshots contain “Placeholder — what needs to be included.” Remove this development placeholder from the visible page. Do not fabricate plan distinctions to fill the space.

If genuine plan inclusions are unavailable, use a compact presentation of the three existing annual price points and one shared explanation from the current page: “We tell you which plan fits before you commit.” Keep one shared “Find the right plan” action using the existing working destination. Do not imply the three prices buy the same thing; explain that the applicable price depends on scope using the existing approved copy. Report missing detailed inclusions in the implementation summary.

Do not invent a “Most popular” badge, recommended plan, savings claim, monthly equivalent, or tax treatment. Do not visually favour the middle plan without an existing business reason. Use consistent amounts and clear alignment to create hierarchy.

### 12. FAQ, closing CTA, and footer

FAQ: Use a four-column heading and eight-column accordion area on desktop. Keep existing questions and answers. Rows need comfortable padding, readable text, one consistent expansion icon, and keyboard-operable triggers. On mobile, stack heading and rows. No giant blank region after the final answer.

Closing CTA: Keep the full lime background and existing headline, supporting sentence, and action. Remove the faint, unexplained five-dot line on the right. Make the section a confident typographic conclusion: seven or eight columns for the headline and remaining columns for supporting copy and a dark CTA, vertically centred. On mobile, stack naturally. Approximately 64–80px vertical padding on desktop and 48–56px on mobile. Use the established headline scale; avoid empty space created to accommodate a decorative graphic.

Footer: Retain existing link groups, destinations, brand text, and legal copy. Align it to the same container. Use a compact five-column layout on wide screens and a readable two-column arrangement on mobile. Keep the final brand/legal row separated by a quiet rule. Preserve the existing copyright logic. Do not reproduce browser chrome or development overlays from the screenshots as design elements.

### 13. Graphics implementation and component structure

Deliver the actual graphics as code inside the repository. Prose descriptions or placeholders do not satisfy this brief.

Suggested component responsibilities, adapted to the existing project rather than forcing these exact filenames:

- Payment illustration: semantic payment document + work docket + decorative SVG/CSS backing.
- Income source icon: shared SVG stroke style and four variants.
- Income pattern comparison: deterministic illustrated month groups and visible labels.
- Delayed issue timeline: semantic list with year annotations.
- Obligation stages: accessible controls plus shared active-stage data.
- Work docket: reusable paper surface and supported action rows.
- Shared document rule, marker, section container, and button primitives as warranted.

Use a single stage data source for controls, explanations, graphic labels, and mobile rendering. Keep meaningful text as HTML. Mark purely decorative SVGs aria-hidden; use an accessible name for a meaningful standalone SVG. Ensure all status meaning is also expressed in text.

Use normal layout and relative positioning for illustration bounds. Reserve absolute positioning for contained decorative layers. Avoid magic negative margins that only work at one viewport. Use component-scoped styles or existing tokens; do not solve local layout problems with destructive global overrides.

### 14. Motion and interaction

Polish must work in a static screenshot. Motion is optional and subordinate.

- Buttons and links: restrained 150–200ms colour/border transitions; visible focus.
- Stage switching: at most a short crossfade or 4–8px content movement, approximately 180–240ms. Do not hide content while waiting for animation.
- Hero: optional one-time gentle appearance of the document layers. No continuous floating, cursor tracking, or bouncing money.
- Respect prefers-reduced-motion with a fully static equivalent.
- Avoid layout shifts when fonts load, panels change, or accordions open above an active anchor.

### 15. Execution sequence

Complete these phases in order without pausing for approval between routine design decisions:

1. Inspect the repository, identify the correct page and canonical content, and capture the current desktop and mobile rendering using available project tools.
2. Set the layout/type tokens and implement the header, hero, and complete payment graphic. Verify the wide and narrow composition before propagating styles.
3. Rebuild the income, delayed-problem, and alternatives sections, including the original SVG icons and labelled year comparison.
4. Replace the dark section’s presentation and implement all five accessible stages with the new work docket.
5. Rebuild services, pricing, FAQ, closing CTA, and footer. Resolve visible development placeholders using the constraints above.
6. Run the existing relevant build, type, and lint checks. Exercise actual links, navigation, stage controls, and FAQ interactions.
7. Capture and inspect final screenshots. Fix visible defects. Do not declare completion from passing compilation alone.

Do not add backend systems, payment processing, customer dashboards, or new onboarding flows. Preserve current CTA destinations and tracking. Do not deploy or change production access unless separately requested in the working session.

### 16. Visual acceptance criteria

Inspect at least 1440×900, 1280×800, 768×1024, and 390×844. Also perform a quick overflow check at 320px width. Capture both the initial viewport and full page, plus each dark-section state where content length changes. Browser screenshots, not DOM checks alone, are required for a claim of visual verification.

The implementation is complete when:

- The hero has one coherent composition; its graphic balances the headline and begins alongside it.
- There is no huge unused lower-left area created by a payment panel hanging below the hero copy.
- Original colours and font families are retained; typography has clear, intentional hierarchy.
- Large headings have sensible line breaks at all checked widths; none are compressed by decorative icons.
- Each major section has a clear leading element, and supporting sections feel more compact than the hero and dark chapter.
- Generic outlined cards no longer dominate the page. Supporting lists and tables remain readable and calm.
- Every graphic communicates a specific idea, has readable labels, and is actually implemented.
- The dark section works in normal document flow. All five states are available without compulsory scroll sequences or autoplay.
- Pricing contains no development placeholders or invented commercial claims.
- No text, graphic, tab label, or CTA overlaps or clips. The page has no horizontal overflow at checked widths.
- Mobile graphics reflow rather than becoming unreadably small desktop screenshots.
- Primary actions are visible, consistently styled, and retain their correct destinations.
- Meaningful text contrast and visible keyboard focus are checked. Normal text should meet 4.5:1 contrast; large text and essential UI boundaries should meet applicable 3:1 requirements.
- Navigation, FAQ, and stage controls work with keyboard and touch. Interactive targets are comfortably sized, generally at least 44×44px.
- Reduced-motion presentation is complete and readable.
- Shared-component changes have not broken other existing routes.
- Existing relevant build checks pass, or any pre-existing/unrelated failures are identified precisely.

If browser tooling is unavailable, still implement the complete redesign and run available checks. Explicitly report visual verification as incomplete, naming the missing capability. Do not claim to have inspected screenshots that were never captured.

### 17. Final handoff

Return a concise report containing:

1. What changed visually and structurally.
2. The principal components/files edited and graphics added.
3. The viewports and interactions actually checked, with screenshot locations where available.
4. Build/type/lint results.
5. Any unresolved content dependency, especially unavailable plan inclusions, and any genuine verification limitation.

The required output is a fully implemented redesign in the existing project. Preserve the brand; make the composition, graphics, spacing, and hierarchy feel finished.
