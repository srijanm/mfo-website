# MyFinanceOfficer website

Marketing site for a modern CA firm serving people whose income is not handled
by a normal Indian employer-payroll setup.

`CLAUDE.md` is the build contract. `docs/` is the implementation package and is
the only source for layout, copy, tokens and content data. Build from those
files — not from reference sites.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run guardrails` | Scans `app/ components/ lib/` for design and copy violations |
| `npm run test:e2e` | Playwright checks against a production build |
| `npm run check` | guardrails → lint → typecheck → Playwright. Run before committing. |

## Guardrails

`scripts/guardrails.mjs` fails the build on anything CLAUDE.md forbids that a
linter can see: content shadows, gradients, radius above 6px, font weights above
600, hex values outside the locked palette, rupee amounts outside `lib/content/`,
and the banned phrases in rule 6. Violations print as `file:line`.

## Tests

`tests/site.spec.ts` runs every route in `ROUTES` through three checks: no
horizontal scroll at 320px, nothing hidden under `prefers-reduced-motion`, and
identical content with JavaScript disabled. Add new routes to that array.
