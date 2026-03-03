import type { Metadata } from "next";
import Link from "next/link";

import { getDocsByType } from "@/lib/content";

export const metadata: Metadata = {
  title: "Guides",
  alternates: { canonical: "/guides" },
};

function toTimestamp(value: string) {
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

export default function GuidesIndexPage() {
  const guides = [...getDocsByType("guides")].sort(
    (a, b) => toTimestamp(b.frontmatter.lastUpdated) - toTimestamp(a.frontmatter.lastUpdated),
  );

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Buying Guides</h1>
      <p className="mt-2 max-w-3xl text-slate-600">Structured buyer reports focused on compact home-gym decisions.</p>
      <div className="mt-6 space-y-4">
        {guides.map((guide) => (
          <article key={guide.frontmatter.slug} className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">
              <Link href={`/guides/${guide.frontmatter.slug}`} className="hover:text-blue-700">
                {guide.frontmatter.title}
              </Link>
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{guide.frontmatter.description}</p>
            <p className="mt-3 text-xs font-medium text-slate-500">Updated: {guide.frontmatter.lastUpdated}</p>
            {guide.frontmatter.tags && guide.frontmatter.tags.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {guide.frontmatter.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-600">
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
