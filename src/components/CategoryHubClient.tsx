"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { ContentDoc } from "@/types/content";

type Props = {
  guides: ContentDoc[];
  reviews: ContentDoc[];
  comparisons: ContentDoc[];
};

type SortMode = "newest" | "popular";

export function CategoryHubClient({ guides, reviews, comparisons }: Props) {
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [priceFilter, setPriceFilter] = useState("all");

  const all = useMemo(() => [...guides, ...reviews, ...comparisons], [guides, reviews, comparisons]);

  const filtered = useMemo(() => {
    const sorted = [...all].sort((a, b) => {
      if (sortMode === "newest") return a.frontmatter.date > b.frontmatter.date ? -1 : 1;
      return (b.frontmatter.popularScore ?? 0) - (a.frontmatter.popularScore ?? 0);
    });

    if (priceFilter === "all") return sorted;

    return sorted.filter((doc) => doc.frontmatter.productData.some((product) => product.priceRange.includes(priceFilter)));
  }, [all, priceFilter, sortMode]);

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <select
          value={sortMode}
          onChange={(event) => setSortMode(event.target.value as SortMode)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          <option value="newest">Newest</option>
          <option value="popular">Popular</option>
        </select>
        <select
          value={priceFilter}
          onChange={(event) => setPriceFilter(event.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          <option value="all">All price ranges</option>
          <option value="$">$ Budget</option>
          <option value="$$">$$ Mid-range</option>
          <option value="$$$">$$$ Premium</option>
        </select>
      </div>

      <div className="grid gap-3">
        {filtered.map((doc) => (
          <Link
            key={`${doc.type}-${doc.frontmatter.slug}`}
            href={`/guides/${doc.frontmatter.slug}`}
            className="rounded-xl border border-slate-200 bg-white p-4 hover:bg-slate-50"
          >
            <p className="text-xs font-semibold uppercase text-slate-500">{doc.type}</p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">{doc.frontmatter.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{doc.frontmatter.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
