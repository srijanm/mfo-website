import { expect, test, type Page } from "@playwright/test";

/** Extend as pages land; every route gets all three checks. */
const ROUTES = [
  "/",
  "/get-started",
  "/how-it-works",
  "/pricing",
  "/who-its-for",
  "/who-its-for/foreign-income",
  "/who-its-for/freelancers-consultants",
  "/who-its-for/creators",
  "/who-its-for/independent-professionals",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/guides",
  "/guides/how-we-decide-what-you-need",
  "/styleguide",
] as const;

const PAPER = "rgb(246, 247, 242)";

/**
 * All text in the document, regardless of how it is currently presented.
 *
 * Deliberately textContent rather than innerText. The requirement is that no
 * content is *missing* without JavaScript — not that both renders look the
 * same. A sticky crossfade legitimately shows one panel at a time, and a
 * decorative progress strip legitimately appears only once scripted; neither
 * loses information, and both would break an innerText comparison while a
 * genuinely client-only paragraph would still be caught here.
 */
async function documentText(page: Page): Promise<string> {
  const text = await page.locator("body").evaluate((el) => el.textContent ?? "");
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
      const withoutJs = await documentText(page);

      const scripted = await browser.newContext({ javaScriptEnabled: true });
      const scriptedPage = await scripted.newPage();
      await scriptedPage.goto(`${test.info().project.use.baseURL}${route}`);
      const withJs = await documentText(scriptedPage);
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

/**
 * The audience pages. The foreign-income spec is explicit that FX appears only
 * as secondary support, in section 5 — so nothing before that section may name
 * a Layer B service, and the three other audience pages carry none at all.
 */
test.describe("who it's for", () => {
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

  const AUDIENCES = [
    "foreign-income",
    "freelancers-consultants",
    "creators",
    "independent-professionals",
  ];

  test("the hub links to every audience page", async ({ page }) => {
    await page.goto("/who-its-for");

    // Scoped to main: the footer legitimately links to these pages as well.
    for (const slug of AUDIENCES) {
      await expect(page.locator(`main a[href="/who-its-for/${slug}"]`)).toHaveCount(1);
    }
  });

  test("foreign income names no Layer B service before secondary support", async ({ page }) => {
    await page.goto("/who-its-for/foreign-income");

    const sections = page.locator("main > section");
    const total = await sections.count();

    // Secondary support is the section that opens with the approved headline.
    let supportIndex = -1;
    for (let i = 0; i < total; i += 1) {
      if ((await sections.nth(i).innerText()).includes("And when something else comes up")) {
        supportIndex = i;
        break;
      }
    }

    expect(supportIndex, "the additional-support section was not found").toBeGreaterThan(-1);

    for (let i = 0; i < supportIndex; i += 1) {
      const text = await sections.nth(i).innerText();
      for (const term of LAYER_B_TERMS) {
        expect(
          new RegExp(`\\b${term}\\b`, "i").test(text),
          `"${term}" appears in section ${i + 1}, before secondary support`,
        ).toBe(false);
      }
    }
  });

  test("the other audience pages carry no Layer B service at all", async ({ page }) => {
    for (const slug of AUDIENCES.slice(1)) {
      await page.goto(`/who-its-for/${slug}`);
      const text = await page.locator("main").innerText();

      for (const term of LAYER_B_TERMS) {
        expect(
          new RegExp(`\\b${term}\\b`, "i").test(text),
          `"${term}" appears on /who-its-for/${slug}, whose spec does not list it`,
        ).toBe(false);
      }
    }
  });

  test("each audience page has one h1 and its own headline", async ({ page }) => {
    const seen = new Set<string>();

    for (const slug of AUDIENCES) {
      await page.goto(`/who-its-for/${slug}`);
      const headings = page.locator("h1");
      await expect(headings).toHaveCount(1);

      const text = await headings.innerText();
      expect(seen.has(text), `${slug} repeats another audience's headline`).toBe(false);
      seen.add(text);
    }
  });
});

/**
 * Every link in the header and footer must resolve. A dead link in the footer
 * is the kind of thing that survives to launch because nothing tests it.
 */
test.describe("navigation", () => {
  test("no header or footer link 404s", async ({ page, request }) => {
    await page.goto("/");

    const hrefs = await page.evaluate(() =>
      [...document.querySelectorAll("header a, footer a")]
        .map((a) => a.getAttribute("href"))
        .filter((href): href is string => !!href && href.startsWith("/")),
    );

    expect(hrefs.length).toBeGreaterThan(10);

    for (const href of [...new Set(hrefs)]) {
      const response = await request.get(href);
      expect(response.status(), `${href} returned ${response.status()}`).toBe(200);
    }
  });
});

/** No stock photography anywhere; real team images only, on /about. */
test.describe("about", () => {
  test("ships no photography and states where it will go", async ({ page }) => {
    await page.goto("/about");

    await expect(page.locator("main img")).toHaveCount(0);
    await expect(
      page.getByText("The named professionals responsible for the work"),
    ).toBeVisible();
  });
});

/**
 * Guides. A placeholder is written to show the shape of the library, not to
 * answer anything, so it must be impossible to mistake for reviewed guidance:
 * excluded from the index in production, noindex on the page, and carrying a
 * notice before anything else in the document.
 */
test.describe("guides", () => {
  const PLACEHOLDERS = [
    "how-we-decide-what-you-need",
    "what-running-the-calendar-means",
    "what-a-draft-before-filing-looks-like",
  ];

  test("the production index lists no placeholder", async ({ page }) => {
    await page.goto("/guides");

    // Tests run against a production build, which is where the rule applies.
    for (const slug of PLACEHOLDERS) {
      await expect(page.locator(`a[href="/guides/${slug}"]`)).toHaveCount(0);
    }

    await expect(page.getByText("The first guides are being written")).toBeVisible();
  });

  test("every placeholder is marked and not indexed", async ({ page }) => {
    for (const slug of PLACEHOLDERS) {
      await page.goto(`/guides/${slug}`);

      const robots = page.locator('meta[name="robots"]');
      await expect(robots).toHaveAttribute("content", /noindex/);

      // The notice precedes the headline in the document, not just on screen.
      const noticeFirst = await page.evaluate(() => {
        const article = document.querySelector("article");
        const notice = [...article!.querySelectorAll("p")].find((p) =>
          p.textContent?.trim() === "Placeholder",
        );
        const h1 = article!.querySelector("h1");
        if (!notice || !h1) return false;
        return notice.compareDocumentPosition(h1) & Node.DOCUMENT_POSITION_FOLLOWING;
      });

      expect(noticeFirst, `${slug} does not lead with the placeholder notice`).toBeTruthy();
      await expect(page.getByText("This is not reviewed guidance")).toBeVisible();
    }
  });

  test("articles hold the specified reading measure", async ({ page }) => {
    await page.goto(`/guides/${PLACEHOLDERS[0]}`);

    const width = await page
      .locator("article")
      .evaluate((el) => el.getBoundingClientRect().width);

    expect(width).toBeGreaterThanOrEqual(720);
    expect(width).toBeLessThanOrEqual(780);
  });

  test("a table of contents appears only where a guide is long enough", async ({ page }) => {
    // Five sections: long enough.
    await page.goto(`/guides/${PLACEHOLDERS[0]}`);
    await expect(page.getByRole("navigation", { name: "On this page" })).toBeVisible();

    const links = page.getByRole("navigation", { name: "On this page" }).locator("a");
    const count = await links.count();
    expect(count).toBe(await page.locator("article h2").count());

    // Each entry reaches a real anchor.
    for (let i = 0; i < count; i += 1) {
      const href = await links.nth(i).getAttribute("href");
      await expect(page.locator(href!)).toHaveCount(1);
    }
  });
});

/**
 * Metadata. The risk here is silent drift: a page shipping a title but no
 * canonical, or a noindex page turning up in the sitemap. Both are invisible
 * in a browser, so they are asserted instead.
 */
test.describe("metadata", () => {
  const INDEXED = [
    "/",
    "/how-it-works",
    "/who-its-for",
    "/who-its-for/foreign-income",
    "/pricing",
    "/guides",
    "/about",
    "/contact",
  ];

  const NOT_INDEXED = [
    "/get-started",
    "/privacy",
    "/terms",
    "/styleguide",
    "/guides/how-we-decide-what-you-need",
  ];

  test("every indexed page carries a title, description, canonical and social tags", async ({
    page,
  }) => {
    for (const route of INDEXED) {
      await page.goto(route);

      const meta = await page.evaluate(() => ({
        title: document.title,
        description: document
          .querySelector('meta[name="description"]')
          ?.getAttribute("content"),
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href"),
        ogTitle: document
          .querySelector('meta[property="og:title"]')
          ?.getAttribute("content"),
        ogDescription: document
          .querySelector('meta[property="og:description"]')
          ?.getAttribute("content"),
        ogImage: document
          .querySelector('meta[property="og:image"]')
          ?.getAttribute("content"),
        twitterCard: document
          .querySelector('meta[name="twitter:card"]')
          ?.getAttribute("content"),
        robots: document.querySelector('meta[name="robots"]')?.getAttribute("content"),
      }));

      expect(meta.title, `${route} has no title`).toBeTruthy();
      expect(meta.description, `${route} has no description`).toBeTruthy();
      expect(meta.canonical, `${route} has no canonical`).toBeTruthy();
      expect(meta.canonical, `${route} canonical is not absolute`).toMatch(/^https?:\/\//);
      expect(meta.ogTitle, `${route} has no og:title`).toBeTruthy();
      expect(meta.ogDescription, `${route} has no og:description`).toBeTruthy();
      expect(meta.ogImage, `${route} has no og:image`).toBeTruthy();
      expect(meta.twitterCard, `${route} has no twitter:card`).toBe("summary_large_image");
      expect(meta.robots ?? "", `${route} should be indexable`).not.toContain("noindex");
    }
  });

  test("pages that should not be indexed say so", async ({ page }) => {
    for (const route of NOT_INDEXED) {
      await page.goto(route);
      const robots = await page
        .locator('meta[name="robots"]')
        .getAttribute("content");
      expect(robots ?? "", `${route} is missing noindex`).toContain("noindex");
    }
  });

  test("the sitemap lists the indexed pages and nothing that is not", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);

    const xml = await response.text();
    const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) =>
      new URL(match[1]).pathname,
    );

    for (const route of INDEXED) {
      expect(paths, `${route} is missing from the sitemap`).toContain(route);
    }

    for (const route of NOT_INDEXED) {
      expect(paths, `${route} must not be in the sitemap`).not.toContain(route);
    }
  });

  test("robots.txt closes preview and local builds to crawlers", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);

    // Tests never run against a production deployment.
    expect(await response.text()).toContain("Disallow: /");
  });

  test("the share image renders in the site's own language", async ({ request }) => {
    const response = await request.get("/opengraph-image");

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");
    expect((await response.body()).byteLength).toBeGreaterThan(1000);
  });
});

/**
 * Motion.
 *
 * The failure this guards against is silent: globals.css kills transitions
 * under reduced motion with !important, so anything left at opacity 0 renders
 * blank rather than un-animated. Same for anyone without JavaScript, where no
 * observer ever runs. Both are asserted, on every route that animates.
 */
test.describe("motion", () => {
  const ROUTES = ["/", "/how-it-works", "/pricing", "/who-its-for/foreign-income", "/about"];

  /** Text hidden inside a collapsed disclosure is meant to be hidden. */
  const hiddenTextOutsideDisclosures = async (page: import("@playwright/test").Page) =>
    page.evaluate(() => {
      const collapsed = new Set<Element>();
      for (const button of document.querySelectorAll('button[aria-expanded="false"]')) {
        const panel = document.getElementById(button.getAttribute("aria-controls") ?? "");
        if (panel) collapsed.add(panel);
      }

      const hidden: string[] = [];
      for (const el of document.querySelectorAll("main *")) {
        const style = getComputedStyle(el);
        const ownsText = [...el.childNodes].some(
          (node) => node.nodeType === 3 && node.textContent?.trim(),
        );
        if (!ownsText) continue;
        if (style.opacity !== "0" && style.visibility !== "hidden") continue;
        if ([...collapsed].some((panel) => panel.contains(el))) continue;
        hidden.push(`${el.tagName}.${String(el.className).slice(0, 40)}`);
      }
      return hidden;
    });

  /** Section 0 is the page hero, which carries no top rule by design. */
  const sectionsMissingRule = async (page: import("@playwright/test").Page) =>
    page.evaluate(() =>
      [...document.querySelectorAll("main > section")]
        .slice(1)
        .filter((section) => {
          const style = getComputedStyle(section);
          const pseudo = getComputedStyle(section, "::before");
          const border =
            parseFloat(style.borderTopWidth) > 0 &&
            style.borderTopColor !== "rgba(0, 0, 0, 0)";
          const drawn =
            pseudo.content !== "none" && pseudo.transform !== "matrix(0, 0, 0, 1, 0, 0)";
          return !(border || drawn);
        })
        .map((section) => section.querySelector("h2")?.textContent?.trim().slice(0, 40) ?? "?"),
    );

  test.describe("with reduced motion", () => {
    test.use({ contextOptions: { reducedMotion: "reduce" } });

    for (const route of ROUTES) {
      test(`${route} shows everything and draws every rule`, async ({ page }) => {
        await page.goto(route);
        expect(await hiddenTextOutsideDisclosures(page)).toEqual([]);
        expect(await sectionsMissingRule(page)).toEqual([]);
      });
    }
  });

  test.describe("without JavaScript", () => {
    test.use({ javaScriptEnabled: false });

    for (const route of ROUTES) {
      test(`${route} shows everything and draws every rule`, async ({ page }) => {
        await page.goto(route);
        expect(await hiddenTextOutsideDisclosures(page)).toEqual([]);
        expect(await sectionsMissingRule(page)).toEqual([]);
      });
    }
  });

  test("a revealed section never hides again on scroll back", async ({ page }) => {
    await page.goto("/");

    const pricing = page.locator("#pricing");
    await pricing.scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);

    const afterReveal = await pricing.evaluate(
      (el) => getComputedStyle(el, "::before").transform,
    );

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    await pricing.scrollIntoViewIfNeeded();

    const afterReturn = await pricing.evaluate(
      (el) => getComputedStyle(el, "::before").transform,
    );

    expect(afterReveal).toBe(afterReturn);
    expect(afterReveal).not.toBe("matrix(0, 0, 0, 1, 0, 0)");
  });

  test("the hero settles and then stops", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(1600);

    const stillMoving = await page.evaluate(() =>
      document
        .querySelectorAll("main > section:first-child *")
        .length > 0 &&
      [...document.querySelectorAll("main > section:first-child *")].some(
        (el) => el.getAnimations().some((animation) => animation.playState === "running"),
      ),
    );

    expect(stillMoving).toBe(false);
  });

  test("the FAQ opens within the specified window", async ({ page }) => {
    await page.goto("/");

    const trigger = page.locator("main button[aria-expanded]").first();
    await trigger.scrollIntoViewIfNeeded();

    const panelId = await trigger.getAttribute("aria-controls");
    const duration = await page.evaluate((id) => {
      const panel = document.getElementById(id!);
      return getComputedStyle(panel!).transitionDuration;
    }, panelId);

    const ms = duration
      .split(",")
      .map((value) => parseFloat(value) * 1000)
      .filter((value) => value > 0);

    expect(Math.max(...ms)).toBeGreaterThanOrEqual(180);
    expect(Math.max(...ms)).toBeLessThanOrEqual(240);
  });
});

/**
 * The Income Axis.
 *
 * The sticky composition is an enhancement layered on one copy of the content.
 * What is asserted here is that the enhancement behaves, and — more
 * importantly — that every route out of it lands on the static vertical
 * progression with nothing hidden.
 */
test.describe("income axis", () => {
  const axisSection = (page: import("@playwright/test").Page) =>
    page.locator("main > section").filter({ has: page.locator("#income-axis") });

  test.describe("desktop, scripted", () => {
    test("scrolls normally through a sticky panel and never takes focus", async ({ page }) => {
      await page.goto("/");
      const section = axisSection(page);
      const box = (await section.boundingBox())!;

      const geometry = await section.evaluate((el) => {
        const panel = el.querySelector('[class*="panel"]')!;
        const scroller = el.querySelector('[class*="scroller"]')!;
        const style = getComputedStyle(panel);
        return {
          scrollLength: scroller.getBoundingClientRect().height / window.innerHeight,
          position: style.position,
          top: style.top,
        };
      });

      // §17: approximately 300–340vh.
      expect(geometry.scrollLength).toBeGreaterThanOrEqual(3);
      expect(geometry.scrollLength).toBeLessThanOrEqual(3.4);
      expect(geometry.position).toBe("sticky");
      expect(geometry.top).toBe("64px");

      // Focus is never moved by scrolling.
      await page.keyboard.press("Tab");
      const before = await page.evaluate(() => document.activeElement?.textContent);
      await page.evaluate((y) => window.scrollTo(0, y), box.y + box.height / 2);
      await page.waitForTimeout(400);
      const after = await page.evaluate(() => document.activeElement?.textContent);
      expect(after).toBe(before);
    });

    test("the active milestone advances through the section", async ({ page }) => {
      await page.goto("/");
      const box = (await axisSection(page).boundingBox())!;

      /* Read the state, not the paint: a colour sampled during the fill
         transition is a transient value and makes this flaky. */
      const activeIndex = () =>
        page.evaluate(() => {
          const nodes = [...document.querySelectorAll('[class*="axisNode"]')];
          return nodes.findIndex((node) =>
            /axisNodeActive/.test(String(node.className)),
          );
        });

      await page.evaluate((y) => window.scrollTo(0, y), box.y + 40);
      await page.waitForTimeout(200);
      const first = await activeIndex();

      /* Sampled well inside the section. The observer's root is the viewport
         midline, which sits half a screen below the scroll position, so past
         roughly 0.84 of the section it has already cleared the last sentinel
         and nothing fires — the reading would be stale rather than wrong. */
      await page.evaluate((y) => window.scrollTo(0, y), box.y + box.height * 0.7);
      await page.waitForTimeout(200);
      const last = await activeIndex();

      expect(first).toBe(0);
      expect(last).toBeGreaterThan(first);
    });

    test("uses the motion-token values and never loops", async ({ page }) => {
      await page.goto("/");
      const box = (await axisSection(page).boundingBox())!;
      await page.evaluate((y) => window.scrollTo(0, y), box.y + box.height * 0.45);
      await page.waitForTimeout(700);

      const motion = await axisSection(page).evaluate((el) => {
        const active = [...el.querySelectorAll('[class*="axisNode"]')].find((node) =>
          /axisNodeActive/.test(String(node.className)),
        )!;
        const dot = getComputedStyle(active.querySelector('span[class*="dot"]')!);
        const looping = [...el.querySelectorAll("*")].filter(
          (node) => getComputedStyle(node).animationIterationCount === "infinite",
        ).length;
        return {
          transform: dot.transform,
          fill: dot.backgroundColor,
          pulseDuration: dot.animationDuration,
          pulseCount: dot.animationIterationCount,
          looping,
        };
      });

      // motion-tokens: activeNodeScale 1.18, nodePulse 0.42s, one iteration.
      expect(motion.transform).toBe("matrix(1.18, 0, 0, 1.18, 0, 0)");
      // Settled, so the fill has finished interpolating.
      expect(motion.fill).toBe("rgb(215, 255, 0)");
      expect(motion.pulseDuration).toBe("0.42s");
      expect(motion.pulseCount).toBe("1");
      expect(motion.looping).toBe(0);
    });
  });

  /** Every fallback lands on the static vertical progression. */
  const expectsStaticFallback = (label: string) => {
    test(`${label} falls back to the static vertical progression`, async ({ page }) => {
      await page.goto("/");

      const state = await axisSection(page).evaluate((el) => {
        const panel = el.querySelector('[class*="panel"]')!;
        const milestones = [...el.querySelectorAll("li")];
        return {
          position: getComputedStyle(panel).position,
          total: milestones.length,
          hidden: milestones.filter((item) => {
            const style = getComputedStyle(item);
            return style.opacity === "0" || style.visibility === "hidden";
          }).length,
        };
      });

      expect(state.position).toBe("static");
      expect(state.total).toBe(5);
      expect(state.hidden).toBe(0);
    });
  };

  test.describe("with reduced motion", () => {
    test.use({ contextOptions: { reducedMotion: "reduce" } });
    expectsStaticFallback("reduced motion");
  });

  test.describe("on mobile", () => {
    test.use({ viewport: { width: 375, height: 800 } });
    expectsStaticFallback("mobile");
  });

  test.describe("without JavaScript", () => {
    test.use({ javaScriptEnabled: false });
    expectsStaticFallback("no JavaScript");
  });
});

/**
 * Design-system and accessibility measurements.
 *
 * These are computed from the rendered page rather than asserted about the
 * source, because every one of them has already been broken once by a rule
 * that looked right in a stylesheet — a heading class that was referenced but
 * never defined, a form control that does not inherit its font, a nav link
 * four pixels short of the target minimum.
 */
test.describe("measured", () => {
  const ROUTES = [
    "/", "/how-it-works", "/pricing", "/who-its-for/foreign-income",
    "/about", "/get-started", "/guides/how-we-decide-what-you-need",
  ];

  test("only Geist, and no weight above 600", async ({ page }) => {
    for (const route of ROUTES) {
      await page.goto(route);

      const type = await page.evaluate(() => {
        const fonts = new Set<string>();
        const heavy: string[] = [];
        for (const el of document.querySelectorAll("body *")) {
          const style = getComputedStyle(el);
          fonts.add(style.fontFamily.split(",")[0].replace(/["']/g, ""));
          const ownsText = [...el.childNodes].some(
            (node) => node.nodeType === 3 && node.textContent?.trim(),
          );
          if (ownsText && parseInt(style.fontWeight, 10) > 600) {
            heavy.push(`${el.tagName} ${style.fontWeight} "${el.textContent?.trim().slice(0, 30)}"`);
          }
        }
        return { fonts: [...fonts], heavy };
      });

      expect(type.fonts, `${route} uses a font other than Geist`).toEqual(["Geist"]);
      expect(type.heavy, `${route} renders text above weight 600`).toEqual([]);
    }
  });

  test("every interaction target clears 44px", async ({ page }) => {
    for (const route of ROUTES) {
      await page.goto(route);

      const small = await page.evaluate(() =>
        [...document.querySelectorAll("a[href], button, input, select, textarea")]
          .filter((el) => {
            const style = getComputedStyle(el);
            if (style.display === "none" || style.visibility === "hidden") return false;
            const box = el.getBoundingClientRect();
            if (box.width === 0 && box.height === 0) return false;
            return box.width < 44 || box.height < 44;
          })
          .map((el) => {
            const box = el.getBoundingClientRect();
            return `${el.tagName} ${Math.round(box.width)}x${Math.round(box.height)} "${(el.textContent ?? "").trim().slice(0, 24)}"`;
          }),
      );

      expect(small, `${route} has targets under 44px`).toEqual([]);
    }
  });

  test("normal text meets 4.5:1 and large text 3:1", async ({ page }) => {
    for (const route of ROUTES) {
      await page.goto(route);

      const failures = await page.evaluate(() => {
        const channel = (c: number) => {
          const v = c / 255;
          return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
        };
        const luminance = ([r, g, b]: number[]) =>
          0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
        const parse = (value: string) =>
          (value.match(/[\d.]+/g) ?? []).slice(0, 4).map(Number);
        const backdrop = (el: Element): number[] => {
          let node: Element | null = el;
          while (node && node !== document.documentElement) {
            const c = parse(getComputedStyle(node).backgroundColor);
            if (c.length >= 3 && (c[3] === undefined || c[3] > 0)) return c.slice(0, 3);
            node = node.parentElement;
          }
          return [246, 247, 242];
        };

        const out: string[] = [];
        for (const el of document.querySelectorAll("body *")) {
          const ownsText = [...el.childNodes].some(
            (node) => node.nodeType === 3 && node.textContent?.trim(),
          );
          if (!ownsText) continue;

          const style = getComputedStyle(el);
          if (style.visibility === "hidden" || style.opacity === "0") continue;

          const size = parseFloat(style.fontSize);
          const weight = parseInt(style.fontWeight, 10) || 400;
          const large = size >= 24 || (size >= 18.66 && weight >= 700);
          const fg = parse(style.color).slice(0, 3);
          const bg = backdrop(el);
          const a = luminance(fg);
          const b = luminance(bg);
          const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
          const required = large ? 3 : 4.5;

          if (ratio + 0.01 < required) {
            out.push(`${el.tagName} ${ratio.toFixed(2)}:1 (needs ${required}) "${el.textContent?.trim().slice(0, 30)}"`);
          }
        }
        return out;
      });

      expect(failures, `${route} has text below the contrast minimum`).toEqual([]);
    }
  });
});

/**
 * The rule system.
 *
 * Two structural invariants, checked on the rendered page rather than in the
 * stylesheets, because what matters is where a rule actually lands — not how
 * its CSS was authored.
 */
test.describe("rule system", () => {
  const VIEWPORTS = [
    { name: "desktop", width: 1440, height: 900 },
    { name: "tablet", width: 900, height: 900 },
    { name: "mobile", width: 390, height: 800 },
  ] as const;

  /**
   * A cell border with a gap beside it terminates in empty space. So a grid
   * with a non-zero gap may carry at most one bordered child, and that child
   * must span the whole row — anything else puts a rule next to a gap.
   *
   * Form controls are exempt: their border is a control affordance. So is any
   * bordered box with a corner radius, because a rule has no radius — that is
   * a literal record surface or a button, not a line.
   */
  const gapsBesideRules = (page: Page) =>
    page.evaluate(() => {
      const px = (value: string) => parseFloat(value) || 0;
      /* Fully transparent only. Matching on the string would read rgb(0, 0, 0)
         as transparent, because it also ends in ", 0)". */
      const invisible = (colour: string) => {
        const parts = (colour.match(/[\d.]+/g) ?? []).map(Number);
        return parts.length > 3 && parts[3] === 0;
      };
      const CONTROL = /^(INPUT|TEXTAREA|SELECT|BUTTON)$/;
      const SIDES = ["Top", "Right", "Bottom", "Left"] as const;
      const CORNERS = [
        "borderTopLeftRadius",
        "borderTopRightRadius",
        "borderBottomLeftRadius",
        "borderBottomRightRadius",
      ] as const;

      const name = (el: Element) =>
        `${el.tagName.toLowerCase()}${el.className ? `.${String(el.className).trim().split(/\s+/).join(".")}` : ""}`;

      const found: string[] = [];

      for (const grid of document.querySelectorAll("body *")) {
        const style = getComputedStyle(grid);
        if (style.display !== "grid" && style.display !== "inline-grid") continue;

        const gap = Math.max(px(style.columnGap), px(style.rowGap));
        if (gap === 0) continue;

        const bordered = [...grid.children].filter((child) => {
          const cs = getComputedStyle(child);
          if (cs.display === "contents" || cs.display === "none") return false;
          if (CONTROL.test(child.tagName)) return false;
          if (CORNERS.some((corner) => px(cs[corner]) > 0)) return false;
          return SIDES.some(
            (side) =>
              px(cs[`border${side}Width` as const]) > 0 &&
              cs[`border${side}Style` as const] !== "none" &&
              !invisible(cs[`border${side}Color` as const]),
          );
        });

        if (bordered.length === 0) continue;

        const row =
          grid.clientWidth - px(style.paddingLeft) - px(style.paddingRight);
        const fills =
          bordered.length === 1 &&
          Math.abs(bordered[0].getBoundingClientRect().width - row) <= 1;

        if (!fills) {
          found.push(
            `${name(grid)} gap ${gap}px — bordered: ${bordered.map(name).join(", ")}`,
          );
        }
      }

      return found;
    });

  /**
   * Section dividers are drawn on the container's own edges, so a section rule
   * and the rules inside it are the same width and can meet.
   */
  const misalignedSectionRules = (page: Page) =>
    page.evaluate(() => {
      const px = (value: string) => parseFloat(value) || 0;
      const wrong: string[] = [];

      for (const box of document.querySelectorAll(
        "section.section, footer.container-rule",
      )) {
        const container = box.querySelector(".container");
        if (!container) continue;

        const cs = getComputedStyle(container);
        const inner =
          container.clientWidth - px(cs.paddingLeft) - px(cs.paddingRight);
        const rule = px(getComputedStyle(box, "::before").width);

        if (Math.abs(rule - inner) > 1) {
          wrong.push(
            `${box.tagName.toLowerCase()} rule ${Math.round(rule)}px vs container ${Math.round(inner)}px`,
          );
        }
      }

      return wrong;
    });

  for (const viewport of VIEWPORTS) {
    test.describe(viewport.name, () => {
      test.use({ viewport: { width: viewport.width, height: viewport.height } });

      for (const route of ROUTES) {
        test(`${route} has no rule floating beside a grid gap`, async ({ page }) => {
          await page.goto(route);
          expect(await gapsBesideRules(page)).toEqual([]);
        });
      }

      test("every section rule spans exactly the container", async ({ page }) => {
        for (const route of ROUTES) {
          await page.goto(route);
          expect(await misalignedSectionRules(page), route).toEqual([]);
        }
      });
    });
  }
});
