import type { Metadata } from "next";
import Link from "next/link";

import { CardGrid } from "@/components/CardGrid";
import { CategoryTiles } from "@/components/CategoryTiles";
import { EmailCaptureStub } from "@/components/EmailCaptureStub";
import { getFeaturedGuides, getLatestGuides } from "@/lib/content";

export const metadata: Metadata = {
  title: "Home",
  alternates: { canonical: "/" },
};

const categoryTiles = [
  { slug: "home-gym-small-spaces", title: "Home Gym", description: "Apartment-friendly training equipment picks." },
  { slug: "home-office", title: "Home", description: "Space-smart picks for everyday home setups." },
  { slug: "consumer-tech", title: "Tech", description: "Practical gear with clear buying advice." },
  { slug: "outdoor-essentials", title: "Outdoor", description: "Durable products for weekends outside." },
];

export default function HomePage() {
  const featured = getFeaturedGuides();
  const latest = getLatestGuides();

  return (
    <div className="space-y-12">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Consumer-first recommendations</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Find the right product faster with tested picks, comparisons, and plain-English guides.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
          We publish structured buying content designed to help you evaluate options quickly. Our launch focus is
          Home Gym for Small Spaces, with architecture ready for every major category.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/guides" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            Browse Guides
          </Link>
          <Link href="/methodology" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
            How we choose
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Featured Buying Guides</h2>
          <Link href="/guides" className="text-sm font-semibold text-slate-700 underline">
            View all
          </Link>
        </div>
        <CardGrid items={featured} />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-2xl font-semibold">How we choose</h2>
        <p className="mt-3 text-slate-600">
          Every recommendation includes clear criteria, scenario-based picks, and tradeoff analysis. We document
          sources, update content regularly, and disclose affiliate relationships.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Categories</h2>
        <CategoryTiles categories={categoryTiles} />
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Latest Guides</h2>
        <CardGrid items={latest} />
      </section>

      <EmailCaptureStub />
    </div>
  );
}
