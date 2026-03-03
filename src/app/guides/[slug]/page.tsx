import { notFound } from "next/navigation";
import Script from "next/script";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

import { ComparisonTable } from "@/components/ComparisonTable";
import { ProductCard } from "@/components/ProductCard";
import { QuickPicksBox } from "@/components/QuickPicksBox";
import { VerdictHero } from "@/components/VerdictHero";
import { mdxComponents } from "@/components/mdx-components";
import { getDocBySlug, getDocsByType } from "@/lib/content";
import { getSiteUrl } from "@/lib/site";
import { Product } from "@/types/content";

const defaultOgImage = "/images/og-default.svg";

export async function generateStaticParams() {
  return getDocsByType("guides").map((guide) => ({ slug: guide.frontmatter.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const guide = getDocBySlug("guides", slug);
  if (!guide) return {};

  const canonical = `/guides/${guide.frontmatter.slug}`;
  const ogImage = guide.frontmatter.ogImage ?? defaultOgImage;

  return {
    title: guide.frontmatter.title,
    description: guide.frontmatter.description,
    alternates: { canonical },
    openGraph: {
      title: guide.frontmatter.title,
      description: guide.frontmatter.description,
      type: "article",
      url: `${getSiteUrl()}${canonical}`,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: guide.frontmatter.title,
      description: guide.frontmatter.description,
      images: [ogImage],
    },
  };
}

function getPick(products: Product[], needle: string) {
  const lowerNeedle = needle.toLowerCase();
  return products.find((product) => product.bestFor.toLowerCase().includes(lowerNeedle) || product.name.toLowerCase().includes(lowerNeedle));
}

function getPriceRangeBounds(priceRange: string) {
  const numbers = priceRange.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [];
  if (!numbers.length) return null;

  return {
    low: Math.min(...numbers),
    high: Math.max(...numbers),
  };
}

function selectGuidePicks(products: Product[]) {
  const bestOverall = getPick(products, "overall") ?? products[0];
  const nonOverall = bestOverall ? products.filter((product) => product !== bestOverall) : [...products];

  const sortedByLow = [...nonOverall].sort((a, b) => {
    const aLow = getPriceRangeBounds(a.priceRange)?.low ?? Number.POSITIVE_INFINITY;
    const bLow = getPriceRangeBounds(b.priceRange)?.low ?? Number.POSITIVE_INFINITY;
    return aLow - bLow;
  });
  const sortedByHigh = [...nonOverall].sort((a, b) => {
    const aHigh = getPriceRangeBounds(a.priceRange)?.high ?? Number.NEGATIVE_INFINITY;
    const bHigh = getPriceRangeBounds(b.priceRange)?.high ?? Number.NEGATIVE_INFINITY;
    return bHigh - aHigh;
  });

  const bestBudget = getPick(nonOverall, "budget") ?? sortedByLow[0] ?? nonOverall[0];
  const premiumPool = nonOverall.filter((product) => product !== bestBudget);
  const bestPremium = getPick(premiumPool, "premium") ?? sortedByHigh.find((product) => product !== bestBudget) ?? nonOverall[1];

  const compactPool = nonOverall.filter((product) => product !== bestBudget && product !== bestPremium);
  const bestCompact = getPick(compactPool, "compact") ?? getPick(compactPool, "small") ?? nonOverall[2] ?? compactPool[0];

  return {
    bestOverall,
    bestBudget,
    bestPremium,
    bestCompact,
  };
}

function selectCompactMachinePicks(products: Product[]) {
  const topPick = getPick(products, "overall") ?? getPick(products, "anchor") ?? products[0];
  const rest = topPick ? products.filter((product) => product !== topPick) : [...products];

  const bestValue = getPick(rest, "value") ?? getPick(rest, "budget") ?? rest[0];
  const smartPool = rest.filter((product) => product !== bestValue);
  const bestSmart = getPick(smartPool, "smart") ?? smartPool[0];
  const beginnerPool = rest.filter((product) => product !== bestValue && product !== bestSmart);
  const bestBeginner = getPick(beginnerPool, "beginner") ?? beginnerPool[0];

  return {
    topPick,
    alternates: [
      { label: "Best value", product: bestValue },
      { label: "Best smart", product: bestSmart },
      { label: "Best beginner", product: bestBeginner },
    ],
  };
}

function slugifyProductName(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getDocBySlug("guides", slug);

  if (!guide) {
    notFound();
  }

  const products = guide.frontmatter.products;
  const { bestOverall, bestBudget, bestPremium, bestCompact } = selectGuidePicks(products);
  const isCompactMachinesGuide = guide.frontmatter.slug === "best-compact-home-gym-machines";
  const compactHero = isCompactMachinesGuide ? selectCompactMachinePicks(products) : null;
  const heroTopPick = compactHero?.topPick ?? bestOverall;
  const heroAlternates =
    compactHero?.alternates ?? [
      { label: "Best budget", product: bestBudget },
      { label: "Best premium", product: bestPremium },
      { label: "Most compact", product: bestCompact },
    ];
  const quickPickItems = products.slice(0, 4).map((product) => ({
    name: product.name,
    bestFor: product.bestFor,
    anchorId: `product-${slugifyProductName(product.name)}`,
  }));

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.frontmatter.title,
    description: guide.frontmatter.description,
    datePublished: guide.frontmatter.date,
    dateModified: guide.frontmatter.lastUpdated,
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: product.name,
    })),
  };

  return (
    <article>
      <Script id="guide-article-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <Script id="guide-itemlist-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">Buying guide</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">{guide.frontmatter.title}</h1>
      <p className="mt-3 max-w-3xl text-base leading-7 text-neutral-700 sm:text-lg">{guide.frontmatter.description}</p>

      <div className="mt-5 flex flex-wrap gap-3 text-xs text-neutral-500">
        <span>Published: {guide.frontmatter.date}</span>
        <span>Last updated: {guide.frontmatter.lastUpdated}</span>
      </div>

      <VerdictHero
        topPick={heroTopPick}
        subtag={guide.frontmatter.slug}
        topPickBestForOverride={
          guide.frontmatter.slug === "best-adjustable-dumbbells-small-spaces-2026"
            ? "Most apartment lifters who want fast weight changes and compact storage."
            : undefined
        }
        alternates={heroAlternates}
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[250px_1fr]">
        <QuickPicksBox picks={quickPickItems} />
        <div className="space-y-10">
          {isCompactMachinesGuide ? (
            <section className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Space Planning Quick Guide</h2>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-neutral-700">
                <li>Measure usable width, not just wall-to-wall.</li>
                <li>Account for cable travel range.</li>
                <li>Leave 6-12 inches clearance behind machine.</li>
                <li>Verify ceiling height before purchase.</li>
              </ul>
            </section>
          ) : null}

          <section id="comparison" className="scroll-mt-24">
            <h2 className="mb-4 border-t border-neutral-200 pt-8 text-2xl font-semibold tracking-tight text-slate-900">Comparison table</h2>
            <ComparisonTable
              products={products}
              subtag={guide.frontmatter.slug}
              topPickName={heroTopPick?.name}
              topPickSlug={isCompactMachinesGuide ? "powerline-pft100" : undefined}
            />
          </section>

          <section id="top-picks" className="scroll-mt-24 space-y-4">
            <h2 className="border-t border-neutral-200 pt-8 text-2xl font-semibold tracking-tight text-slate-900">Top picks</h2>
            {products.map((product) => (
              <div key={product.name} id={`product-${slugifyProductName(product.name)}`} className="scroll-mt-24">
                <ProductCard product={product} subtag={guide.frontmatter.slug} />
              </div>
            ))}
          </section>

          <section id="how-to-choose" className="scroll-mt-24 border-t border-neutral-200 pt-8">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">How to choose</h2>
            <div className="prose mt-3 max-w-none">
              <MDXRemote source={guide.body} components={mdxComponents} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
            </div>
          </section>

          <section className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Final recommendation</h2>
            <p className="mt-2 text-neutral-700">
              If you want the safest all-around choice today, start with <strong>{heroTopPick?.name}</strong>. It balances quality, space efficiency,
              and long-term value.
            </p>
          </section>

          <section className="border-t border-neutral-200 pt-8">
            <h3 className="text-lg font-semibold tracking-tight text-slate-900">Sources</h3>
            <ul className="mt-2 list-disc pl-5 text-sm text-neutral-700">
              {(guide.frontmatter.sources ?? ["Brand specification pages", "Retail listing data", "User feedback summaries"]).map((source) => (
                <li key={source}>{source}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </article>
  );
}
