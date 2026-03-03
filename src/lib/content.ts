export {
  getAllContent as getAllDocs,
  getComparisons,
  getContentBySlug,
  getDocsByType,
  getFeaturedGuides,
  getGuides,
  getLatestGuides,
  getReviews,
  getSearchIndex,
} from "@/lib/content/index";

import type { ContentDoc } from "@/types/content";
import { getAllContent } from "@/lib/content/index";

export function getDocBySlug(_type: "guides" | "reviews" | "compare" | "category", slug: string): ContentDoc | null {
  if (_type === "category") return null;
  return getAllContent().find((doc) => doc.frontmatter.slug === slug) ?? null;
}

export function getCategoryDocs(slug: string) {
  void slug;
  return { guides: [], reviews: [], comparisons: [] };
}
