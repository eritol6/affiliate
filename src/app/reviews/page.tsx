import type { Metadata } from "next";
import Link from "next/link";

import { getDocsByType } from "@/lib/content";

export const metadata: Metadata = {
  title: "Reviews",
  alternates: { canonical: "/reviews" },
};

function toTimestamp(value: string) {
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function getReviewScore(score?: number, rating?: number) {
  if (typeof score === "number") return score;
  if (typeof rating === "number") return rating;
  return null;
}

export default function ReviewsIndexPage() {
  const reviews = [...getDocsByType("reviews")].sort(
    (a, b) => toTimestamp(b.frontmatter.lastUpdated) - toTimestamp(a.frontmatter.lastUpdated),
  );

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Reviews</h1>
      <p className="mt-2 max-w-3xl text-slate-600">Single-product evaluations with clear tradeoffs and buying fit.</p>
      <div className="mt-6 space-y-4">
        {reviews.map((review) => {
          const primaryProduct = review.frontmatter.products[0];
          const score = primaryProduct ? getReviewScore(primaryProduct.score, primaryProduct.rating) : null;
          return (
            <article key={review.frontmatter.slug} className="rounded-xl border border-slate-200 bg-white p-5">
              <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                <Link href={`/reviews/${review.frontmatter.slug}`} className="hover:text-blue-700">
                  {review.frontmatter.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{review.frontmatter.description}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500">
                <span>Updated: {review.frontmatter.lastUpdated}</span>
                {score !== null ? <span>Score: {score.toFixed(1)}/10</span> : null}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
