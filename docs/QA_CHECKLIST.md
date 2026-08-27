# QA checklist

## Positioning
- [ ] Site identifies itself as a CA firm in first viewport.
- [ ] Foreign/overseas income is first-class.
- [ ] Broader financial services do not appear before core proposition/pricing.
- [ ] FX, insurance, loans, wealth and MIS are visibly secondary.
- [ ] No “all-in-one financial office” framing.
- [ ] No dummy old-site positioning remains.

## Product
- [ ] Annual prices are exactly ₹19,999 / ₹24,999 / ₹34,999.
- [ ] No plan names or feature mappings were invented.
- [ ] If owner-approved mapping exists, it comes only from `pricing-scope.ts`.
- [ ] Tax/legal claims are reviewed content, not baked into animations.

## Visual
- [ ] Geist only.
- [ ] Paper #F6F7F2.
- [ ] Ink #11130F.
- [ ] Acid #D7FF00.
- [ ] Muted text #6A6E66.
- [ ] 1px rules used for structure.
- [ ] Almost no generic cards.
- [ ] No stock finance imagery.
- [ ] No decorative eyebrows.
- [ ] No gradients/glassmorphism.
- [ ] No generic service icons.

## Motion
- [ ] Hero stops moving after initial choreography.
- [ ] Rules animate once.
- [ ] Income Axis uses normal browser scroll.
- [ ] No scroll-jacking.
- [ ] No bouncy/elastic brand motion.
- [ ] Reduced-motion version is fully readable.
- [ ] No WebGL on mobile.
- [ ] Optional WebGL is lazy and removable.

## Responsive
- [ ] 320px works without page horizontal scroll.
- [ ] Mobile Income Axis is vertical.
- [ ] Pricing stacks cleanly.
- [ ] Vertical rules removed where cramped.
- [ ] Hero object follows copy.

## Accessibility
- [ ] Skip link.
- [ ] One H1.
- [ ] Logical headings.
- [ ] Keyboard navigation.
- [ ] Visible focus.
- [ ] 44x44px project target minimum.
- [ ] Normal text contrast >= 4.5:1.
- [ ] FAQ uses semantic buttons and aria-expanded.
- [ ] 200% zoom.
- [ ] Reduced motion.
- [ ] Form validation associated to fields.

## Performance
- [ ] Geist only.
- [ ] No initial Three.js bundle.
- [ ] No continuous RAF for DOM sections.
- [ ] IntersectionObserver for visibility/state.
- [ ] Media dimensions specified.
- [ ] LCP/CLS/INP profiled on mobile.

## Content
- [ ] No universal tax threshold claims unless reviewed.
- [ ] Foreign-payslip copy does not imply one universal tax treatment.
- [ ] No fear-selling.
- [ ] No “hassle-free / expert CAs / one-stop shop / AI-powered / starting at” boilerplate.
- [ ] “Simple/easy” is not used to trivialise tax rules.

## CTA
- [ ] Primary actions route to /get-started.
- [ ] Lead flow contains four steps.
- [ ] No automatic legal/tax recommendation from unreviewed logic.
- [ ] Success state is implemented.
