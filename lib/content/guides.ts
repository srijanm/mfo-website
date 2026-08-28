import "server-only";

import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

import matter from "gray-matter";

/**
 * Guides are MDX files in content/guides, so posts can be added without
 * touching a component.
 *
 * `placeholder` means written to show the shape of the library, not reviewed
 * guidance. Those posts state no tax fact, are excluded from the index in
 * production, and render a notice and a noindex tag. `reviewed` means a CA has
 * checked it and it carries the date they did.
 */
export type GuideStatus = "placeholder" | "reviewed";

export type GuideMeta = {
  slug: string;
  title: string;
  /** The answer in one sentence, shown on the index row. */
  answer: string;
  /** Shown only where it tells the reader something. */
  audience: string | null;
  status: GuideStatus;
  published: string | null;
  /** ISO date. Required for anything touching tax or compliance. */
  lastReviewed: string | null;
};

export type Guide = GuideMeta & { body: string };

const GUIDES_DIR = path.join(process.cwd(), "content", "guides");

/** A TOC earns its place only once a guide has enough sections to need one. */
const TOC_MIN_HEADINGS = 4;

function optionalString(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" && value !== "null"
    ? value.trim()
    : null;
}

function readGuide(fileName: string): Guide {
  const raw = readFileSync(path.join(GUIDES_DIR, fileName), "utf8");
  const { data, content } = matter(raw);
  const slug = fileName.replace(/\.mdx?$/, "");

  const status: GuideStatus = data.status === "reviewed" ? "reviewed" : "placeholder";

  return {
    slug,
    title: String(data.title ?? slug),
    answer: String(data.answer ?? ""),
    audience: optionalString(data.audience),
    status,
    published: optionalString(data.published),
    lastReviewed: optionalString(data.lastReviewed),
    body: content,
  };
}

function allGuides(): Guide[] {
  let files: string[];
  try {
    files = readdirSync(GUIDES_DIR).filter((file) => file.endsWith(".mdx"));
  } catch {
    return [];
  }

  return files.map(readGuide).sort((a, b) => a.title.localeCompare(b.title));
}

/**
 * Placeholders are visible while developing so they can be reviewed, and gone
 * from the index in a production build so nobody finds one by browsing.
 */
export function listedGuides(): GuideMeta[] {
  const showPlaceholders = process.env.NODE_ENV !== "production";
  return allGuides().filter((guide) => showPlaceholders || guide.status === "reviewed");
}

/** Every guide, including placeholders — their routes still resolve. */
export function guideSlugs(): string[] {
  return allGuides().map((guide) => guide.slug);
}

export function guideBySlug(slug: string): Guide | undefined {
  return allGuides().find((guide) => guide.slug === slug);
}

export function guideHeadings(body: string): { id: string; text: string }[] {
  return [...body.matchAll(/^##\s+(.+)$/gm)].map((match) => {
    const text = match[1].trim();
    return {
      id: text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
      text,
    };
  });
}

export function shouldShowToc(body: string): boolean {
  return guideHeadings(body).length >= TOC_MIN_HEADINGS;
}

export const guidesIndex = {
  title: "Guides",
  lead: "Straight answers to the questions people actually ask about earning outside a normal Indian payroll setup.",
  pending:
    "The first guides are being written and reviewed. Anything here that touches tax or compliance will carry the date it was last checked.",
  lastReviewedLabel: "Last reviewed",
  publishedLabel: "Published",
  tocLabel: "On this page",
  placeholder: {
    label: "Placeholder",
    body: "This is not reviewed guidance. It describes how MyFinanceOfficer works and states nothing about tax, compliance or what applies to you. Nothing here should be relied on.",
  },
} as const;
