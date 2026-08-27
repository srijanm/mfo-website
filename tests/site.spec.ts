import { expect, test, type Page } from "@playwright/test";

/** Extend as pages land; every route gets all three checks. */
const ROUTES = ["/"] as const;

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
