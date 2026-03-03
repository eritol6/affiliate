import { notFound } from "next/navigation";
import Script from "next/script";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

import { ComparisonTable } from "@/components/ComparisonTable";
import { ProductCard } from "@/components/ProductCard";
import { QuickPicksBox } from "@/components/QuickPicksBox";
import { RelatedContent } from "@/components/RelatedContent";
import { VerdictHero } from "@/components/VerdictHero";
import { WhereToBuy } from "@/components/WhereToBuy";
import { mdxComponents } from "@/components/mdx-components";
import { getAllDocs, getContentBySlug } from "@/lib/content";
import { getSiteUrl } from "@/lib/site";
import type { ContentDoc, Product } from "@/types/content";

const defaultOgImage = "/images/og-default.svg";

export async function generateStaticParams() {
  return getAllDocs().map((doc) => ({ slug: doc.frontmatter.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const doc = getContentBySlug(slug);
  if (!doc) return {};

  const canonical = `/guides/${doc.frontmatter.slug}`;
  const ogImage = doc.frontmatter.ogImage ?? defaultOgImage;

  return {
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
    alternates: { canonical },
    openGraph: {
      title: doc.frontmatter.title,
      description: doc.frontmatter.description,
      type: "article",
      url: `${getSiteUrl()}${canonical}`,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: doc.frontmatter.title,
      description: doc.frontmatter.description,
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

function renderAffiliateDisclosure(doc: ContentDoc) {
  if (!doc.frontmatter.affiliateDisclosure) {
    return null;
  }

  return (
    <section className="mt-6 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
      <h2 className="text-sm font-semibold text-slate-900">Affiliate Disclosure</h2>
      <p className="mt-1 text-sm text-neutral-700">
        The Buyers Reports participates in affiliate programs. When you click partner links and buy, we may earn a
        commission at no extra cost to you.
      </p>
      <p className="mt-1 text-xs text-neutral-600">All affiliate links include disclosure-friendly attributes such as nofollow and sponsored.</p>
    </section>
  );
}

function GuideTemplate({ doc, products }: { doc: ContentDoc; products: Product[] }) {
  const { bestOverall, bestBudget, bestPremium, bestCompact } = selectGuidePicks(products);
  const isCompactMachinesGuide = doc.frontmatter.slug === "best-compact-home-gym-machines";
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
  const quickDecisionItems = isCompactMachinesGuide
    ? [
        {
          prompt: "Want the most versatile cable machine?",
          productName: "Powerline PFT100",
          anchorId: products.find((product) => {
            const normalized = slugifyProductName(product.name);
            return normalized.includes("powerline") || normalized.includes("pft100");
          })?.name,
        },
        {
          prompt: "Want serious value per dollar?",
          productName: "Mikolo K6",
          anchorId: products.find((product) => slugifyProductName(product.name).includes("mikolo-k6"))?.name,
        },
        {
          prompt: "Want plate-free smart training?",
          productName: "Speediance",
          anchorId: products.find((product) => slugifyProductName(product.name).includes("speediance"))?.name,
        },
        {
          prompt: "Want beginner simplicity?",
          productName: "Bowflex PR1000",
          anchorId: products.find((product) => slugifyProductName(product.name).includes("bowflex-pr1000"))?.name,
        },
      ].map((item) => ({
        ...item,
        href: item.anchorId ? `#product-${slugifyProductName(item.anchorId)}` : undefined,
      }))
    : [];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: doc.frontmatter.title,
    description: doc.frontmatter.description,
    datePublished: doc.frontmatter.date,
    dateModified: doc.frontmatter.lastUpdated ?? doc.frontmatter.date,
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
    <>
      <Script id="guide-article-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <Script id="guide-itemlist-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">Buying guide</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">{doc.frontmatter.title}</h1>
      <p className="mt-3 max-w-3xl text-base leading-7 text-neutral-700 sm:text-lg">{doc.frontmatter.description}</p>

      <div className="mt-5 flex flex-wrap gap-3 text-xs text-neutral-500">
        <span>Published: {doc.frontmatter.date}</span>
        <span>Last updated: {doc.frontmatter.lastUpdated ?? doc.frontmatter.date}</span>
      </div>

      <VerdictHero
        topPick={heroTopPick}
        subtag={doc.frontmatter.slug}
        topPickBestForOverride={
          doc.frontmatter.slug === "best-adjustable-dumbbells-small-spaces-2026"
            ? "Most apartment lifters who want fast weight changes and compact storage."
            : undefined
        }
        alternates={heroAlternates}
      />

      {renderAffiliateDisclosure(doc)}

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">Why Trust This Guide</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-slate-700">
          <li>Structured scoring system (10-point internal score)</li>
          <li>Focused specifically on small-space equipment</li>
          <li>No paid placements</li>
          <li>Affiliate-supported (at no extra cost to you)</li>
          <li>Updated regularly to reflect availability and value</li>
        </ul>
      </section>

      <div className="mt-10 grid gap-8 lg:grid-cols-[250px_1fr]">
        <QuickPicksBox picks={quickPickItems} />
        <div className="space-y-10">
          {isCompactMachinesGuide ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-xl font-semibold tracking-tight text-slate-950">Will It Fit in Your Space?</h2>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-slate-700">
                <li>Measure usable width, not wall-to-wall.</li>
                <li>Leave 6-12 inches behind cable machines for range of motion.</li>
                <li>Verify ceiling height (many require 84&quot;+).</li>
                <li>Check door clearance for delivery.</li>
              </ul>
            </section>
          ) : null}
          {isCompactMachinesGuide ? (
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Quick Decision Guide</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {quickDecisionItems.map((item) => (
                  <li key={item.productName}>
                    <span>{item.prompt} </span>
                    <span aria-hidden="true">-&gt; </span>
                    {item.href ? (
                      <a className="font-semibold text-slate-900 underline-offset-2 hover:text-blue-700 hover:underline" href={item.href}>
                        {item.productName}
                      </a>
                    ) : (
                      <span className="font-semibold text-slate-900">{item.productName}</span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section id="comparison" className="scroll-mt-24">
            <h2 className="mb-4 border-t border-neutral-200 pt-8 text-2xl font-semibold tracking-tight text-slate-900">Comparison table</h2>
            <ComparisonTable
              products={products}
              subtag={doc.frontmatter.slug}
              topPickName={heroTopPick?.name}
              topPickSlug={isCompactMachinesGuide ? "powerline-pft100" : undefined}
            />
          </section>

          <section id="top-picks" className="scroll-mt-24 space-y-4">
            <h2 className="border-t border-neutral-200 pt-8 text-2xl font-semibold tracking-tight text-slate-900">Top picks</h2>
            {products.map((product) => (
              <div key={product.name} id={`product-${slugifyProductName(product.name)}`} className="scroll-mt-24">
                <ProductCard product={product} subtag={doc.frontmatter.slug} />
              </div>
            ))}
          </section>

          <section id="how-to-choose" className="scroll-mt-24 border-t border-neutral-200 pt-8">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">How to choose</h2>
            <div className="prose mt-3 max-w-none">
              <MDXRemote source={doc.body} components={mdxComponents} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
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
              {(doc.frontmatter.sources ?? ["Brand specification pages", "Retail listing data", "User feedback summaries"]).map((source) => (
                <li key={source}>{source}</li>
              ))}
            </ul>
          </section>

          <RelatedContent currentSlug={doc.frontmatter.slug} currentTags={doc.frontmatter.tags} type="guides" />
        </div>
      </div>
    </>
  );
}

function ReviewTemplate({ doc, products }: { doc: ContentDoc; products: Product[] }) {
  const mainProduct = products[0];
  const alternatives = products.slice(1, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: doc.frontmatter.title,
    description: doc.frontmatter.description,
    datePublished: doc.frontmatter.date,
    dateModified: doc.frontmatter.lastUpdated ?? doc.frontmatter.date,
  };

  return (
    <article className="space-y-6">
      <Script id="review-article-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Review</p>
      <h1 className="text-4xl font-bold tracking-tight">{doc.frontmatter.title}</h1>
      <p className="text-lg text-slate-600">{doc.frontmatter.description}</p>
      <p className="text-sm text-slate-500">Last updated: {doc.frontmatter.lastUpdated ?? doc.frontmatter.date}</p>

      {renderAffiliateDisclosure(doc)}

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-2xl font-semibold">Overview</h2>
        <div className="prose mt-2 max-w-none">
          <MDXRemote source={doc.body} components={mdxComponents} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
        </div>
      </section>

      {mainProduct ? <ProductCard product={mainProduct} subtag={doc.frontmatter.slug} /> : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-2xl font-semibold">Who this is for</h2>
        <p className="mt-2 text-slate-600">Best for users prioritizing {mainProduct?.bestFor ?? "space-efficient training"}.</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-2xl font-semibold">Alternatives</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {alternatives.map((alternative) => (
            <ProductCard key={alternative.name} product={alternative} subtag={doc.frontmatter.slug} />
          ))}
        </div>
      </section>

      <WhereToBuy products={products.slice(0, 3)} subtag={doc.frontmatter.slug} />

      <section>
        <h3 className="text-lg font-semibold">Sources</h3>
        <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
          {(doc.frontmatter.sources ?? ["Manufacturer specs", "Retailer listings", "User reviews summary"]).map((source) => (
            <li key={source}>{source}</li>
          ))}
        </ul>
      </section>

      <RelatedContent currentSlug={doc.frontmatter.slug} currentTags={doc.frontmatter.tags} type="reviews" />
    </article>
  );
}

function ComparisonTemplate({ doc, products }: { doc: ContentDoc; products: Product[] }) {
  const marker = "<!--COMPARISON_TABLE-->";
  const hasMarker = doc.body.includes(marker);
  const [beforeTableContent, afterTableContent] = hasMarker ? doc.body.split(marker) : ["", doc.body];
  const topPick = [...products].sort((a, b) => (b.score ?? b.rating ?? 0) - (a.score ?? a.rating ?? 0))[0];

  return (
    <article className="space-y-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Comparison</p>
      <h1 className="text-4xl font-bold tracking-tight">{doc.frontmatter.title}</h1>
      <p className="text-lg text-slate-600">{doc.frontmatter.description}</p>

      {renderAffiliateDisclosure(doc)}

      {hasMarker ? (
        <div className="prose max-w-none rounded-2xl border border-slate-200 bg-white p-5">
          <MDXRemote source={beforeTableContent} components={mdxComponents} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
        </div>
      ) : null}

      <ComparisonTable products={products} subtag={doc.frontmatter.slug} topPickName={topPick?.name} />

      <div className="prose max-w-none rounded-2xl border border-slate-200 bg-white p-5">
        <MDXRemote source={afterTableContent} components={mdxComponents} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
      </div>

      <section className="space-y-4">
        {products.map((product) => (
          <ProductCard key={product.name} product={product} subtag={doc.frontmatter.slug} />
        ))}
      </section>

      <RelatedContent currentSlug={doc.frontmatter.slug} currentTags={doc.frontmatter.tags} type="guides" />
    </article>
  );
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const doc = getContentBySlug(slug);

  if (!doc) {
    notFound();
  }

  const products = doc.frontmatter.productData;

  if (doc.type === "review") {
    return <ReviewTemplate doc={doc} products={products} />;
  }

  if (doc.type === "comparison") {
    return <ComparisonTemplate doc={doc} products={products} />;
  }

  return <GuideTemplate doc={doc} products={products} />;
}
