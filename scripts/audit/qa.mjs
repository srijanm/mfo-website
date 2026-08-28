/* QA audit. Measures rather than asserts. Run against a production build. */
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://127.0.0.1:3100";
const ROUTES = [
  "/", "/how-it-works", "/who-its-for", "/who-its-for/foreign-income",
  "/pricing", "/guides", "/about", "/contact", "/get-started",
  "/privacy", "/terms", "/guides/how-we-decide-what-you-need",
];

const PALETTE = {
  "rgb(246, 247, 242)": "paper", "rgb(255, 255, 255)": "white",
  "rgb(17, 19, 15)": "ink", "rgb(52, 55, 49)": "ink-2",
  "rgb(106, 110, 102)": "muted", "rgb(215, 255, 0)": "acid",
  "rgb(36, 87, 255)": "focus", "rgb(180, 35, 24)": "error",
  "rgb(45, 106, 79)": "success", "rgba(0, 0, 0, 0)": "transparent",
};

const IN_PAGE = () => {
  const srgb = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  const lum = ([r, g, b]) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
  const parse = (s) => (s.match(/[\d.]+/g) || []).slice(0, 4).map(Number);
  const ratio = (fg, bg) => {
    const a = lum(fg), b = lum(bg);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  };
  const effectiveBg = (el) => {
    let node = el;
    while (node && node !== document.documentElement) {
      const c = parse(getComputedStyle(node).backgroundColor);
      if (c.length >= 3 && (c[3] === undefined || c[3] > 0)) return c.slice(0, 3);
      node = node.parentElement;
    }
    return [246, 247, 242];
  };

  const out = {
    fonts: new Set(), colours: new Set(), backgrounds: new Set(),
    gradients: [], backdrop: [], radii: [], weights: new Set(),
    images: [], imagesMissingDims: [], svgs: 0,
    contrast: [], targets: [], headings: [], h1: 0,
    infiniteAnimations: 0, borders: { one: 0, other: [] },
  };

  for (const el of document.querySelectorAll("body *")) {
    const cs = getComputedStyle(el);
    const text = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());

    out.fonts.add(cs.fontFamily.split(",")[0].replace(/["']/g, ""));
    if (text) { out.colours.add(cs.color); out.weights.add(cs.fontWeight); }
    if (cs.backgroundColor !== "rgba(0, 0, 0, 0)") out.backgrounds.add(cs.backgroundColor);
    if (cs.backgroundImage !== "none") out.gradients.push(el.tagName + ":" + cs.backgroundImage.slice(0, 40));
    if (cs.backdropFilter && cs.backdropFilter !== "none") out.backdrop.push(el.tagName);
    if (cs.animationIterationCount === "infinite") out.infiniteAnimations++;

    for (const side of ["Top", "Right", "Bottom", "Left"]) {
      const w = cs[`border${side}Width`];
      const c = cs[`border${side}Color`];
      if (w === "0px" || c === "rgba(0, 0, 0, 0)") continue;
      if (w === "1px") out.borders.one++;
      else if (w !== "2px") out.borders.other.push(el.tagName + " " + side + " " + w);
    }

    const r = parseFloat(cs.borderTopLeftRadius);
    if (r > 0 && !cs.borderTopLeftRadius.includes("%")) out.radii.push({ tag: el.tagName, r });

    if (el.tagName === "IMG") {
      out.images.push(el.getAttribute("src") || "");
      if (!el.getAttribute("width") || !el.getAttribute("height")) out.imagesMissingDims.push(el.getAttribute("src") || "");
    }
    if (el.tagName === "SVG" || el.tagName === "svg") out.svgs++;

    if (text) {
      const size = parseFloat(cs.fontSize);
      const weight = parseInt(cs.fontWeight, 10) || 400;
      const large = size >= 24 || (size >= 18.66 && weight >= 700);
      const fg = parse(cs.color).slice(0, 3);
      const cr = ratio(fg, effectiveBg(el));
      const required = large ? 3 : 4.5;
      if (cr + 0.01 < required) {
        out.contrast.push({
          tag: el.tagName, size, weight, ratio: +cr.toFixed(2), required,
          colour: cs.color, text: el.textContent.trim().slice(0, 40),
        });
      }
    }

    if (/^H[1-6]$/.test(el.tagName)) out.headings.push(el.tagName);
    if (el.tagName === "H1") out.h1++;
  }

  for (const el of document.querySelectorAll("a[href], button, input, select, textarea, [tabindex]:not([tabindex='-1'])")) {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    if (r.width < 44 || r.height < 44) {
      out.targets.push({
        tag: el.tagName, w: +r.width.toFixed(1), h: +r.height.toFixed(1),
        text: (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 34),
      });
    }
  }

  return {
    ...out,
    fonts: [...out.fonts], colours: [...out.colours],
    backgrounds: [...out.backgrounds], weights: [...out.weights],
  };
};

const b = await chromium.launch();
const page = await b.newPage({ viewport: { width: 1440, height: 900 } });
const report = {};

for (const route of ROUTES) {
  await page.goto(BASE + route);
  await page.waitForTimeout(600);
  const r = await page.evaluate(IN_PAGE);
  report[route] = r;
}
await page.close();
await b.close();

// Aggregate
const agg = { fonts: new Set(), colours: new Set(), backgrounds: new Set(), weights: new Set() };
const problems = { contrast: [], targets: [], gradients: [], backdrop: [], radii: [], images: [], svgs: 0, infinite: 0, multipleH1: [], borderOther: new Set() };

for (const [route, r] of Object.entries(report)) {
  r.fonts.forEach((f) => agg.fonts.add(f));
  r.colours.forEach((c) => agg.colours.add(c));
  r.backgrounds.forEach((c) => agg.backgrounds.add(c));
  r.weights.forEach((w) => agg.weights.add(w));
  r.contrast.forEach((c) => problems.contrast.push({ route, ...c }));
  r.targets.forEach((t) => problems.targets.push({ route, ...t }));
  r.gradients.forEach((g) => problems.gradients.push({ route, g }));
  r.backdrop.forEach((g) => problems.backdrop.push({ route, g }));
  r.radii.filter((x) => x.r > 6).forEach((x) => problems.radii.push({ route, ...x }));
  r.images.forEach((i) => problems.images.push({ route, i }));
  r.borders.other.forEach((x) => problems.borderOther.add(x));
  problems.svgs += r.svgs;
  problems.infinite += r.infiniteAnimations;
  if (r.h1 !== 1) problems.multipleH1.push({ route, h1: r.h1 });
}

const nonPalette = (list) => list.filter((c) => !(c in PALETTE));

console.log(JSON.stringify({
  fonts: [...agg.fonts],
  weights: [...agg.weights].sort(),
  textColoursNotInPalette: nonPalette([...agg.colours]),
  backgroundsNotInPalette: nonPalette([...agg.backgrounds]),
  contrastFailures: problems.contrast,
  touchTargetsUnder44: problems.targets,
  gradients: problems.gradients,
  backdropFilters: problems.backdrop,
  radiiOver6px: problems.radii,
  images: problems.images,
  inlineSvgs: problems.svgs,
  infiniteAnimations: problems.infinite,
  routesWithoutExactlyOneH1: problems.multipleH1,
  borderWidthsOtherThan1or2px: [...problems.borderOther],
  headingOrderPerRoute: Object.fromEntries(Object.entries(report).map(([k, v]) => [k, v.headings.join(" ")])),
}, null, 2));
