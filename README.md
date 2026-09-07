# MyFinanceOfficer website

Marketing site for a modern CA firm serving people whose income is not handled
by a normal Indian employer-payroll setup.

Copy and content data live in `lib/content/`. The source copy the homepage was
written from is in `content-source/`.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run test:e2e` | Playwright checks against a production build |
| `npm run check` | lint → typecheck. Run before committing. |

## Tests

`tests/site.spec.ts` runs every route in `ROUTES` through three checks: no
horizontal scroll at 320px, nothing hidden under `prefers-reduced-motion`, and
identical content with JavaScript disabled. Add new routes to that array.
