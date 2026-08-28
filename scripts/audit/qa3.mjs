/* Third pass: positioning, product, content and CTA, quoted from the built page. */
import { chromium } from "playwright";
const BASE = "http://127.0.0.1:3100";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const out = {};

await p.goto(BASE + "/");
await p.waitForTimeout(500);

out.firstViewport = await p.evaluate(() => {
  const inFold = [];
  for (const el of document.querySelectorAll("main *, header *")) {
    const r = el.getBoundingClientRect();
    if (r.top >= 0 && r.top < window.innerHeight && r.height > 0) {
      const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(" ").trim();
      if (own) inFold.push(own);
    }
  }
  return inFold;
});

const body = await p.evaluate(() => document.body.innerText.replace(/\s+/g, " "));
const LAYER_B = ["FX", "insurance", "loan", "wealth", "MIS", "foreign exchange"];
out.layerBFirstIndex = Object.fromEntries(LAYER_B.map(t => [t, body.search(new RegExp("\\b" + t + "\\b", "i"))]));
out.pricingIndex = body.indexOf("The price is on the site");
out.secondarySupportIndex = body.indexOf("And when something else comes up");

out.oldSitePhrases = ["full-stack", "financial office", "new economy", "financial leaks", "one view", "8M+", "5000+"]
  .filter(t => new RegExp(t, "i").test(body));

const BANNED = ["expert CAs","transparent pricing","no hidden charges","100% online","hassle-free","one-stop shop","all-in-one","end-to-end","AI-powered","file in minutes","maximum refund","starting at","hassle","boring","tedious","paperwork"];
out.bannedPhrasesFound = BANNED.filter(t => new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"), "i").test(body));

out.prices = body.match(/₹[\d,]+/g);
out.planNameLike = /Domestic|Foreign Income Plan|₹75L|Starter|Pro|Premium|Basic/i.test(body);

out.headlineSizes = await p.evaluate(() => {
  const grab = (t) => {
    const el = [...document.querySelectorAll("h2")].find(h => h.textContent.includes(t));
    return el ? parseFloat(getComputedStyle(el).fontSize) : null;
  };
  return { coreScope: grab("The CA and compliance work"), secondary: grab("And when something else comes up") };
});

out.foreignIncomeInFold = out.firstViewport.some(t => /overseas|abroad|foreign/i.test(t));
out.caFirmInFold = out.firstViewport.some(t => /CA firm/i.test(t));

// CTA
out.ctaHrefs = await p.evaluate(() =>
  [...document.querySelectorAll("main a")].filter(a => /See what I need|Find the right plan/.test(a.textContent)).map(a => a.getAttribute("href")));

await p.goto(BASE + "/get-started");
out.intakeSteps = await p.evaluate(() => document.body.innerText.match(/Step \d of \d/)?.[0]);
out.successCopyInBundle = null;

await b.close();
console.log(JSON.stringify(out, null, 2));
