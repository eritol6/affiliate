import Link from "next/link";

import { ContentDoc } from "@/types/content";

const routeMap = {
  guides: "/guides",
  reviews: "/reviews",
  compare: "/compare",
  category: "/category",
} as const;

export function CardGrid({ items }: { items: ContentDoc[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Link
          key={`${item.type}-${item.frontmatter.slug}`}
          href={`${routeMap[item.type]}/${item.frontmatter.slug}`}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.type}</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">{item.frontmatter.title}</h3>
          <p className="mt-2 text-sm text-slate-600">{item.frontmatter.description}</p>
        </Link>
      ))}
    </div>
  );
}
