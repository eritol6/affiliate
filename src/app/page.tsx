import type { Metadata } from "next";
import Link from "next/link";

import { getFeaturedGuides, getLatestGuides } from "@/lib/content";
import { ContentType } from "@/types/content";

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

const routeMap: Record<ContentType, string> = {
  guides: "/guides",
  reviews: "/reviews",
  compare: "/compare",
  category: "/category",
};

export default function HomePage() {
  const featured = getFeaturedGuides();
  const latest = getLatestGuides();

  return (
    <div className="space-y-12 pb-4 sm:space-y-14">
      <section className="rounded-2xl border border-neutral-200 bg-white px-5 py-9 sm:px-8 sm:py-11">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">Independent product research</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Shop smarter with clear picks, fast comparisons, and practical buying advice.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-700">
          We test tradeoffs so you do not have to. Every guide is structured for fast decisions with recommendations,
          context, and transparent affiliate disclosures.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/guides"
            className="inline-flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-semibold !text-white no-underline transition hover:bg-blue-700 hover:!text-white visited:!text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2"
          >
            Browse buying guides
          </Link>
          <Link
            href="/methodology"
            className="inline-flex h-10 items-center rounded-lg border border-neutral-300 bg-white px-4 text-sm font-semibold text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2"
          >
            See our methodology
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Featured Buying Guides</h2>
          <Link href="/guides" className="text-sm font-semibold text-neutral-600 underline decoration-neutral-300 underline-offset-4 transition hover:text-blue-700 hover:decoration-blue-300">
            View all
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((item) => (
            <Link
              key={item.frontmatter.slug}
              href={`${routeMap[item.type]}/${item.frontmatter.slug}`}
              className="group rounded-xl border border-neutral-200 bg-white p-5 transition duration-200 hover:border-neutral-300 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">{item.type}</p>
              <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-900 transition group-hover:text-blue-700">
                {item.frontmatter.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-neutral-600">{item.frontmatter.description}</p>
              <span className="mt-4 inline-flex text-sm font-medium text-neutral-700 transition group-hover:text-blue-700">Read guide</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-neutral-200 bg-neutral-50 p-6 sm:p-7">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900">How we choose</h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-neutral-700">
          Every recommendation includes clear criteria, scenario-based picks, and tradeoff analysis. We document
          sources, update content regularly, and disclose affiliate relationships.
        </p>
      </section>

      <section>
        <h2 className="mb-5 text-3xl font-semibold tracking-tight text-slate-900">Categories</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categoryTiles.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="group rounded-xl border border-neutral-200 bg-white p-4 transition duration-200 hover:border-neutral-300 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">Category</p>
              <h3 className="mt-1 text-lg font-semibold tracking-tight text-slate-900 transition group-hover:text-blue-700">{category.title}</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-600">{category.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Latest Guides</h2>
          <Link href="/guides" className="text-sm font-semibold text-neutral-600 underline decoration-neutral-300 underline-offset-4 transition hover:text-blue-700 hover:decoration-blue-300">
            View all
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((item) => (
            <Link
              key={item.frontmatter.slug}
              href={`${routeMap[item.type]}/${item.frontmatter.slug}`}
              className="group rounded-xl border border-neutral-200 bg-white p-5 transition duration-200 hover:border-neutral-300 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">{item.type}</p>
              <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-900 transition group-hover:text-blue-700">
                {item.frontmatter.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-neutral-600">{item.frontmatter.description}</p>
              <span className="mt-4 inline-flex text-sm font-medium text-neutral-700 transition group-hover:text-blue-700">Read guide</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-neutral-200 bg-white p-6 sm:p-7">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Get concise product picks by email</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-700 sm:text-base">
          Weekly shortlist of our newest buying guides and deal highlights. No spam, no fluff.
        </p>
        <form className="mt-6 flex flex-col gap-3 sm:flex-row" action="#">
          <label className="sr-only" htmlFor="home-email">
            Email address
          </label>
          <input
            id="home-email"
            type="email"
            required
            placeholder="you@example.com"
            className="h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 text-sm text-slate-900 transition placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
          />
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold !text-white no-underline transition hover:bg-blue-700 hover:!text-white visited:!text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2"
          >
            Notify me
          </button>
        </form>
        <p className="mt-3 text-xs text-neutral-500">Placeholder form. Email provider integration coming soon.</p>
      </section>
    </div>
  );
}
