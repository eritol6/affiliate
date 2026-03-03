import fs from "node:fs";
import path from "node:path";

import type { ContentDoc, Merchant, Product } from "../types/content.ts";

type LegacyFrontmatter = {
  title: string;
  slug: string;
  description: string;
  date: string;
  lastUpdated?: string;
  category: string[];
  tags?: string[];
  intent?: string;
  products: Product[];
  ogImage?: string;
};

const MERCHANTS = new Set<Merchant>(["amazon", "walmart", "target", "other"]);
const PLACEHOLDER_PATTERN = /(B0EXAMPLE|\/ip\/example|example\.com|example-|example_)/i;
const TRACK_PARAM_PATTERN = /(?:^|[?&])(tag|ascsubtag)=/i;

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function validateDateString(value: string, field: string, context: string) {
  const parsed = Date.parse(value);
  assert(Number.isFinite(parsed), `${context}: ${field} must be a valid date string.`);
}

function validateProduct(product: unknown, context: string, index: number) {
  const p = product as Product;
  const prefix = `${context}: products[${index}]`;

  assert(isNonEmptyString(p.name), `${prefix}.name is required.`);
  assert(MERCHANTS.has(p.merchant), `${prefix}.merchant must be one of amazon|walmart|target|other.`);
  assert(typeof p.url === "string", `${prefix}.url must be a string.`);
  assert(isNonEmptyString(p.priceRange), `${prefix}.priceRange is required.`);
  assert(typeof p.score === "number" || typeof p.rating === "number", `${prefix}.score (or legacy .rating) must be a number.`);
  assert(isNonEmptyString(p.bestFor), `${prefix}.bestFor is required.`);
  assert(Array.isArray(p.pros), `${prefix}.pros must be an array.`);
  assert(Array.isArray(p.cons), `${prefix}.cons must be an array.`);
  assert(isNonEmptyString(p.image), `${prefix}.image is required.`);

  if (p.url.trim().length > 0) {
    try {
      const parsed = new URL(p.url);
      assert(parsed.protocol === "https:" || parsed.protocol === "http:", `${prefix}.url must use http/https.`);
      if (TRACK_PARAM_PATTERN.test(parsed.search)) {
        assert(p.merchant === "amazon", `${prefix}.url may include tracking params only for merchant=amazon.`);
      }
      assert(!PLACEHOLDER_PATTERN.test(p.url), `${prefix}.url contains placeholder token(s).`);
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error(`${prefix}.url must be a valid absolute URL.`);
      }
      throw error;
    }
  }

  if (p.image.startsWith("/")) {
    const expectedPath = path.join(process.cwd(), "public", p.image.replace(/^\//, ""));
    assert(fs.existsSync(expectedPath), `${prefix}.image missing file at public path: ${p.image}`);
  }
}

export function validateFrontmatter(frontmatter: unknown, context: string): LegacyFrontmatter {
  const fm = frontmatter as LegacyFrontmatter;

  assert(isNonEmptyString(fm.title), `${context}: title is required.`);
  assert(isNonEmptyString(fm.slug), `${context}: slug is required.`);
  assert(isNonEmptyString(fm.description), `${context}: description is required.`);
  assert(isNonEmptyString(fm.date), `${context}: date is required.`);
  assert(Array.isArray(fm.category), `${context}: category must be an array.`);
  assert(fm.tags === undefined || Array.isArray(fm.tags), `${context}: tags must be an array when provided.`);
  assert(Array.isArray(fm.products), `${context}: products must be an array.`);

  assert(fm.category.length > 0, `${context}: category cannot be empty.`);

  validateDateString(fm.date, "date", context);
  if (fm.lastUpdated) {
    validateDateString(fm.lastUpdated, "lastUpdated", context);
  }

  fm.products.forEach((product, index) => validateProduct(product, context, index));

  if (fm.ogImage) {
    assert(isNonEmptyString(fm.ogImage), `${context}: ogImage must be a non-empty string when provided.`);
    if (fm.ogImage.startsWith("/")) {
      const expectedPath = path.join(process.cwd(), "public", fm.ogImage.replace(/^\//, ""));
      assert(fs.existsSync(expectedPath), `${context}: ogImage missing file at public path ${fm.ogImage}`);
    }
  }

  return fm;
}

export function validateUniqueSlugs(docs: ContentDoc[]) {
  const seen = new Map<string, string>();

  docs.forEach((doc) => {
    const key = doc.frontmatter.slug;
    const currentPath = `${doc.type}/${doc.frontmatter.slug}`;
    const existing = seen.get(key);
    if (existing) {
      throw new Error(`[content] Duplicate slug detected: "${key}" used in ${existing} and ${currentPath}`);
    }
    seen.set(key, currentPath);
  });
}

export function assertContentIntegrity(docs: ContentDoc[]) {
  validateUniqueSlugs(docs);
}

export function normalizeDateInput(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return String(value ?? "");
}

export function isPlaceholderUrl(url: string): boolean {
  return PLACEHOLDER_PATTERN.test(url);
}

export function hasDisallowedTrackingParams(url: string): boolean {
  try {
    const parsed = new URL(url);
    return TRACK_PARAM_PATTERN.test(parsed.search);
  } catch {
    return false;
  }
}
