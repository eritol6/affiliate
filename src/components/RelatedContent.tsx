import Link from "next/link";

import { getGuides, getReviews } from "@/lib/content";
import type { ContentDoc } from "@/types/content";

type Props = {
  currentSlug: string;
  currentTags?: string[];
  type: "guides" | "reviews";
};

function normalizeTag(tag: string) {
  return tag.trim().toLowerCase();
}

export function RelatedContent({ currentSlug, currentTags, type }: Props) {
  const sourceDocs: ContentDoc[] = type === "reviews" ? getReviews() : getGuides();
  const docs = sourceDocs.filter((doc) => doc.frontmatter.slug !== currentSlug);
  const normalizedCurrentTags = new Set((currentTags ?? []).map(normalizeTag));

  const tagMatches =
    normalizedCurrentTags.size > 0
      ? docs.filter((doc) => (doc.frontmatter.tags ?? []).some((tag) => normalizedCurrentTags.has(normalizeTag(tag))))
      : [];

  const relatedItems = (tagMatches.length > 0 ? tagMatches : docs).slice(0, 3);

  if (relatedItems.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold">{type === "guides" ? "Related Guides" : "Related Reviews"}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {relatedItems.map((item) => (
          <Link
            key={item.frontmatter.slug}
            href={`/guides/${item.frontmatter.slug}`}
            className="rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50"
          >
            <p className="text-sm font-semibold text-slate-900">{item.frontmatter.title}</p>
            <p className="mt-1 line-clamp-2 text-xs text-slate-600">{item.frontmatter.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
