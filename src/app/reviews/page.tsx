import type { Metadata } from "next";

import { CardGrid } from "@/components/CardGrid";
import { getDocsByType } from "@/lib/content";

export const metadata: Metadata = {
  title: "Reviews",
  alternates: { canonical: "/reviews" },
};

export default function ReviewsIndexPage() {
  const reviews = getDocsByType("reviews");

  return (
    <div>
      <h1 className="text-3xl font-semibold">Reviews</h1>
      <p className="mt-2 text-slate-600">Single-product deep dives with alternatives and where-to-buy options.</p>
      <div className="mt-6">
        <CardGrid items={reviews} />
      </div>
    </div>
  );
}
