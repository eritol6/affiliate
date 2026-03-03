import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Home",
  alternates: { canonical: "/" },
};

const featuredReports = [
  {
    title: "Best Compact Home Gym Machines",
    description: "Ranked picks for serious training capability in compact footprints.",
    href: "/guides/best-compact-home-gym-machines",
  },
  {
    title: "Best Adjustable Dumbbells for Small Spaces",
    description: "Top adjustable dumbbell options for apartment and compact home gym use.",
    href: "/guides/best-adjustable-dumbbells-small-spaces-2026",
  },
  {
    title: "Best Home Gym Under 50 Square Feet",
    description: "Practical setup recommendations for high-efficiency training zones.",
    href: "/guides/best-home-gym-under-50-square-feet",
  },
  {
    title: "Best Quiet Home Gym Equipment for Apartments",
    description: "Low-noise equipment choices for apartment-friendly strength training.",
    href: "/guides/best-quiet-home-gym-equipment-apartments",
  },
];

const popularComparisons = [
  { title: "Mikolo K6 vs Powerline PFT100", href: "/compare/mikolo-k6-vs-powerline-pft100" },
  { title: "Bowflex 552 vs PowerBlock", href: "/guides/bowflex-552-vs-powerblock" },
];

export default function HomePage() {
  return (
    <div className="space-y-12 pb-6 sm:space-y-14">
      <section className="rounded-2xl border border-neutral-200 bg-white px-5 py-9 sm:px-8 sm:py-11">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">Independent evaluation reports</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Structured Buyer Reports for Compact Home Gym Equipment
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-700">
          Independent evaluations focused on small-space strength setups and apartment-friendly training.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/guides/best-compact-home-gym-machines"
            className="inline-flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-semibold !text-white no-underline transition hover:bg-blue-700 hover:!text-white visited:!text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2"
          >
            Read the flagship report
          </Link>
          <Link
            href="/guides"
            className="inline-flex h-10 items-center rounded-lg border border-neutral-300 bg-white px-4 text-sm font-semibold text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2"
          >
            Browse all guides
          </Link>
        </div>
      </section>

      <section>
        <h2 className="mb-5 text-3xl font-semibold tracking-tight text-slate-900">Featured Reports</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {featuredReports.map((report) => (
            <Link key={report.href} href={report.href} className="rounded-xl border border-slate-200 p-5 transition hover:bg-slate-50">
              <h3 className="text-lg font-semibold tracking-tight text-slate-900">{report.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{report.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900">How We Evaluate Equipment</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>Structured 10-point scoring framework</li>
          <li>Focused exclusively on compact setups</li>
          <li>No paid placements</li>
          <li>Affiliate-supported transparency</li>
        </ul>
        <Link
          href="/methodology"
          className="mt-5 inline-flex h-10 items-center rounded-lg border border-neutral-300 bg-white px-4 text-sm font-semibold text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2"
        >
          View Methodology
        </Link>
      </section>

      <section>
        <h2 className="mb-4 text-3xl font-semibold tracking-tight text-slate-900">Popular Comparisons</h2>
        <ul className="space-y-2">
          {popularComparisons.map((comparison) => (
            <li key={comparison.href}>
              <Link href={comparison.href} className="text-base font-semibold text-slate-800 underline decoration-slate-300 underline-offset-4 transition hover:text-blue-700 hover:decoration-blue-300">
                {comparison.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
