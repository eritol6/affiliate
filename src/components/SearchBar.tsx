"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { SearchEntry } from "@/types/content";

type Props = {
  items: SearchEntry[];
};

export function SearchBar({ items }: Props) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];

    return items
      .filter((item) => {
        return (
          item.title.toLowerCase().includes(needle) ||
          item.description.toLowerCase().includes(needle) ||
          item.tags.some((tag) => tag.toLowerCase().includes(needle)) ||
          item.category.some((cat) => cat.toLowerCase().includes(needle))
        );
      })
      .slice(0, 6);
  }, [items, query]);

  return (
    <div className="relative w-full max-w-sm">
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search guides, reviews, categories"
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
      />
      {results.length > 0 ? (
        <div className="absolute right-0 top-11 z-30 w-full rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
          {results.map((result) => (
            <Link
              key={`${result.type}-${result.slug}`}
              href={result.url}
              className="block rounded-lg px-2 py-2 hover:bg-slate-50"
              onClick={() => setQuery("")}
            >
              <p className="text-sm font-semibold text-slate-900">{result.title}</p>
              <p className="text-xs text-slate-500">{result.type}</p>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
