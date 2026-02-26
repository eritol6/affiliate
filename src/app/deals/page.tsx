import type { Metadata } from "next";

import { BuyButton } from "@/components/BuyButton";

export const metadata: Metadata = {
  title: "Deals",
  alternates: { canonical: "/deals" },
};

const deals = [
  {
    title: "Adjustable Dumbbell Set",
    merchant: "amazon" as const,
    url: "https://www.amazon.com/dp/B001ARYU58",
    note: "Placeholder deal card for curated deals workflow.",
  },
  {
    title: "Foldable Bench",
    merchant: "walmart" as const,
    url: "https://www.walmart.com/search?q=foldable+weight+bench",
    note: "Replace with manually curated offers.",
  },
];

export default function DealsPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold">Deals</h1>
      <p className="mt-2 text-slate-600">Manual deals page (no scraping in MVP).</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {deals.map((deal) => (
          <article key={deal.title} className="rounded-2xl border border-slate-200 bg-white p-4">
            <h2 className="text-lg font-semibold">{deal.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{deal.note}</p>
            <div className="mt-3">
              <BuyButton merchant={deal.merchant} url={deal.url} label="View deal" subtag="deals" />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
