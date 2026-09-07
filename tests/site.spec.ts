import { expect, test, type Page } from "@playwright/test";

/** Extend as pages land; every route gets all three checks. */
const ROUTES = [
  "/",
  "/get-started",
  "/pricing",
  "/paid-from-abroad",
  "/freelancers",
  "/creators",
  "/how-we-work",
  "/contact",
  "/privacy",
  "/terms",
  "/guides",
  "/guides/how-we-decide-what-you-need",
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
      /* Sampled once the entrance has finished. A counting figure shows an
         intermediate value while it runs, which is a transient difference
         rather than missing content — it lands on exactly the string the
         server rendered. The hero's record builds at the slow pace (260ms in,
         1500ms counting), so this waits past that. Anything still different
         after it is a real gap. */
      await scriptedPage.waitForTimeout(2600);
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
 *
 * Four of §12's sections were cut from this page on the owner's instruction —
 * the operating model, the managed calendar, the trust ledger and additional
 * financial support. The remaining order is unchanged, and the property that
 * matters is intact: no Layer B service appears anywhere on the page, which the
 * test below this one asserts directly.
 */
test.describe("homepage architecture", () => {
  const LOCKED_ORDER = [
    "Half the work you do",                    // 1. Hero
    "Different sources of income",             // 2. Recognition
    "Nothing goes wrong in your first year",   // 3. Latent problem
    "Your work changed",                       // 4. Structural mismatch
    "Your obligations change",                 // 5. Income Axis
    "The CA and compliance work we are built to run",  // 6. Core scope
    "Judge us by what happens before we file anything", // 7. Trust ledger
    "Transparent pricing without any nasty surprises", // 8. Pricing
    "I don’t earn enough for this yet",        // 9. FAQ
    "Tell us how you earn",                    // 10. Final CTA
  ];

  /* Cut from this page. Each is asserted absent rather than merely dropped from
     the list above, so re-adding one is a deliberate act with a failing test
     behind it rather than something that quietly reappears. */
  const REMOVED = [
    "You shouldn’t have to know which question to ask",
    "Your work has deadlines",
    "And when something else comes up",
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

    for (const marker of REMOVED) {
      expect(body, `"${marker}" was removed from the homepage`).not.toContain(
        marker.replace(/\s+/g, " "),
      );
    }
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

    await choose(page, "Overseas company or platform");
    await expect(page.getByText("Step 2 of 4")).toBeVisible();

    await choose(page, "First year");
    // Step 3 accepts more than one answer.
    await pick(page, "Setting things up properly");
    await pick(page, "I don’t know what I need");
    await page.getByRole("button", { name: "Continue" }).click();

    await expect(page.getByText("Step 4 of 4")).toBeVisible();
    await expect(page.getByLabel("Name")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Phone")).toBeVisible();

    // Back returns to the previous question with the answers still selected.
    await page.getByRole("button", { name: "Back" }).click();
    await expect(page.getByText("Step 3 of 4")).toBeVisible();
    await expect(page.getByRole("checkbox", { name: "Setting things up properly" })).toBeChecked();
    await expect(page.getByRole("checkbox", { name: "I don’t know what I need" })).toBeChecked();
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

    /* And the invalid state is programmatically determinable, not only
       described — the same treatment the text fields on the last step get. It
       sits on the group, because aria-invalid is not supported on role=radio,
       which is what the inputs are. */
    const group = page.locator('[role="radiogroup"]');
    await expect(group).toHaveAttribute("aria-invalid", "true");

    /* The role means the legend no longer names the group on its own. */
    const labelledBy = await group.getAttribute("aria-labelledby");
    expect(labelledBy).toBeTruthy();
    expect(await page.locator(`#${labelledBy}`).innerText()).toBeTruthy();
  });

  test("persists nothing client-side", async ({ page }) => {
    await page.goto("/get-started");
    await choose(page, "Indian clients directly");
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

    await choose(page, "A mix");
    await choose(page, "Longer than that");
    await choose(page, "Catching up on something I think I’ve missed");

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

    await choose(page, "A mix");
    await choose(page, "Longer than that");
    await choose(page, "Catching up on something I think I’ve missed");

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
test.describe("audience pages", () => {
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

  const AUDIENCES = ["/paid-from-abroad", "/freelancers", "/creators"];

  test("the header dropdown and the recognition strip link to every audience page", async ({
    page,
  }) => {
    await page.goto("/");

    for (const path of AUDIENCES) {
      /* Two per header: the desktop dropdown and the mobile disclosure both
         live inside the one nav landmark, only ever one of them displayed. */
      const count = await page.locator(`header a[href="${path}"]`).count();
      expect(count, `${path} is missing from the header`).toBeGreaterThan(0);
    }

    // The recognition strip doubles as navigation; two cells share /freelancers.
    const strip = page.locator("main section").filter({ hasText: "How your money reaches you" });
    await expect(strip.locator('a[href="/paid-from-abroad"]')).toHaveCount(1);
    await expect(strip.locator('a[href="/freelancers"]')).toHaveCount(2);
    await expect(strip.locator('a[href="/creators"]')).toHaveCount(1);
  });

  test("no audience page names a Layer B service", async ({ page }) => {
    for (const path of AUDIENCES) {
      await page.goto(path);
      const text = await page.locator("main").innerText();

      for (const term of LAYER_B_TERMS) {
        expect(
          new RegExp(`\\b${term}\\b`, "i").test(text),
          `"${term}" appears on ${path} — Layer B belongs on /pricing, after the tiers`,
        ).toBe(false);
      }
    }
  });

  test("each audience page has one h1, its own headline, and the doc's sections", async ({
    page,
  }) => {
    const seen = new Set<string>();

    for (const path of AUDIENCES) {
      await page.goto(path);
      const headings = page.locator("h1");
      await expect(headings).toHaveCount(1);

      const text = await headings.innerText();
      expect(seen.has(text), `${path} repeats another audience's headline`).toBe(false);
      seen.add(text);

      const body = (await page.locator("main").innerText()).replace(/\s+/g, " ");
      for (const marker of [
        "What’s actually different here",
        "What we run for you",
        "How we behave",
        "Three annual prices",
        "Questions people ask before they start",
      ]) {
        expect(body, `${path} is missing "${marker}"`).toContain(marker);
      }
    }
  });

  test("the old URLs redirect permanently onto the final structure", async ({ request }) => {
    const MOVES: [string, string][] = [
      ["/who-its-for/foreign-income", "/paid-from-abroad"],
      ["/who-its-for/freelancers-consultants", "/freelancers"],
      ["/who-its-for/independent-professionals", "/freelancers"],
      ["/who-its-for/creators", "/creators"],
      ["/who-its-for", "/"],
      ["/how-it-works", "/how-we-work"],
      ["/about", "/how-we-work"],
    ];

    for (const [from, to] of MOVES) {
      const response = await request.get(from, { maxRedirects: 0 });
      expect(response.status(), `${from} should redirect permanently`).toBe(308);
      expect(response.headers()["location"], `${from} should land on ${to}`).toBe(to);
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

/** No stock photography anywhere; /how-we-work is honest about anonymity. */
test.describe("how we work", () => {
  test("ships no photography and states the signing commitment plainly", async ({ page }) => {
    await page.goto("/how-we-work");

    await expect(page.locator("main img")).toHaveCount(0);
    await expect(
      page.getByText("We don’t publish the team on this site yet."),
    ).toBeVisible();
    await expect(
      page.getByText("Every return we file is signed by an ICAI-registered chartered accountant."),
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
    "/paid-from-abroad",
    "/freelancers",
    "/creators",
    "/pricing",
    "/how-we-work",
    "/contact",
  ];

  /* /guides is built and reachable but noindexed until it has real content. */
  const NOT_INDEXED = [
    "/get-started",
    "/privacy",
    "/terms",
      "/guides",
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
  const ROUTES = ["/", "/pricing", "/paid-from-abroad", "/freelancers", "/how-we-work"];

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
 * One static vertical progression on the ink chapter, identical in structure
 * at every viewport, motion preference and scripting state. The sticky
 * scroll-scrub composition is gone: it double-painted stages during every
 * exchange and held a multi-viewport black band open.
 */
test.describe("income axis", () => {
  const axisSection = (page: import("@playwright/test").Page) =>
    page.locator("main > section").filter({ has: page.locator("#income-axis") });

  const expectsStaticComposition = (label: string) => {
    test(`${label} renders the static vertical progression`, async ({ page }) => {
      await page.goto("/");

      /* The rows reveal on first entry when scripted; measure the resting
         state after the section has been reached, which is the state a
         reader ever sees. */
      await axisSection(page).scrollIntoViewIfNeeded();
      await page.waitForTimeout(900);

      const state = await axisSection(page).evaluate((el) => {
        const milestones = [...el.querySelectorAll("li")];
        const sticky = [...el.querySelectorAll("*")].filter(
          (node) => getComputedStyle(node).position === "sticky",
        );
        return {
          total: milestones.length,
          hidden: milestones.filter((item) => {
            const style = getComputedStyle(item);
            return style.opacity === "0" || style.visibility === "hidden";
          }).length,
          sticky: sticky.length,
          height: el.getBoundingClientRect().height,
          viewport: window.innerHeight,
        };
      });

      expect(state.total).toBe(5);
      expect(state.hidden).toBe(0);
      expect(state.sticky, "nothing in the section may pin itself").toBe(0);
      // A chapter, not a scroll-jack: it must not hold multiple viewports open.
      expect(state.height).toBeLessThan(state.viewport * 3.5);
    });
  };

  test.describe("desktop, scripted", () => {
    expectsStaticComposition("desktop");
  });

  test.describe("with reduced motion", () => {
    test.use({ contextOptions: { reducedMotion: "reduce" } });
    expectsStaticComposition("reduced motion");
  });

  test.describe("on mobile", () => {
    test.use({ viewport: { width: 375, height: 800 } });
    expectsStaticComposition("mobile");
  });

  test.describe("without JavaScript", () => {
    test.use({ javaScriptEnabled: false });
    expectsStaticComposition("no JavaScript");
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
    "/", "/pricing", "/paid-from-abroad", "/freelancers", "/creators",
    "/how-we-work", "/get-started", "/guides/how-we-decide-what-you-need",
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

/**
 * Flair invariants.
 *
 * These guard the rules the decorative work is most likely to break: marks must
 * be invisible to assistive tech, and nothing may have a hidden resting state
 * that survives reduced motion.
 */
test.describe("flair", () => {
  const FLAIR_ROUTES = ["/", "/pricing", "/paid-from-abroad", "/freelancers"];

  test("every decorative mark is hidden from assistive tech", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const exposed: string[] = [];
    for (const route of FLAIR_ROUTES) {
      await page.goto(route);
      const found = await page.evaluate(() =>
        [...document.querySelectorAll('[class*="plate"], [class*="Plate"], [class*="Axis_axis"]')]
          .filter((el) => el.closest('[aria-hidden="true"]') === null)
          .map((el) => el.tagName + "." + String(el.className).slice(0, 30)),
      );
      for (const f of found) exposed.push(`${route}: ${f}`);
    }
    expect(exposed, "decorative geometry must carry aria-hidden").toEqual([]);
  });

  test("reduced motion still renders the record and its rows", async ({ browser }) => {
    const ctx = await browser.newContext({
      reducedMotion: "reduce",
      viewport: { width: 1440, height: 900 },
    });
    const page = await ctx.newPage();
    await page.goto("/");
    await page.waitForTimeout(400);

    const state = await page.evaluate(() => {
      const figure = document.querySelector("main figure") as HTMLElement;
      const rows = figure.querySelector("dl") as HTMLElement;
      const amount = figure.querySelector("p") as HTMLElement;
      const note = figure.querySelector("[class*=note]") as HTMLElement | null;
      const opacity = (el: Element) => getComputedStyle(el).opacity;
      return {
        rowsOpacity: opacity(rows),
        cellOpacities: [...rows.children].map((c) => opacity(c)),
        amountText: amount.textContent?.trim() ?? "",
        noteRule: note ? getComputedStyle(note).borderTopColor : "none",
      };
    });

    expect(Number(state.rowsOpacity)).toBeGreaterThan(0);
    for (const o of state.cellOpacities) expect(Number(o)).toBeGreaterThan(0);
    // The figure is the formatted string at rest, never a zeroed counter.
    expect(state.amountText).not.toBe("");
    expect(state.amountText).not.toMatch(/^[^\d]*0[.,]?0*[^\d]*$/);
    // The note's rule is a real border under reduced motion, not a transparent
    // one waiting for an animation that will never run.
    expect(state.noteRule).not.toBe("rgba(0, 0, 0, 0)");
  });

  test("with JavaScript off the record is complete", async ({ browser }) => {
    const ctx = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 1440, height: 900 },
    });
    const page = await ctx.newPage();
    await page.goto("/");
    const text = await page.locator("main figure").first().textContent();
    expect(text).toContain("Incoming payment");
    expect(text).toContain("$5,000.00");
    await ctx.close();
  });
});

/**
 * The amended visual system.
 *
 * Two of these can only be checked on a rendered page: how many colour blocks a
 * page actually ends up with once its components are composed, and whether any
 * text on a dark surface resolves to a colour that fails AA.
 */
test.describe("surfaces", () => {
  /** Every real page. */
  const SURFACE_ROUTES = [
    "/", "/pricing", "/paid-from-abroad", "/freelancers", "/creators",
    "/how-we-work", "/get-started", "/guides", "/contact", "/privacy", "/terms",
  ];

  test("a page carries at most one ink block and one acid block", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const over: string[] = [];
    for (const route of SURFACE_ROUTES) {
      await page.goto(route);
      const counts = await page.evaluate(() => ({
        ink: document.querySelectorAll(".surface-ink").length,
        acid: document.querySelectorAll(".surface-acid").length,
      }));
      if (counts.ink > 1) over.push(`${route}: ${counts.ink} ink blocks`);
      if (counts.acid > 1) over.push(`${route}: ${counts.acid} acid blocks`);
    }
    expect(over).toEqual([]);
  });

  test("ink and acid blocks are never adjacent", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const adjacent: string[] = [];
    for (const route of SURFACE_ROUTES) {
      await page.goto(route);
      const bad = await page.evaluate(() => {
        const blocks = [...document.querySelectorAll(".surface-ink, .surface-acid")];
        return blocks.filter((block) => {
          const next = block.nextElementSibling;
          return (
            next !== null &&
            (next.classList.contains("surface-ink") || next.classList.contains("surface-acid"))
          );
        }).length;
      });
      if (bad > 0) adjacent.push(`${route}: ${bad}`);
    }
    expect(adjacent).toEqual([]);
  });

  test("text on every surface clears its own contrast floor", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const failures: string[] = [];
    for (const route of SURFACE_ROUTES) {
      await page.goto(route);
      const bad = await page.evaluate(() => {
        const px = (v: string) => parseFloat(v) || 0;
        const chan = (c: number) => { const v = c / 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
        const lum = (c: number[]) => 0.2126 * chan(c[0]) + 0.7152 * chan(c[1]) + 0.0722 * chan(c[2]);
        const parse = (v: string) => (v.match(/[\d.]+/g) ?? []).slice(0, 4).map(Number);
        const backdrop = (el: Element): number[] => {
          let n: Element | null = el;
          while (n && n !== document.documentElement) {
            const c = parse(getComputedStyle(n).backgroundColor);
            if (c.length >= 3 && (c[3] === undefined || c[3] > 0)) return c.slice(0, 3);
            n = n.parentElement;
          }
          return [246, 247, 242];
        };
        const out: string[] = [];
        for (const el of document.querySelectorAll("body *")) {
          if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent?.trim())) continue;
          const cs = getComputedStyle(el);
          if (cs.visibility === "hidden" || cs.display === "none" || cs.opacity === "0") continue;
          const r = el.getBoundingClientRect();
          if (!r.width || !r.height) continue;
          const bg = backdrop(el);
          const fg = parse(cs.color);
          const a = fg[3] === undefined ? 1 : fg[3];
          const over = [0, 1, 2].map((i) => fg[i] * a + bg[i] * (1 - a));
          const l1 = lum(over), l2 = lum(bg);
          const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
          const size = px(cs.fontSize);
          const large = size >= 24 || (size >= 18.66 && parseInt(cs.fontWeight, 10) >= 700);
          const need = large ? 3 : 4.5;
          if (ratio < need) {
            out.push(`${ratio.toFixed(2)}:1 need ${need} — "${(el.textContent ?? "").trim().slice(0, 30)}"`);
          }
        }
        return out;
      });
      for (const b of bad) failures.push(`${route}: ${b}`);
    }
    expect(failures).toEqual([]);
  });
});

/**
 * §28. The three things about this motion system that are expensive to get
 * wrong: content that never arrives, a hero that runs past its budget, and
 * anything that keeps going.
 */
test.describe("motion system", () => {
  const ROUTES = ["/", "/pricing", "/paid-from-abroad", "/creators", "/how-we-work"];

  /** Anything with text that is still transparent is content nobody can read. */
  const FADED = `(() => {
    const out = [];
    for (const el of document.querySelectorAll("main *, header *, footer *")) {
      const text = (el.textContent ?? "").trim();
      if (!text || el.children.length > 0) continue;
      const s = getComputedStyle(el);
      if (s.display === "none" || s.visibility === "hidden") continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      if (Number(s.opacity) < 0.95) out.push(text.slice(0, 40) + " @ " + s.opacity);
    }
    return out;
  })()`;

  /** A dash left on a stroke is a drawing that never finished. */
  const UNDRAWN = `(() => {
    const out = [];
    for (const shape of document.querySelectorAll("svg path, svg circle, svg rect, svg line")) {
      const offset = parseFloat(getComputedStyle(shape).strokeDashoffset || "0");
      if (offset > 0.001) out.push(String(shape.getAttribute("class") ?? shape.tagName));
    }
    return out;
  })()`;

  test.describe("with reduced motion", () => {
    test.use({ contextOptions: { reducedMotion: "reduce" } });

    test("every section is fully present and fully drawn", async ({ page }) => {
      for (const route of ROUTES) {
        await page.goto(route);
        /* Down and back, so anything that waits on an observer has had every
           chance to be reached — and anything that hides on the way has been
           given the chance to. */
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(300);
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(200);
        expect(await page.evaluate(FADED), `${route} hides text under reduced motion`).toEqual([]);
        expect(await page.evaluate(UNDRAWN), `${route} leaves a stroke undrawn`).toEqual([]);
      }
    });
  });

  test.describe("without JavaScript", () => {
    test.use({ javaScriptEnabled: false });

    test("every section is fully present and fully drawn", async ({ page }) => {
      for (const route of ROUTES) {
        await page.goto(route);
        expect(await page.evaluate(FADED), `${route} hides text with no JavaScript`).toEqual([]);
        expect(await page.evaluate(UNDRAWN), `${route} leaves a stroke undrawn`).toEqual([]);
      }
    });
  });

  test("the hero finishes inside 800ms and then stops", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    const state = () =>
      page.evaluate(() => {
        const hero = document.querySelector("main > section")!;
        const settled = (el: Element | null) =>
          el !== null && Number(getComputedStyle(el).opacity) > 0.99;
        const words = [...hero.querySelectorAll('[class*="wordInner"]')];
        const band = hero.querySelector('[class*="emphasis"]');
        const cells = [...hero.querySelectorAll("dl > * > *")];
        return {
          words: words.filter((w) => getComputedStyle(w).transform === "none").length,
          wordsTotal: words.length,
          band: band ? getComputedStyle(band, "::before").transform : "none",
          subhead: settled(hero.querySelector('[class*="subhead"]')),
          actions: settled(hero.querySelector('[class*="actions"]')),
          amount: settled(hero.querySelector('[class*="amount"]')),
          cells: cells.filter((c) => Number(getComputedStyle(c).opacity) > 0.99).length,
          cellsTotal: cells.length,
          running: document.getAnimations().filter((a) => a.playState === "running").length,
        };
      });

    await page.goto("/", { waitUntil: "load" });

    /* Mid-flight, so this cannot pass by the animation never having run. */
    await page.waitForTimeout(280);
    const during = await state();
    expect(during.words, "the headline should still be arriving").toBeLessThan(during.wordsTotal);

    /* §28 closes the hero at 800ms. Sampled a little after, to allow for the
       frame the browser needs to commit the last transition.

       The copy half of the hero still has to make that budget. The payment
       object does not: the owner asked for it to build more slowly, so it is on
       the record surface's `slow` pace — 260ms in, then a 1500ms count with its
       rows 130ms apart — and it is deliberately still going here. */
    await page.waitForTimeout(600);
    const copyDone = await state();
    expect(copyDone.words).toBe(copyDone.wordsTotal);
    expect(copyDone.band).toBe("matrix(1, 0, 0, 1, 0, 0)");
    expect(copyDone.subhead).toBe(true);
    expect(copyDone.actions).toBe(true);

    /* The object's own budget. Past the slow pace's last row it must be fully
       settled — and, like everything else in the hero, finished for good. */
    await page.waitForTimeout(1800);
    const done = await state();
    expect(done.cells).toBe(done.cellsTotal);
    expect(done.amount).toBe(true);
    expect(done.running, "the hero must be finished once the object has built").toBe(0);

    /* And then permanently: nothing in the hero starts again on its own. */
    await page.waitForTimeout(900);
    expect((await state()).running, "hero motion must not resume").toBe(0);
  });

  test("first entrance only — nothing replays on the way back up", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");

    const drawn = () =>
      page.evaluate(() => {
        const sections = [...document.querySelectorAll("section.section")];
        return {
          total: sections.length,
          drawn: sections.filter((s) => {
            const t = getComputedStyle(s, "::before").transform;
            return t === "none" || t.startsWith("matrix(1,");
          }).length,
        };
      });

    const height = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < height; y += 500) {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await page.waitForTimeout(80);
    }
    await page.waitForTimeout(1000);
    const after = await drawn();
    expect(after.drawn, "every rule should have drawn on the way down").toBe(after.total);

    for (let y = height; y > 0; y -= 700) {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await page.waitForTimeout(50);
    }
    await page.waitForTimeout(400);
    const back = await drawn();
    expect(back.drawn, "a rule must never re-draw on scroll back").toBe(back.total);
  });

  test("nothing on the page loops", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1200);

    const looping = await page.evaluate(() =>
      [...document.querySelectorAll("*")].filter((node) =>
        ["", "::before", "::after"].some(
          (part) =>
            getComputedStyle(node, part || undefined).animationIterationCount === "infinite",
        ),
      ).length,
    );
    expect(looping, "motion on this site is one pass").toBe(0);
  });

  test("a full-viewport colour change is never animated", async ({ page }) => {
    await page.goto("/");
    const surfaces = await page.evaluate(() =>
      [...document.querySelectorAll(".surface-ink, .surface-acid, .surface-paper, .surface-white")]
        .map((el) => {
          const cs = getComputedStyle(el);
          return { property: cs.transitionProperty, duration: cs.transitionDuration };
        })
        .filter((s) => s.property !== "none" && s.duration !== "0s"),
    );
    expect(surfaces, "§28: an ink chapter arrives, it does not fade in").toEqual([]);
  });

  test("a hover lift never exceeds 2px, and only on a fine pointer", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const record = page.locator("main figure").first();
    await record.scrollIntoViewIfNeeded();
    await record.hover();
    await page.waitForTimeout(250);

    const lifted = await record.evaluate((el) => {
      const m = new DOMMatrix(getComputedStyle(el).transform);
      return { y: m.m42, x: m.m41 };
    });
    expect(Math.abs(lifted.y), "§28 caps the lift at 2px").toBeLessThanOrEqual(2);
    expect(lifted.x).toBe(0);
  });
});

/**
 * The QA checklist items that were only ever verified by hand. Each of these
 * is measured rather than asserted.
 */
test.describe("QA checklist", () => {
  const ROUTES = [
    "/", "/pricing", "/paid-from-abroad", "/freelancers", "/creators",
    "/how-we-work", "/contact", "/guides",
    "/get-started", "/privacy", "/terms", "/guides/how-we-decide-what-you-need",
  ];

  test("one h1, no skipped heading level, and a skip link that resolves", async ({ page }) => {
    const problems: string[] = [];
    for (const route of ROUTES) {
      await page.goto(route);
      const r = await page.evaluate(() => {
        const levels = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")]
          .filter((h) => getComputedStyle(h).display !== "none")
          .map((h) => ({ level: Number(h.tagName[1]), text: (h.textContent ?? "").trim().slice(0, 30) }));
        const jumps: string[] = [];
        for (let i = 1; i < levels.length; i++) {
          if (levels[i].level > levels[i - 1].level + 1) {
            jumps.push(`h${levels[i - 1].level} to h${levels[i].level} at "${levels[i].text}"`);
          }
        }
        const skip = document.querySelector('a[href^="#"]');
        const href = skip?.getAttribute("href") ?? null;
        return {
          h1: levels.filter((h) => h.level === 1).length,
          first: levels[0]?.level ?? 0,
          jumps,
          href,
          resolves: href ? document.querySelector(href) !== null : false,
        };
      });
      if (r.h1 !== 1) problems.push(`${route}: ${r.h1} h1 elements`);
      if (r.first !== 1) problems.push(`${route}: first heading is h${r.first}`);
      if (r.jumps.length) problems.push(`${route}: ${r.jumps.join("; ")}`);
      if (!r.resolves) problems.push(`${route}: skip link ${r.href} resolves to nothing`);
    }
    expect(problems).toEqual([]);
  });

  test("no horizontal scroll at 200% zoom", async ({ page }) => {
    /* 200% zoom of a 1280px window is a 640px CSS viewport — WCAG 1.4.10. */
    await page.setViewportSize({ width: 640, height: 512 });
    const overflowing: string[] = [];
    for (const route of ROUTES) {
      await page.goto(route);
      await page.waitForTimeout(120);
      const over = await page.evaluate(() => ({
        doc: document.documentElement.scrollWidth,
        client: document.documentElement.clientWidth,
      }));
      if (over.doc > over.client + 1) {
        overflowing.push(`${route}: ${over.doc} > ${over.client}`);
      }
    }
    expect(overflowing).toEqual([]);
  });

  test("every tab stop is reachable and shows a focus ring", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");

    const stops: string[] = [];
    const unringed: string[] = [];
    let first = "";
    for (let i = 0; i < 120; i++) {
      await page.keyboard.press("Tab");
      const focused = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body) return null;
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return {
          key: `${el.tagName.toLowerCase()}#${el.id || ""}:${(el.textContent ?? "").trim().slice(0, 24)}`,
          ring: cs.outlineStyle !== "none" || cs.boxShadow !== "none",
          sized: r.width > 0 && r.height > 0,
        };
      });
      if (!focused) break;
      if (i === 0) first = focused.key;
      else if (focused.key === first) break;
      stops.push(focused.key);
      if (!focused.ring || !focused.sized) unringed.push(focused.key);
    }

    expect(stops.length, "the homepage should have a real tab order").toBeGreaterThan(20);
    expect(unringed, "every focusable element needs a visible focus indicator").toEqual([]);
  });

  test("pricing stacks and its vertical rules go when cramped", async ({ page }) => {
    const read = async (width: number) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/pricing");
      await page.waitForTimeout(200);
      return page.evaluate(() => {
        const list = document.querySelector('ul[class*="tiers"]')!;
        const tiers = [...list.children];
        const boxes = tiers.map((t) => t.getBoundingClientRect());
        return {
          tiers: tiers.length,
          rows: [...new Set(boxes.map((b) => Math.round(b.top)))].length,
          columns: [...new Set(boxes.map((b) => Math.round(b.left)))].length,
          verticalRules: tiers.filter(
            (t) => parseFloat(getComputedStyle(t).borderLeftWidth) > 0,
          ).length,
          overflows: Math.round(list.scrollWidth) > Math.round(list.clientWidth),
          prices: tiers.map((t) => (t.querySelector('[class*="price"]')?.textContent ?? "").trim()),
        };
      });
    };

    const desktop = await read(1440);
    expect(desktop.tiers).toBe(3);
    expect(desktop.rows, "three tiers side by side").toBe(1);
    expect(desktop.columns).toBe(3);
    expect(desktop.verticalRules, "two dividers between three columns").toBe(2);
    expect(desktop.overflows).toBe(false);

    const mobile = await read(375);
    expect(mobile.rows, "stacked at phone width").toBe(3);
    expect(mobile.columns).toBe(1);
    expect(mobile.verticalRules, "a vertical rule in one column divides nothing").toBe(0);
    expect(mobile.overflows).toBe(false);

    /* The prices themselves, unchanged at either width. */
    for (const prices of [desktop.prices, mobile.prices]) {
      expect(prices.map((p) => p.split(" ")[0])).toEqual(["₹19,999", "₹24,999", "₹34,999"]);
    }
  });

  test("nothing asks for animation frames once the page has settled", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.evaluate(() => {
      (window as { __frames?: number }).__frames = 0;
      const real = window.requestAnimationFrame;
      window.requestAnimationFrame = function (cb: FrameRequestCallback) {
        (window as { __frames?: number }).__frames!++;
        return real.call(window, cb);
      };
    });

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1500);
    const afterScroll = await page.evaluate(() => (window as { __frames?: number }).__frames);
    await page.waitForTimeout(1500);
    const afterIdle = await page.evaluate(() => (window as { __frames?: number }).__frames);

    expect(afterIdle! - afterScroll!, "no section may hold a frame loop open").toBe(0);
  });

  test("every dominant call to action routes to /get-started", async ({ page }) => {
    /* CLAUDE.md rule 9 is about *primary* calls to action. Every action on the
       site is now a button, so "is a button" no longer identifies one: the
       filled acid button (and its reversed ink twin on the acid panel) is the
       dominant CTA, and the outlined `.button-secondary` is the second action
       beside it — "View pricing", "Find the right plan" — which is allowed to
       go somewhere else. Both are checked, each against its own rule. */
    const strays: string[] = [];
    const badSecondary: string[] = [];

    for (const route of ROUTES) {
      await page.goto(route);
      const ctas = await page.evaluate(() =>
        [...document.querySelectorAll("a[class*='button-primary'], a[class*='button-secondary']")].map(
          (a) => ({
            href: a.getAttribute("href"),
            dominant: a.className.includes("button-primary"),
            text: (a.textContent ?? "").trim().slice(0, 30),
          }),
        ),
      );

      for (const cta of ctas) {
        if (cta.dominant) {
          if (cta.href !== "/get-started") strays.push(`${route}: "${cta.text}" -> ${cta.href}`);
        } else if (!cta.href?.startsWith("/")) {
          /* A secondary action may go elsewhere on the site; it may not leave
             it, and it may not be an anchor with nowhere to go. */
          badSecondary.push(`${route}: "${cta.text}" -> ${cta.href}`);
        }
      }
    }

    expect(strays).toEqual([]);
    expect(badSecondary).toEqual([]);
  });

  test("no WebGL anywhere, and no three.js in the bundle", async ({ page }) => {
    const requests: string[] = [];
    page.on("request", (r) => requests.push(r.url()));
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1200);

    expect(requests.filter((u) => /three|webgl/i.test(u))).toEqual([]);
    expect(await page.evaluate(() => document.querySelectorAll("canvas").length)).toBe(0);
  });

  test("every image, svg and frame declares its dimensions", async ({ page }) => {
    const missing: string[] = [];
    for (const route of ROUTES) {
      await page.goto(route);
      const bare = await page.evaluate(() =>
        [...document.querySelectorAll("img, video, svg, iframe")]
          .filter((el) => !el.getAttribute("width") || !el.getAttribute("height"))
          .map((el) => el.tagName),
      );
      for (const b of bare) missing.push(`${route}: <${b.toLowerCase()}> without width/height`);
    }
    expect(missing, "a media element without dimensions is a layout shift").toEqual([]);
  });
});
