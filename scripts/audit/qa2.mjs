/* Second audit pass: zoom, focus, keyboard, responsive, motion, performance. */
import { chromium } from "playwright";
const BASE = "http://127.0.0.1:3100";
const b = await chromium.launch();
const out = {};

/* 200% zoom emulated by halving the CSS viewport at 2x density: a 1440x900
   screen at 200% presents 720x450 CSS pixels. */
{
  const p = await b.newPage({ viewport: { width: 720, height: 450 }, deviceScaleFactor: 2 });
  const rows = [];
  for (const r of ["/", "/pricing", "/get-started", "/who-its-for/foreign-income"]) {
    await p.goto(BASE + r);
    await p.waitForTimeout(300);
    rows.push({ route: r, ...(await p.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      clipped: [...document.querySelectorAll("main *")].filter((el) => {
        const cs = getComputedStyle(el);
        return cs.overflow === "hidden" && el.scrollWidth > el.clientWidth + 1;
      }).length,
    }))) });
  }
  out.zoom200 = rows;
  await p.close();
}

/* 320px */
{
  const p = await b.newPage({ viewport: { width: 320, height: 640 } });
  const rows = [];
  for (const r of ["/", "/pricing", "/get-started", "/guides/how-we-decide-what-you-need"]) {
    await p.goto(BASE + r);
    rows.push({ route: r, overflow: await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth) });
  }
  out.width320 = rows;
  await p.close();
}

/* Focus visibility and keyboard order */
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(BASE + "/");
  const seq = [];
  for (let i = 0; i < 12; i++) {
    await p.keyboard.press("Tab");
    seq.push(await p.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const cs = getComputedStyle(el);
      return {
        text: (el.textContent || el.getAttribute("aria-label") || el.tagName).trim().slice(0, 26),
        outlineWidth: cs.outlineWidth,
        outlineColor: cs.outlineColor,
        outlineStyle: cs.outlineStyle,
      };
    }));
  }
  out.tabOrder = seq;
  await p.close();
}

/* Responsive composition */
{
  const p = await b.newPage({ viewport: { width: 375, height: 800 } });
  await p.goto(BASE + "/");
  out.mobile = await p.evaluate(() => {
    const axis = [...document.querySelectorAll("main > section")].find((s) => s.querySelector("#income-axis"));
    const axisPanel = axis.querySelector('[class*="panel"]');
    const tiers = [...document.querySelectorAll('[class*="tier"]')].filter((t) => t.tagName === "LI");
    const heroSection = document.querySelector("main > section");
    const h1 = heroSection.querySelector("h1").getBoundingClientRect();
    const record = heroSection.querySelector("figure").getBoundingClientRect();
    const verticalRules = [...document.querySelectorAll("main *")].filter((el) => {
      const cs = getComputedStyle(el);
      return cs.borderLeftWidth === "1px" && cs.borderLeftColor !== "rgba(0, 0, 0, 0)" && el.getBoundingClientRect().height > 20;
    }).length;
    return {
      axisPanelPosition: getComputedStyle(axisPanel).position,
      tierCount: tiers.length,
      tiersStacked: tiers.length > 1 ? tiers[0].getBoundingClientRect().bottom <= tiers[1].getBoundingClientRect().top + 1 : null,
      heroObjectAfterCopy: record.top > h1.top,
      verticalRulesRemaining: verticalRules,
    };
  });
  await p.close();
}

/* Motion: hero settles, no loops, no scroll listeners on window */
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.addInitScript(() => {
    window.__scrollListeners = 0;
    const add = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (type, ...rest) {
      if (type === "scroll" && (this === window || this === document)) window.__scrollListeners++;
      return add.call(this, type, ...rest);
    };
    window.__raf = 0;
    const raf = window.requestAnimationFrame;
    window.requestAnimationFrame = function (cb) { window.__raf++; return raf.call(window, cb); };
  });
  await p.goto(BASE + "/");
  await p.waitForTimeout(2500);
  const idleRaf = await p.evaluate(() => window.__raf);
  await p.waitForTimeout(1500);
  out.motion = await p.evaluate((before) => ({
    scrollListenersOnWindowOrDocument: window.__scrollListeners,
    rafCallsWhileIdle: window.__raf - before,
    heroAnimationsRunning: [...document.querySelectorAll("main > section:first-child *")]
      .some((el) => el.getAnimations().some((a) => a.playState === "running")),
    anyInfinite: [...document.querySelectorAll("*")]
      .filter((el) => getComputedStyle(el).animationIterationCount === "infinite").length,
    canvases: document.querySelectorAll("canvas").length,
  }), idleRaf);
  await p.close();
}

console.log(JSON.stringify(out, null, 2));
await b.close();
