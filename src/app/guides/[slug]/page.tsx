import { notFound } from "next/navigation";
import Script from "next/script";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

import { ComparisonTable } from "@/components/ComparisonTable";
import { ProductCard } from "@/components/ProductCard";
import { QuickPicksBox } from "@/components/QuickPicksBox";
import { mdxComponents } from "@/components/mdx-components";
import { getDocBySlug, getDocsByType } from "@/lib/content";
import { getSiteUrl } from "@/lib/site";

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

function getPick(products: { bestFor: string; name: string }[], needle: string) {
  return products.find((product) => product.bestFor.toLowerCase().includes(needle.toLowerCase()));
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getDocBySlug("guides", slug);

  if (!guide) {
    notFound();
  }

  const products = guide.frontmatter.products;
  const bestOverall = getPick(products, "overall") ?? products[0];
  const bestBudget = getPick(products, "budget") ?? products[1] ?? products[0];
  const bestPremium = getPick(products, "premium") ?? products[2] ?? products[0];
  const bestCompact = getPick(products, "compact") ?? products[3] ?? products[0];

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

      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Buying guide</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">{guide.frontmatter.title}</h1>
      <p className="mt-3 text-lg text-slate-600">{guide.frontmatter.description}</p>

      <div className="mt-5 flex flex-wrap gap-3 text-xs text-slate-500">
        <span>Published: {guide.frontmatter.date}</span>
        <span>Last updated: {guide.frontmatter.lastUpdated}</span>
      </div>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-slate-900">Quick picks summary</h2>
        <ul className="mt-3 space-y-1 text-sm text-slate-700">
          <li>Best overall: {bestOverall?.name}</li>
          <li>Best budget: {bestBudget?.name}</li>
          <li>Best premium: {bestPremium?.name}</li>
          <li>Best compact: {bestCompact?.name}</li>
        </ul>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">
        <QuickPicksBox products={products} />
        <div className="space-y-8">
          <section>
            <h2 className="mb-3 text-2xl font-semibold">Comparison table</h2>
            <ComparisonTable products={products} />
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Top picks</h2>
            {products.map((product) => (
              <ProductCard key={product.name} product={product} subtag={guide.frontmatter.slug} />
            ))}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-2xl font-semibold">How to choose</h2>
            <div className="prose max-w-none mt-2">
              <MDXRemote source={guide.body} components={mdxComponents} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-2xl font-semibold">FAQ</h2>
            <details className="mt-3 rounded-lg border border-slate-200 p-3">
              <summary className="cursor-pointer font-medium">What is the best option for apartments?</summary>
              <p className="mt-2 text-sm text-slate-600">Adjustable systems and foldable equipment usually win on footprint and storage convenience.</p>
            </details>
            <details className="mt-2 rounded-lg border border-slate-200 p-3">
              <summary className="cursor-pointer font-medium">How often should you update this guide?</summary>
              <p className="mt-2 text-sm text-slate-600">At minimum quarterly, or when major models are discontinued or repriced.</p>
            </details>
          </section>

          <section className="rounded-2xl border border-slate-900 bg-slate-900 p-5 text-white">
            <h2 className="text-2xl font-semibold">Final recommendation</h2>
            <p className="mt-2 text-slate-100">
              If you want the safest all-around choice today, start with <strong>{bestOverall?.name}</strong>. It balances quality, space efficiency,
              and long-term value.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold">Sources</h3>
            <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
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
