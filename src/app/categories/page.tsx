import type { Metadata } from "next";
import Link from "next/link";

import { getDocsByType } from "@/lib/content";

export const metadata: Metadata = {
  title: "Categories",
  alternates: { canonical: "/categories" },
};

export default function CategoriesPage() {
  const categories = getDocsByType("category");

  return (
    <div>
      <h1 className="text-3xl font-semibold">Categories</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {categories.map((category) => (
          <Link
            key={category.frontmatter.slug}
            href={`/category/${category.frontmatter.slug}`}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-slate-900">{category.frontmatter.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{category.frontmatter.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
