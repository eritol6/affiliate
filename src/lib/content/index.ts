import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import { z } from "zod";

import type { ContentDoc, LegacyFrontmatter, ParsedFrontmatter, Product, RouteContentType, SearchEntry } from "@/types/content";

const contentDir = path.join(process.cwd(), "content", "guides");
const DATE_ISO_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const productSchema = z.object({
  name: z.string().min(1),
  merchant: z.enum(["amazon", "walmart", "target", "other"]),
  url: z.string(),
  priceRange: z.string().min(1),
  weightRange: z.string().optional(),
  incrementSize: z.string().optional(),
  adjustmentSpeed: z.string().optional(),
  score: z.number().optional(),
  rating: z.number().optional(),
  bestFor: z.string().min(1),
  footprint: z.string().optional(),
  ceilingHeight: z.string().optional(),
  resistanceType: z.string().optional(),
  maxResistance: z.string().optional(),
  pros: z.array(z.string()),
  cons: z.array(z.string()),
  image: z.string().min(1),
  specs: z.array(z.string()).optional(),
});

const canonicalFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string().regex(DATE_ISO_PATTERN, "date must be ISO (YYYY-MM-DD)."),
  category: z.string().min(1),
  affiliateDisclosure: z.boolean(),
  products: z.array(z.string().min(1)).min(1),
  type: z.enum(["guide", "comparison", "review"]),
  slug: z.string().optional(),
  lastUpdated: z.string().optional(),
  tags: z.array(z.string().min(1)).optional(),
  featured: z.boolean().optional(),
  popularScore: z.number().optional(),
  sources: z.array(z.string()).optional(),
  ogImage: z.string().optional(),
});

type ContentIndex = {
  all: ContentDoc[];
  bySlug: Map<string, ContentDoc>;
};

let cachedIndex: ContentIndex | null = null;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeDateLike(value: unknown): string | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value === "string") return value.trim();
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value);
}

function normalizeCategory(value: unknown): string {
  if (typeof value === "string" && value.trim().length > 0) return value.trim();
  if (Array.isArray(value) && value.length > 0) {
    const first = value.find((item) => typeof item === "string" && item.trim().length > 0);
    if (typeof first === "string") return first.trim();
  }
  throw new Error("category is required and must be a non-empty string.");
}

function normalizeProductData(value: unknown): { productData: Product[]; productNames: string[] } {
  if (!Array.isArray(value)) {
    throw new Error("products is required and must be an array.");
  }

  if (value.length === 0) {
    return { productData: [], productNames: [] };
  }

  const first = value[0];
  if (typeof first === "string") {
    const productNames = value.map((item) => String(item).trim()).filter(Boolean);
    return { productData: [], productNames };
  }

  const parsedProducts = z.array(productSchema).parse(value);
  const productNames = parsedProducts.map((product) => product.name);
  return { productData: parsedProducts, productNames };
}

function normalizeRawFrontmatter(raw: unknown, filenameSlug: string): ParsedFrontmatter &
  Pick<LegacyFrontmatter, "featured" | "popularScore" | "sources" | "ogImage"> {
  if (!isObject(raw)) {
    throw new Error("frontmatter is missing or malformed.");
  }

  const productPayload = normalizeProductData(raw.products);
  const normalized = {
    title: String(raw.title ?? "").trim(),
    description: String(raw.description ?? "").trim(),
    date: normalizeDateLike(raw.date) ?? "",
    category: normalizeCategory(raw.category),
    affiliateDisclosure: raw.affiliateDisclosure,
    products: productPayload.productNames,
    type: raw.type,
    slug: typeof raw.slug === "string" ? raw.slug.trim() : undefined,
    lastUpdated: normalizeDateLike(raw.lastUpdated),
    tags: Array.isArray(raw.tags) ? raw.tags.map((tag) => String(tag).trim()).filter(Boolean) : undefined,
    featured: typeof raw.featured === "boolean" ? raw.featured : undefined,
    popularScore: typeof raw.popularScore === "number" ? raw.popularScore : undefined,
    sources: Array.isArray(raw.sources) ? raw.sources.map((source) => String(source)) : undefined,
    ogImage: typeof raw.ogImage === "string" ? raw.ogImage : undefined,
  };

  const validated = canonicalFrontmatterSchema.parse(normalized);
  if (validated.products.length === 0) {
    throw new Error("products must include at least one product name.");
  }

  return {
    ...validated,
    slug: validated.slug ?? filenameSlug,
    tags: validated.tags ?? [],
    productData: productPayload.productData,
  };
}

function parseDoc(filename: string): ContentDoc {
  const fullPath = path.join(contentDir, filename);
  const slug = filename.replace(/\.mdx$/, "");
  const source = fs.readFileSync(fullPath, "utf8");
  const parsed = matter(source);

  try {
    const frontmatter = normalizeRawFrontmatter(parsed.data, slug);
    if (frontmatter.slug !== slug) {
      throw new Error(`slug frontmatter must match filename "${slug}".`);
    }
    return {
      type: frontmatter.type,
      frontmatter,
      body: parsed.content,
    };
  } catch (error) {
    const message = error instanceof z.ZodError ? error.issues.map((issue) => issue.message).join("; ") : (error as Error).message;
    throw new Error(`[content] ${path.relative(process.cwd(), fullPath)}: ${message}`);
  }
}

function sortByDateDesc(a: ContentDoc, b: ContentDoc) {
  const aDate = Date.parse(a.frontmatter.lastUpdated ?? a.frontmatter.date);
  const bDate = Date.parse(b.frontmatter.lastUpdated ?? b.frontmatter.date);
  return (Number.isNaN(bDate) ? 0 : bDate) - (Number.isNaN(aDate) ? 0 : aDate);
}

function buildIndex(): ContentIndex {
  if (!fs.existsSync(contentDir)) {
    return {
      all: [],
      bySlug: new Map(),
    };
  }

  const files = fs
    .readdirSync(contentDir)
    .filter((file) => file.endsWith(".mdx"))
    .sort();
  const docs = files.map(parseDoc).sort(sortByDateDesc);
  const bySlug = new Map<string, ContentDoc>();

  for (const doc of docs) {
    if (bySlug.has(doc.frontmatter.slug)) {
      throw new Error(`[content] Duplicate slug detected: "${doc.frontmatter.slug}".`);
    }
    bySlug.set(doc.frontmatter.slug, doc);
  }

  return {
    all: docs,
    bySlug,
  };
}

function getIndex(): ContentIndex {
  if (process.env.NODE_ENV === "development") {
    return buildIndex();
  }

  if (!cachedIndex) {
    cachedIndex = buildIndex();
  }

  return cachedIndex;
}

export function getAllContent(): ContentDoc[] {
  return getIndex().all;
}

export function getContentBySlug(slug: string): ContentDoc | null {
  return getIndex().bySlug.get(slug) ?? null;
}

export function getGuides(): ContentDoc[] {
  return getAllContent().filter((doc) => doc.type === "guide");
}

export function getComparisons(): ContentDoc[] {
  return getAllContent().filter((doc) => doc.type === "comparison");
}

export function getReviews(): ContentDoc[] {
  return getAllContent().filter((doc) => doc.type === "review");
}

export function getSearchIndex(): SearchEntry[] {
  return getAllContent().map((doc) => ({
    type: doc.type,
    title: doc.frontmatter.title,
    slug: doc.frontmatter.slug,
    description: doc.frontmatter.description,
    category: doc.frontmatter.category,
    tags: doc.frontmatter.tags,
    date: doc.frontmatter.date,
    url: `/guides/${doc.frontmatter.slug}`,
  }));
}

export function getFeaturedGuides() {
  const featuredByTag = getGuides().filter((doc) => doc.frontmatter.tags.includes("featured"));
  if (featuredByTag.length > 0) {
    return featuredByTag.slice(0, 4);
  }

  return getGuides().slice(0, 4);
}

export function getLatestGuides(limit = 6) {
  return getGuides().slice(0, limit);
}

export function getDocsByType(type: RouteContentType): ContentDoc[] {
  if (type === "guides") return getGuides();
  if (type === "reviews") return getReviews();
  if (type === "compare") return getComparisons();
  return [];
}
