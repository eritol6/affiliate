import type { Metadata } from "next";

import { CardGrid } from "@/components/CardGrid";
import { getDocsByType } from "@/lib/content";

export const metadata: Metadata = {
  title: "Comparisons",
  alternates: { canonical: "/compare" },
};

export default function ComparisonIndexPage() {
  const comparisons = getDocsByType("compare");

  return (
    <div>
      <h1 className="text-3xl font-semibold">Comparisons</h1>
      <p className="mt-2 text-slate-600">Head-to-head product category comparisons.</p>
      <div className="mt-6">
        <CardGrid items={comparisons} />
      </div>
    </div>
  );
}
