#!/usr/bin/env node
/**
 * MyFinanceOfficer design + copy guardrails.
 *
 * Enforces the parts of CLAUDE.md that a linter can actually see. Run via
 * `npm run guardrails`, and as the first step of `npm run check`.
 *
 * Scans app/, components/ and lib/. This file lives in scripts/ and is not
 * scanned, which is why it may name the banned phrases it looks for.
 */

import { readFileSync } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const SCAN_DIRS = ["app", "components", "lib"];

/** Guide sources, checked separately against a stricter content rule. */
const GUIDES_DIR = "content/guides";
const SCAN_EXTENSIONS = new Set([".css", ".ts", ".tsx", ".js", ".jsx", ".mjs", ".mdx"]);

/** CLAUDE.md "Colour — one hue, four surfaces". The only hex permitted. */
const LOCKED_PALETTE = new Set([
  "#F6F7F2", // paper
  "#FFFFFF", // white
  "#11130F", // ink
  "#343731", // ink secondary
  "#6A6E66", // muted
  "#D7FF00", // acid
  "#2457FF", // focus
  "#B42318", // functional error
  "#2D6A4F", // functional success
  "#9A9E96", // muted on ink — 6.9:1, where plain muted would be 3.6:1
]);

/**
 * Depth is two tokens and nothing else. A box-shadow is permitted only when its
 * value is one of them; any other shadow, anywhere, fails. --shadow-object is
 * for an information object on top of a colour block, --shadow-overlay for the
 * menu. Where either is used is a review question; that it is one of these two
 * is not.
 */
const SHADOW_TOKENS = ["--shadow-object", "--shadow-overlay"];

/** Radius ceiling in px. Buttons 2px, objects 8px, section panels 12px. */
const MAX_RADIUS_PX = 12;

/**
 * Illustration is line art, inline SVG, never raster. Photography of real
 * people is a separate permission and lives outside the illustration layer, so
 * this is scoped to it rather than banning raster site-wide.
 */
const ILLUSTRATION_DIR = "components/plates";
const RASTER = /\.(png|jpe?g|gif|webp|avif|bmp|tiff?)\b/i;

/**
 * An illustration may not draw a tax fact. CLAUDE.md rule 3 covers SVG
 * explicitly: no date, no amount, no rate inside a drawing.
 */
const SVG_TAX_PATTERNS = [
  [/\b\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i, "a date"],
  [/\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2}\b/i, "a date"],
  [/\b\d{4}-\d{2}-\d{2}\b/, "a date"],
  [/(?:₹|\bRs\.?\s*|\bINR\s+)\s*\d/i, "a rupee amount"],
  [/\d\s*%/, "a percentage"],
  [/\d\s*(?:per\s*cent|percent)\b/i, "a percentage"],
];

/** Weights at or above this are not brand styling. */
const MAX_FONT_WEIGHT = 600;

/** CLAUDE.md rule 6, longest first so overlapping matches report once. */
const BANNED_PHRASES = [
  /india(?:'|\u2019|&apos;|&#39;|&rsquo;)?s\s+(?:#\s*1|no\.?\s*1|number\s+one|largest|most\s+trusted)/i,
  /\d+\s*\+\s*(?:certified\s+)?professionals/i,
  /focus\s+on\s+your\s+growth/i,
  /no\s+hidden\s+charges/i,
  /transparent\s+pricing/i,
  /starting\s+at\s+₹?\s*\d/i,
  /file\s+in\s+minutes/i,
  /maximum\s+refund/i,
  /one-stop\s+shop/i,
  /expert\s+CAs?\b/i,
  /\bhassle-free\b/i,
  /\bAI-powered\b/i,
  /\b100%\s+online\b/i,
  /\ball-in-one\b/i,
  /\bend-to-end\b/i,
  /\bpaperwork\b/i,
  /\btedious\b/i,
  /\bboring\b/i,
  /\bhassle\b/i,
];

/** "Do not call tax rules simple or easy" — only flagged near a tax word. */
const TRIVIALISING = /\b(simple|easy)\b/i;
const TAX_WORD = /\b(tax|taxes|GST|TDS|compliance|filing|filings|returns?|rules?)\b/i;

/** Money written into a component instead of lib/content/. */
const RUPEE_AMOUNT = /(?:₹|\bRs\.?\s*|\bINR\s+)\s*\d[\d,]*/;

/**
 * Foreign currency. Every price on the site is INR and renders through the
 * shared formatter in lib/content/format.ts. The one permitted dollar figure is
 * the illustrative amount inside the incoming payment object — money arriving
 * from abroad, which is the whole point of that object.
 *
 * `$` followed by a digit, so template interpolation (`${...}`) and regex
 * backreferences (`$1` inside a replacement string) do not trip it.
 */
const FOREIGN_CURRENCY = /\$\s*\d|\bUSD\b/;

/**
 * The one shape a dollar amount may take: the `amount` field of an incoming
 * payment, declared in lib/content/. Anywhere else, in any file, it fails.
 */
const PAYMENT_AMOUNT_FIELD = /^\s*(?:\/\*.*\*\/\s*)?amount:\s*"/;

/**
 * The one other permitted shape: the currency declaration of the formatter that
 * renders the incoming payment object's own figure while it counts up. It is
 * allowed in lib/content/format.ts and nowhere else, so a second foreign
 * formatter cannot appear anywhere on the site without failing this check.
 */
const PAYMENT_CURRENCY_FILE = "lib/content/format.ts";
const PAYMENT_CURRENCY_FIELD = /^\s*currency:\s*"USD",?\s*$/;

/**
 * Nothing on this site loops. Motion is one pass, on first sight, and then it
 * stops — CLAUDE.md's motion rules and every item in the flair spec depend on
 * it, so an infinite iteration count fails the build.
 */
const INFINITE_ANIMATION = /animation-iteration-count\s*:\s*infinite|animation\s*:[^;}\n]*\binfinite\b/i;

/**
 * A placeholder guide is written to show the shape of the library, not to
 * answer anything. It must be impossible to mistake for reviewed guidance, so
 * it may not state a tax fact of any kind: no thresholds, no dates, no rates,
 * no rules, and no telling the reader what they must or should do.
 */
const TAX_CLAIM_PATTERNS = [
  [/(?:₹|\bRs\.?\s*|\bINR\s+)\s*\d/i, "a rupee amount"],
  [/\b\d[\d,.]*\s*(?:lakh|crore|lakhs|crores)\b/i, "a lakh or crore figure"],
  [/\b\d+(?:\.\d+)?\s*(?:%|per\s*cent|percent)/i, "a rate"],
  [/\b\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i, "a date"],
  [/\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2}\b/i, "a date"],
  [/\b\d{4}-\d{2}-\d{2}\b/, "a date"],
  [/\bFY\s*\d{2}/i, "a financial year"],
  [/\bsection\s+\d+/i, "a statutory reference"],
  [/\b44A[DB]A?\b/i, "a statutory reference"],
  [/\byou\s+(?:must|should|need\s+to|have\s+to|are\s+required)\b/i, "an instruction to the reader"],
  [/\byou'?ll\s+need\s+to\b/i, "an instruction to the reader"],
  [/\b(?:is|are)\s+(?:mandatory|compulsory|required\s+by)\b/i, "a statement of obligation"],
  [/\bthreshold\s+(?:of|is)\b/i, "a threshold"],
  [/\b(?:due\s+date|deadline)\s+(?:is|of|falls)\b/i, "a due date"],
];

const violations = [];

function report(file, line, rule, message, snippet) {
  violations.push({
    file: path.relative(ROOT, file),
    line,
    rule,
    message,
    snippet: snippet.trim().slice(0, 120),
  });
}

async function collectFiles(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return []; // directory does not exist yet
  }

  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
      files.push(...(await collectFiles(full)));
    } else if (SCAN_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(full);
    }
  }
  return files;
}

/**
 * Walks a stylesheet tracking the open selector stack so a declaration can be
 * attributed to the rule that contains it. Returns a lookup from character
 * index to the enclosing selector text.
 */
function buildSelectorIndex(text) {
  const stackAt = new Array(text.length);
  const stack = [];
  let pending = "";
  let current = "";

  for (let i = 0; i < text.length; i += 1) {
    stackAt[i] = current;
    const char = text[i];

    if (char === "{") {
      stack.push(pending.trim());
      current = stack.join(" ");
      pending = "";
    } else if (char === "}") {
      stack.pop();
      current = stack.join(" ");
      pending = "";
    } else if (char === ";") {
      pending = "";
    } else {
      pending += char;
    }
  }

  return (index) => stackAt[index] ?? "";
}

function lineNumberAt(text, index) {
  let line = 1;
  for (let i = 0; i < index; i += 1) {
    if (text[i] === "\n") line += 1;
  }
  return line;
}

function lineTextAt(lines, lineNumber) {
  return lines[lineNumber - 1] ?? "";
}

/** Strips values that resolve through tokens, which are checked at source. */
function isTokenReference(value) {
  return /var\(--/.test(value);
}

function checkFile(file) {
  const text = readFileSync(file, "utf8");
  const lines = text.split("\n");
  const isCss = path.extname(file) === ".css";
  const selectorAt = isCss ? buildSelectorIndex(text) : () => "";
  const relative = path.relative(ROOT, file);
  const inContentDir = relative.split(path.sep).slice(0, 2).join("/") === "lib/content";

  const at = (index) => {
    const line = lineNumberAt(text, index);
    return { line, text: lineTextAt(lines, line) };
  };

  // --- box-shadow outside an allowlisted overlay surface ---
  for (const match of text.matchAll(/box-shadow\s*:\s*([^;}\n]+)/gi)) {
    const { line, text: lineText } = at(match.index);
    const value = match[1].trim();
    if (/^none\b/i.test(value)) continue;

    /* The only permitted values are the two tokens. Anything else — a literal
       shadow, a third token, a tweak of one of these — fails. */
    const allowed = SHADOW_TOKENS.some((token) =>
      new RegExp(`var\\(\\s*${token}\\s*[,)]`).test(value),
    );
    if (!allowed) {
      report(
        file,
        line,
        "box-shadow",
        `Depth is ${SHADOW_TOKENS.join(" and ")} and nothing else. ` +
          "Objects on paper stay flat, and no ruled row, table, text block, " +
          "pricing column or section container takes a shadow at all.",
        lineText,
      );
    }
  }

  // --- gradients ---
  for (const match of text.matchAll(/\b(linear-gradient|radial-gradient|conic-gradient)\s*\(/gi)) {
    const { line, text: lineText } = at(match.index);
    report(file, line, "gradient", `${match[1]} is not part of the visual system.`, lineText);
  }

  // --- radius ceiling ---
  for (const match of text.matchAll(/border(?:-[a-z]+)*-radius\s*:\s*([^;}\n]+)/gi)) {
    const { line, text: lineText } = at(match.index);
    const value = match[1];
    if (isTokenReference(value)) continue;

    for (const px of value.matchAll(/(\d*\.?\d+)px/g)) {
      const size = Number.parseFloat(px[1]);
      if (size > MAX_RADIUS_PX) {
        report(
          file,
          line,
          "border-radius",
          `${size}px exceeds the ${MAX_RADIUS_PX}px ceiling. Buttons and inputs ` +
            "are 2px, information objects 8px, section panels 12px.",
          lineText,
        );
        break;
      }
    }
  }

  // --- font weight ceiling ---
  for (const match of text.matchAll(/font-weight\s*:\s*([^;}\n]+)/gi)) {
    const { line, text: lineText } = at(match.index);
    const value = match[1].trim();
    if (isTokenReference(value)) continue;

    const numeric = Number.parseInt(value, 10);
    const isBoldKeyword = /^(bold|bolder)\b/i.test(value);
    if (isBoldKeyword || (Number.isFinite(numeric) && numeric > MAX_FONT_WEIGHT)) {
      report(
        file,
        line,
        "font-weight",
        `Weight ${value} is above ${MAX_FONT_WEIGHT}. Geist 400 dominant, 500 UI, 600 rare.`,
        lineText,
      );
    }
  }

  // next/font weight arrays, e.g. weight: ["400", "700"]
  for (const match of text.matchAll(/weight\s*:\s*\[([^\]]+)\]/g)) {
    const { line, text: lineText } = at(match.index);
    for (const weight of match[1].matchAll(/\d{3}/g)) {
      if (Number.parseInt(weight[0], 10) > MAX_FONT_WEIGHT) {
        report(
          file,
          line,
          "font-weight",
          `next/font is loading weight ${weight[0]}, above the ${MAX_FONT_WEIGHT} ceiling.`,
          lineText,
        );
        break;
      }
    }
  }

  // --- palette ---
  for (const match of text.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
    const raw = match[0];
    let normalised = raw.toUpperCase();
    if (normalised.length === 4) {
      normalised = `#${normalised[1].repeat(2)}${normalised[2].repeat(2)}${normalised[3].repeat(2)}`;
    }
    if (LOCKED_PALETTE.has(normalised)) continue;

    const { line, text: lineText } = at(match.index);
    report(
      file,
      line,
      "palette",
      `${raw} is not in the locked palette. Use a token from MASTER_BUILD_SPEC.md §4.`,
      lineText,
    );
  }

  // --- rupee amounts outside lib/content/ ---
  if (!inContentDir) {
    for (const match of text.matchAll(new RegExp(RUPEE_AMOUNT, "g"))) {
      const { line, text: lineText } = at(match.index);
      report(
        file,
        line,
        "hardcoded-price",
        `"${match[0].trim()}" must live in lib/content/, not in a component.`,
        lineText,
      );
    }
  }

  // --- foreign currency outside the incoming payment object ---
  for (const match of text.matchAll(new RegExp(FOREIGN_CURRENCY, "g"))) {
    const { line, text: lineText } = at(match.index);
    const permitted =
      inContentDir &&
      (PAYMENT_AMOUNT_FIELD.test(lineText) ||
        (relative.split(path.sep).join("/") === PAYMENT_CURRENCY_FILE &&
          PAYMENT_CURRENCY_FIELD.test(lineText)));
    if (permitted) continue;

    report(
      file,
      line,
      "foreign-currency",
      `"${match[0].trim()}" — every price is INR through lib/content/format.ts. ` +
        "The only permitted dollar amount is the incoming payment object's own " +
        "`amount` field in lib/content/.",
      lineText,
    );
  }

  // --- raster in the illustration layer ---
  if (relative.split(path.sep).join("/").startsWith(ILLUSTRATION_DIR)) {
    for (const match of text.matchAll(new RegExp(RASTER, "gi"))) {
      const { line, text: lineText } = at(match.index);
      report(
        file,
        line,
        "raster-illustration",
        `Illustration is inline SVG line art, never raster (${match[0]}).`,
        lineText,
      );
    }
  }

  // --- muted text inside an ink surface ---
  if (isCss) {
    for (const match of text.matchAll(/var\(\s*--muted\s*[,)]/g)) {
      const selector = selectorAt(match.index);
      if (!/\bsurface-ink\b/.test(selector)) continue;
      const { line, text: lineText } = at(match.index);
      report(
        file,
        line,
        "muted-on-ink",
        "--muted on ink is 3.6:1 and fails AA. Use --muted-on-ink, which is 6.9:1.",
        lineText,
      );
    }
  }

  /* --- more than one ink or acid block declared in a single file ---
     The styleguide is exempt, for the same reason it is exempt from the
     runtime check: it renders every primitive on all four surfaces, several
     times over, which is the point of it. The rule is about how a composed
     page is built, and a specimen sheet is not one. */
  const isSpecimenSheet =
    relative.split(path.sep).join("/") === "app/styleguide/page.tsx";

  for (const surface of isSpecimenSheet ? [] : ["surface-ink", "surface-acid"]) {
    const uses = [...text.matchAll(new RegExp(`["'\\s]${surface}["'\\s]`, "g"))];
    if (uses.length <= 1) continue;
    const { line, text: lineText } = at(uses[1].index);
    report(
      file,
      line,
      "colour-block-count",
      `A page carries at most one ${surface} block; this file declares ${uses.length}.`,
      lineText,
    );
  }

  // --- an illustration may not draw a tax fact ---
  for (const svg of text.matchAll(/<svg\b[\s\S]*?<\/svg>/gi)) {
    for (const [pattern, what] of SVG_TAX_PATTERNS) {
      const hit = svg[0].match(pattern);
      if (!hit) continue;
      const { line, text: lineText } = at(svg.index + (hit.index ?? 0));
      report(
        file,
        line,
        "svg-tax-fact",
        `An illustration may not draw ${what} — CLAUDE.md rule 3 covers SVG explicitly.`,
        lineText,
      );
    }
  }

  // --- looping animation ---
  lines.forEach((lineText, index) => {
    if (!INFINITE_ANIMATION.test(lineText)) return;
    report(
      file,
      index + 1,
      "looping-animation",
      "Motion on this site is one pass. Nothing loops, so an infinite " +
        "iteration count is never correct.",
      lineText,
    );
  });

  // --- banned phrases ---
  lines.forEach((lineText, index) => {
    const claimed = [];
    const overlaps = (start, end) =>
      claimed.some(([from, to]) => start < to && end > from);

    for (const pattern of BANNED_PHRASES) {
      const match = lineText.match(pattern);
      if (!match || match.index === undefined) continue;

      const start = match.index;
      const end = start + match[0].length;
      if (overlaps(start, end)) continue;
      claimed.push([start, end]);

      report(
        file,
        index + 1,
        "banned-phrase",
        `"${match[0].trim()}" is banned by CLAUDE.md rule 6.`,
        lineText,
      );
    }

    const trivialising = lineText.match(TRIVIALISING);
    if (trivialising && TAX_WORD.test(lineText)) {
      report(
        file,
        index + 1,
        "banned-phrase",
        `Do not call tax rules "${trivialising[0]}".`,
        lineText,
      );
    }
  });
}

/**
 * Reads frontmatter without a parser: only `status` matters here, and pulling
 * in a dependency for one field would be worse than a regex.
 */
function checkGuide(file) {
  const text = readFileSync(file, "utf8");
  const frontmatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);

  if (!frontmatter) {
    report(file, 1, "guide-frontmatter", "A guide needs frontmatter with a status.", "");
    return;
  }

  const status = frontmatter[1].match(/^status:\s*["']?([a-z]+)/m)?.[1];

  if (status !== "placeholder" && status !== "reviewed") {
    report(file, 1, "guide-frontmatter", 'status must be "placeholder" or "reviewed".', "");
    return;
  }

  if (status !== "placeholder") return;

  const body = text.slice(frontmatter[0].length);
  const offset = text.slice(0, frontmatter[0].length).split("\n").length - 1;

  body.split("\n").forEach((lineText, index) => {
    for (const [pattern, description] of TAX_CLAIM_PATTERNS) {
      const match = lineText.match(pattern);
      if (!match) continue;

      report(
        file,
        offset + index + 1,
        "placeholder-guide",
        `A placeholder guide must state no tax fact, and this contains ${description} ("${match[0].trim()}").`,
        lineText,
      );
      break;
    }
  });
}

async function main() {
  const files = (
    await Promise.all(SCAN_DIRS.map((dir) => collectFiles(path.join(ROOT, dir))))
  ).flat();

  files.forEach(checkFile);

  const guideFiles = (await collectFiles(path.join(ROOT, GUIDES_DIR))).filter((file) =>
    file.endsWith(".mdx"),
  );

  guideFiles.forEach(checkGuide);
  files.push(...guideFiles);

  if (violations.length === 0) {
    console.log(`guardrails: ${files.length} files scanned, no violations.`);
    return;
  }

  violations.sort(
    (a, b) => a.file.localeCompare(b.file) || a.line - b.line || a.rule.localeCompare(b.rule),
  );

  for (const violation of violations) {
    console.error(`${violation.file}:${violation.line}  [${violation.rule}] ${violation.message}`);
    console.error(`    ${violation.snippet}`);
  }

  const plural = violations.length === 1 ? "violation" : "violations";
  console.error(`\nguardrails: ${violations.length} ${plural} across ${files.length} files scanned.`);
  process.exitCode = 1;
}

await main();
