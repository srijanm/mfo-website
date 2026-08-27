# MyFinanceOfficer — Final Developer Package

**Version:** Final v4  
**Purpose:** Build the website without referring to design inspiration, the old website, or this conversation.

## What this package is

This is the implementation contract.

The developer should build from these files only.

Do not:
- inspect reference websites for design decisions;
- recreate the existing website's positioning;
- invent tax rules or thresholds;
- treat FX, insurance, loans, wealth planning or MIS as co-equal top-level brand pillars;
- introduce new fonts, colours, card styles, animations or page sections without approval.

## Locked product/positioning hierarchy

### Category
MyFinanceOfficer is presented as a **modern CA firm for people whose income is not being handled by a normal Indian employer-payroll setup**.

### Core relationship
The reason to hire MFO is proactive CA, tax and compliance support:
- setup and registrations;
- income tax;
- GST / export compliance where relevant;
- advance-tax planning/filing where relevant;
- drafts and filing;
- notices;
- ongoing tax/compliance questions;
- documentation that helps prove income.

### Secondary support
The existing broader product capabilities remain real but visually and strategically subordinate:
- FX optimisation;
- insurance optimisation;
- loan optimisation;
- wealth planning;
- MIS.

They appear as **additional financial support when relevant**, not as five equal reasons to hire MFO.

## Commercial values that are locked

Annual price points:
- ₹19,999
- ₹24,999
- ₹34,999

The source material available for this package does **not** establish the exact plan names or which individual inclusions belong to which price point. This package therefore does not fabricate that mapping.

Developer instruction:
- build pricing from `site-content.ts`;
- show all three exact annual prices;
- do not add a per-plan checkbox comparison until the business owner supplies the mapping in `pricing-scope.ts`;
- the homepage and pricing page are designed to remain complete and coherent without that matrix.

This is an owner content input, not a developer research task.

## Canonical design decisions

- Typeface: Geist only
- Background: #F6F7F2
- Primary text: #11130F
- Acid: #D7FF00
- Structural lines: 1px rgba(17,19,15,.16)
- Strong lines: rgba(17,19,15,.34)
- Graphic primitive: line + node
- Cards: only for literal financial/document objects
- Photography: none on homepage
- Signature interaction: Income Axis
- Final CTA: full acid field
- Motion: restrained, system-revealing, no scroll-jacking

## Read order

1. `MASTER_BUILD_SPEC.md`
2. `HOMEPAGE_COPY_AND_CONTENT.md`
3. `SECONDARY_PAGE_SPECS.md`
4. `design-tokens.css`
5. `site-content.ts`
6. `pricing-scope.ts`
7. `motion-tokens.ts`
8. `QA_CHECKLIST.md`

`CODE_AGENT_PROMPT.md` is a condensed brief suitable for a coding agent.
