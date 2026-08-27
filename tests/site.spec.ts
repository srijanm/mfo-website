import { expect, test, type Page } from "@playwright/test";

/** Extend as pages land; every route gets all three checks. */
const ROUTES = ["/", "/get-started", "/styleguide"] as const;

const PAPER = "rgb(246, 247, 242)";

/** Collapses whitespace so two renders can be compared for content, not layout. */
async function visibleText(page: Page): Promise<string> {
  const text = await page.locator("body").innerText();
  return text.replace(/\s+/g, " ").trim();
}

/**
 * (1) The site must work at the narrowest supported viewport with no
 * horizontal scroll on primary content.
 */
test.describe("320px viewport", () => {
  test.use({ viewport: { width: 320, height: 640 } });

  for (const route of ROUTES) {
    test(`${route} has no horizontal scroll at 320px`, async ({ page }) => {
      await page.goto(route);

      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));

      expect(clientWidth).toBe(320);
      // 1px of tolerance for sub-pixel rounding, not for a real overflow.
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
    });
  }
});

/**
 * (2) Reduced motion must not hide anything. globals.css kills transitions with
 * !important, so any section that animates in from opacity: 0 would render
 * blank for these users. This asserts every section is present and visible.
 */
test.describe("prefers-reduced-motion: reduce", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  for (const route of ROUTES) {
    test(`${route} renders every section with reduced motion`, async ({ page }) => {
      await page.goto(route);

      await expect(page.locator("body")).toHaveCSS("background-color", PAPER);

      const sections = page.locator("section");
      const count = await sections.count();

      for (let i = 0; i < count; i += 1) {
        const section = sections.nth(i);
        const id = (await section.getAttribute("id")) ?? `index ${i}`;

        await expect(section, `section ${id} is not visible`).toBeVisible();
        await expect(section, `section ${id} is transparent`).not.toHaveCSS("opacity", "0");

        const text = (await section.innerText()).trim();
        expect(text.length, `section ${id} rendered empty`).toBeGreaterThan(0);
      }
    });
  }
});

/**
 * (3) The site must be complete without client-side JavaScript. Content is
 * compared against the scripted render, so a section that only appears after
 * hydration fails here.
 */
test.describe("JavaScript disabled", () => {
  test.use({ javaScriptEnabled: false });

  for (const route of ROUTES) {
    test(`${route} renders all content without JavaScript`, async ({ page, browser }) => {
      await page.goto(route);
      await expect(page.locator("body")).toHaveCSS("background-color", PAPER);
      const withoutJs = await visibleText(page);

      const scripted = await browser.newContext({ javaScriptEnabled: true });
      const scriptedPage = await scripted.newPage();
      await scriptedPage.goto(`${test.info().project.use.baseURL}${route}`);
      const withJs = await visibleText(scriptedPage);
      await scripted.close();

      expect(withoutJs).toBe(withJs);
    });
  }
});

/**
 * Positioning guard. §20 forbids FX, insurance, loans, wealth planning and MIS
 * from appearing in the core scope section: H08 describes the core CA
 * relationship, and listing Layer B services alongside it is exactly the
 * all-in-one framing the positioning hierarchy rules out.
 *
 * lib/content asserts the same thing at module load, but this catches the case
 * where the copy itself drifts rather than the ids.
 */
test.describe("Layer B never appears in the core scope section", () => {
  const LAYER_B_TERMS = [
    "FX",
    "foreign exchange",
    "insurance",
    "loan",
    "borrowing",
    "wealth",
    "investment",
    "MIS",
  ];

  test("H08 contains Layer A only", async ({ page }) => {
    await page.goto("/");

    const section = page.locator("#core-scope");
    await expect(section).toBeVisible();

    const text = await section.innerText();

    for (const term of LAYER_B_TERMS) {
      expect(
        new RegExp(`\\b${term}\\b`, "i").test(text),
        `"${term}" must not appear in the core scope section`,
      ).toBe(false);
    }

    // The eight core categories are all present.
    expect(await section.locator("h3").count()).toBe(8);
  });
});
