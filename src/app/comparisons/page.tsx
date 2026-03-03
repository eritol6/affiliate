import type { Metadata } from "next";
import Link from "next/link";

import { getDocsByType } from "@/lib/content";
import type { ContentDoc } from "@/types/content";

export const metadata: Metadata = {
  title: "Comparisons",
  alternates: { canonical: "/comparisons" },
};

function toTimestamp(value: string) {
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function isTaggedComparison(doc: ContentDoc) {
  return (doc.frontmatter.tags ?? []).some((tag) => tag.toLowerCase() === "comparison");
}

export default function ComparisonsIndexPage() {
  const compareDocs = getDocsByType("compare");
  const taggedGuides = getDocsByType("guides").filter(isTaggedComparison);

  const allComparisons = [...compareDocs, ...taggedGuides]
    .sort((a, b) => toTimestamp(b.frontmatter.lastUpdated) - toTimestamp(a.frontmatter.lastUpdated))
    .filter((doc, index, arr) => arr.findIndex((item) => item.frontmatter.slug === doc.frontmatter.slug) === index);

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Comparisons</h1>
      <p className="mt-2 max-w-3xl text-slate-600">Head-to-head reports built to answer high-intent buying questions quickly.</p>
      <div className="mt-6 space-y-4">
        {allComparisons.map((doc) => {
          const href = doc.type === "compare" ? `/compare/${doc.frontmatter.slug}` : `/guides/${doc.frontmatter.slug}`;
          return (
            <article key={doc.frontmatter.slug} className="rounded-xl border border-slate-200 bg-white p-5">
              <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                <Link href={href} className="hover:text-blue-700">
                  {doc.frontmatter.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{doc.frontmatter.description}</p>
              <p className="mt-3 text-xs font-medium text-slate-500">Updated: {doc.frontmatter.lastUpdated}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
