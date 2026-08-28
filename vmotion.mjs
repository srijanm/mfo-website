import { chromium } from "playwright";
import { createHash } from "node:crypto";
const b = await chromium.launch();
const base = "http://127.0.0.1:3100";
const out = {};

// 1. Reduced motion: nothing may be invisible.
const rc = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const rp = await rc.newPage();
await rp.goto(base + "/");
out.reducedMotion = await rp.evaluate(() => {
  const bad = [];
  for (const el of document.querySelectorAll("main *")) {
    const cs = getComputedStyle(el);
    if (el.textContent?.trim() && (cs.opacity === "0" || cs.visibility === "hidden")) {
      bad.push(el.tagName + "." + (el.className||"").toString().slice(0,30));
    }
  }
  return { invisibleWithText: bad.slice(0, 6), textLen: document.body.innerText.replace(/\s+/g," ").length };
});
out.reducedMotionHash = createHash("sha256").update(await rp.screenshot({ fullPage: true })).digest("hex").slice(0,16);
await rc.close();

// 2. JS disabled: nothing may be invisible.
const nc = await b.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
const np = await nc.newPage();
await np.goto(base + "/");
out.noJs = await np.evaluate(() => {
  const bad = [];
  for (const el of document.querySelectorAll("main *")) {
    const cs = getComputedStyle(el);
    if (el.textContent?.trim() && (cs.opacity === "0" || cs.visibility === "hidden")) {
      bad.push(el.tagName + "." + (el.className||"").toString().slice(0,30));
    }
  }
  return { invisibleWithText: bad.slice(0, 6), textLen: document.body.innerText.replace(/\s+/g," ").length };
});
out.noJsHash = createHash("sha256").update(await np.screenshot({ fullPage: true })).digest("hex").slice(0,16);
await nc.close();

// 3. Scripted, after animation settles.
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(base + "/");
await p.waitForTimeout(1800);
out.scriptedTextLen = (await p.locator("body").innerText()).replace(/\s+/g," ").length;
await p.close();
console.log(JSON.stringify(out, null, 2));
await b.close();
