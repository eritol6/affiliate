import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

import { assertContentIntegrity, normalizeDateInput, validateFrontmatter } from "./content-validation.ts";
import type { BaseFrontmatter, ContentDoc, ContentType, SearchEntry } from "../types/content.ts";

const contentRoot = path.join(process.cwd(), "content");

const typeToRoute: Record<ContentType, string> = {
  guides: "/guides",
  reviews: "/reviews",
  compare: "/compare",
  category: "/category",
};

type ContentIndex = {
  byType: Record<ContentType, ContentDoc[]>;
  allDocs: ContentDoc[];
};

let cachedIndex: ContentIndex | null = null;

function readDir(type: ContentType) {
  const dir = path.join(contentRoot, type);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((file) => file.endsWith(".mdx"));
}

function toDoc(type: ContentType, filename: string): ContentDoc {
  const fullPath = path.join(contentRoot, type, filename);

  let source = "";
  try {
    source = fs.readFileSync(fullPath, "utf8");
  } catch (error) {
    console.error(`[content] Failed reading file: ${fullPath}`);
    throw error;
  }

  let parsed: matter.GrayMatterFile<string>;
  try {
    parsed = matter(source);
  } catch (error) {
    console.error(`[content] Failed parsing frontmatter: ${fullPath}`);
    throw error;
  }

  const context = `${type}/${filename}`;
  const validated = validateFrontmatter(
    {
      ...(parsed.data as BaseFrontmatter),
      date: normalizeDateInput((parsed.data as BaseFrontmatter).date),
      lastUpdated: normalizeDateInput((parsed.data as BaseFrontmatter).lastUpdated),
    },
    context,
  );

  const expectedSlug = filename.replace(/\.mdx$/, "");
  if (validated.slug !== expectedSlug) {
    throw new Error(`[content] ${context}: slug frontmatter must match filename slug (${expectedSlug}).`);
  }

  return {
    type,
    frontmatter: validated,
    body: parsed.content,
  };
}

function sortByDateDesc(a: ContentDoc, b: ContentDoc) {
  return a.frontmatter.date > b.frontmatter.date ? -1 : 1;
}

function buildContentIndex(): ContentIndex {
  const types: ContentType[] = ["guides", "reviews", "compare", "category"];

  const byType = {
    guides: [] as ContentDoc[],
    reviews: [] as ContentDoc[],
    compare: [] as ContentDoc[],
    category: [] as ContentDoc[],
  };

  for (const type of types) {
    byType[type] = readDir(type).map((filename) => toDoc(type, filename)).sort(sortByDateDesc);
  }

  const allDocs = types.flatMap((type) => byType[type]);
  assertContentIntegrity(allDocs);

  return {
    byType,
    allDocs,
  };
}

export function getContentIndex() {
  if (process.env.NODE_ENV === "development") {
    return buildContentIndex();
  }

  if (!cachedIndex) {
    cachedIndex = buildContentIndex();
  }

  return cachedIndex;
}

export function getDocsByType(type: ContentType): ContentDoc[] {
  return getContentIndex().byType[type];
}

export function getDocBySlug(type: ContentType, slug: string): ContentDoc | null {
  return getDocsByType(type).find((doc) => doc.frontmatter.slug === slug) ?? null;
}

export function getAllDocs() {
  return getContentIndex().allDocs;
}

export function getSearchIndex(): SearchEntry[] {
  return getAllDocs().map((doc) => ({
    type: doc.type,
    title: doc.frontmatter.title,
    slug: doc.frontmatter.slug,
    description: doc.frontmatter.description,
    category: doc.frontmatter.category,
    tags: doc.frontmatter.tags,
    date: doc.frontmatter.date,
    url: `${typeToRoute[doc.type]}/${doc.frontmatter.slug}`,
  }));
}

export function getFeaturedGuides() {
  return getDocsByType("guides").filter((guide) => guide.frontmatter.featured).slice(0, 4);
}

export function getLatestGuides(limit = 6) {
  return getDocsByType("guides").slice(0, limit);
}

export function getCategoryDocs(slug: string) {
  const guides = getDocsByType("guides").filter((doc) => doc.frontmatter.category.includes(slug));
  const reviews = getDocsByType("reviews").filter((doc) => doc.frontmatter.category.includes(slug));
  const comparisons = getDocsByType("compare").filter((doc) => doc.frontmatter.category.includes(slug));
  return { guides, reviews, comparisons };
}
