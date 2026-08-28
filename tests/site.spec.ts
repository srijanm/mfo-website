import { expect, test, type Page } from "@playwright/test";

/** Extend as pages land; every route gets all three checks. */
const ROUTES = [
  "/",
  "/get-started",
  "/who-its-for",
  "/who-its-for/foreign-income",
  "/who-its-for/freelancers-consultants",
  "/who-its-for/creators",
  "/who-its-for/independent-professionals",
  "/styleguide",
] as const;

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

/**
 * The homepage argument depends on its order. §12 locks it, and the order is
 * load-bearing: the whole core CA relationship has to land before any mention
 * of broader financial services, or the positioning collapses into the
 * everything-office framing the hierarchy exists to prevent.
 */
test.describe("homepage architecture", () => {
  const LOCKED_ORDER = [
    "Half the work you do",           // 1. Hero
    "Different jobs. Same problem",   // 2. Recognition
    "Nothing goes wrong in your first year",  // 3. Latent problem
    "Your work changed",              // 4. Structural mismatch
    "Your obligations change",        // 5. Income Axis
    "You shouldn’t have to know which question to ask",  // 6. Operating model
    "Your work has deadlines",        // 7. Managed calendar
    "The CA and compliance work we are built to run",    // 8. Core scope
    "Judge us by what happens before we file anything",  // 9. Trust ledger
    "The price is on the site before we speak",          // 10. Pricing
    "And when something else comes up",                  // 11. Additional support
    "I don’t earn enough for this yet",                  // 12. FAQ
    "Tell us how you earn",                              // 13. Final CTA
  ];

  test("sections appear in the order locked by section 12", async ({ page }) => {
    await page.goto("/");

    const body = (await page.locator("body").innerText()).replace(/\s+/g, " ");

    let cursor = -1;
    for (const marker of LOCKED_ORDER) {
      const at = body.indexOf(marker.replace(/\s+/g, " "));
      expect(at, `"${marker}" was not found on the page`).toBeGreaterThan(-1);
      expect(at, `"${marker}" appears out of order`).toBeGreaterThan(cursor);
      cursor = at;
    }

    // The footer closes the page.
    await expect(page.locator("footer")).toBeVisible();
  });

  test("no Layer B service appears before pricing", async ({ page }) => {
    await page.goto("/");

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

    const sections = page.locator("main > section");
    const total = await sections.count();

    let pricingIndex = -1;
    for (let i = 0; i < total; i += 1) {
      if ((await sections.nth(i).getAttribute("id")) === "pricing") {
        pricingIndex = i;
        break;
      }
    }

    expect(pricingIndex, "the pricing section was not found").toBeGreaterThan(-1);

    for (let i = 0; i < pricingIndex; i += 1) {
      const text = await sections.nth(i).innerText();
      for (const term of LAYER_B_TERMS) {
        expect(
          new RegExp(`\\b${term}\\b`, "i").test(text),
          `"${term}" appears in section ${i + 1}, before pricing`,
        ).toBe(false);
      }
    }
  });
});

/** §24 sets the accordion's minimum row heights. */
test.describe("FAQ", () => {
  test("triggers meet the minimum row height and expose state", async ({ page }) => {
    await page.goto("/");

    const triggers = page.locator("main button[aria-expanded]");
    expect(await triggers.count()).toBe(7);

    for (let i = 0; i < 7; i += 1) {
      const box = await triggers.nth(i).boundingBox();
      expect(box!.height, `FAQ row ${i + 1} is under 64px`).toBeGreaterThanOrEqual(64);
    }

    const first = triggers.first();
    await expect(first).toHaveAttribute("aria-expanded", "false");
    await first.click();
    await expect(first).toHaveAttribute("aria-expanded", "true");
  });
});

/**
 * §25 requires the final CTA to sit on a full acid field with an ink button and
 * paper text. This regressed once already: `.button-primary` is global and the
 * reversed variant was a module class at equal specificity, so the winner was
 * decided by stylesheet order rather than intent.
 */
test.describe("final CTA", () => {
  const ACID = "rgb(215, 255, 0)";
  const INK = "rgb(17, 19, 15)";
  const PAPER = "rgb(246, 247, 242)";

  test("sits on acid with a reversed ink button", async ({ page }) => {
    await page.goto("/");

    const section = page.locator("main > section").last();
    await expect(section).toHaveCSS("background-color", ACID);

    const button = section.locator("a").first();
    await expect(button).toHaveCSS("background-color", INK);
    await expect(button).toHaveCSS("color", PAPER);
    await expect(button).toHaveAttribute("href", "/get-started");
  });
});

/**
 * The intake. §27 fixes the four steps; the spec also requires that nothing
 * personal is persisted client-side and that a failed send never reads as a
 * success.
 */
test.describe("get-started intake", () => {
  /* Click the label, the way a person does: the radio itself is visually
     hidden behind the styled marker. */
  const pick = async (page: import("@playwright/test").Page, option: string) => {
    await page
      .locator("label")
      .filter({ hasText: new RegExp(`^${option.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")}$`) })
      .click();
  };

  const choose = async (page: import("@playwright/test").Page, option: string) => {
    await pick(page, option);
    await page.getByRole("button", { name: "Continue" }).click();
  };

  test("walks four steps, remembers answers and steps back", async ({ page }) => {
    await page.goto("/get-started");

    await expect(page.getByText("Step 1 of 4")).toBeVisible();
    await expect(page.getByRole("heading", { name: "How are you paid?" })).toBeVisible();

    await choose(page, "An overseas company");
    await expect(page.getByText("Step 2 of 4")).toBeVisible();

    await choose(page, "First year");
    await choose(page, "Foreign income");

    await expect(page.getByText("Step 4 of 4")).toBeVisible();
    await expect(page.getByLabel("Name")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Phone")).toBeVisible();

    // Back returns to the previous question with the answer still selected.
    await page.getByRole("button", { name: "Back" }).click();
    await expect(page.getByText("Step 3 of 4")).toBeVisible();
    await expect(page.getByRole("radio", { name: "Foreign income" })).toBeChecked();
  });

  test("continuing without a choice reports an error tied to the field", async ({ page }) => {
    await page.goto("/get-started");
    await page.getByRole("button", { name: "Continue" }).click();

    // Scoped to the form: Next renders its own route announcer with role=alert.
    const error = page.locator("form").getByRole("alert");
    await expect(error).toBeVisible();

    // The error is announced with the group, not left floating.
    const describedBy = await page.locator("fieldset").getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    expect(await page.locator(`#${describedBy}`).innerText()).toBe(await error.innerText());
  });

  test("persists nothing client-side", async ({ page }) => {
    await page.goto("/get-started");
    await choose(page, "Indian clients");
    await expect(page.getByText("Step 2 of 4")).toBeVisible();

    const stored = await page.evaluate(() => ({
      local: { ...localStorage },
      session: { ...sessionStorage },
      cookie: document.cookie,
    }));

    expect(Object.keys(stored.local)).toHaveLength(0);
    expect(Object.keys(stored.session)).toHaveLength(0);
    expect(stored.cookie).toBe("");
  });

  test("a failed send never shows the success state", async ({ page }) => {
    await page.goto("/get-started");

    await choose(page, "Both");
    await choose(page, "Not sure");
    await choose(page, "Getting set up");

    await page.getByLabel("Name").fill("Test Person");
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Phone").fill("9999999999");

    // The route has no delivery credentials in CI, so this send fails.
    await page.route("**/api/leads", (route) =>
      route.fulfill({ status: 502, contentType: "application/json", body: JSON.stringify({ ok: false, errors: { form: "Provider responded 500." } }) }),
    );

    await page.getByRole("button", { name: "Send" }).click();

    await expect(page.getByText("That did not send.")).toBeVisible();
    await expect(page.getByText("Got it. We’ll review how you earn")).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Get in touch" })).toBeVisible();
  });

  test("shows the success state only when the send succeeds", async ({ page }) => {
    await page.goto("/get-started");

    await choose(page, "Both");
    await choose(page, "Not sure");
    await choose(page, "Getting set up");

    await page.getByLabel("Name").fill("Test Person");
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Phone").fill("9999999999");

    await page.route("**/api/leads", (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) }),
    );

    await page.getByRole("button", { name: "Send" }).click();

    await expect(
      page.getByText("Got it. We’ll review how you earn and tell you what makes sense from here."),
    ).toBeVisible();
  });
});
