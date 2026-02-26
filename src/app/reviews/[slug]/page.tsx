import { notFound } from "next/navigation";
import Script from "next/script";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

import { ProductCard } from "@/components/ProductCard";
import { WhereToBuy } from "@/components/WhereToBuy";
import { mdxComponents } from "@/components/mdx-components";
import { getDocBySlug, getDocsByType } from "@/lib/content";
import { getSiteUrl } from "@/lib/site";

const defaultOgImage = "/images/og-default.svg";

export async function generateStaticParams() {
  return getDocsByType("reviews").map((review) => ({ slug: review.frontmatter.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const review = getDocBySlug("reviews", slug);
  if (!review) return {};

  const canonical = `/reviews/${review.frontmatter.slug}`;
  const ogImage = review.frontmatter.ogImage ?? defaultOgImage;

  return {
    title: review.frontmatter.title,
    description: review.frontmatter.description,
    alternates: { canonical },
    openGraph: {
      title: review.frontmatter.title,
      description: review.frontmatter.description,
      type: "article",
      url: `${getSiteUrl()}${canonical}`,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: review.frontmatter.title,
      description: review.frontmatter.description,
      images: [ogImage],
    },
  };
}

export default async function ReviewPage({ params }: Props) {
  const { slug } = await params;
  const review = getDocBySlug("reviews", slug);

  if (!review) {
    notFound();
  }

  const mainProduct = review.frontmatter.products[0];
  const alternatives = review.frontmatter.products.slice(1, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: review.frontmatter.title,
    description: review.frontmatter.description,
    datePublished: review.frontmatter.date,
    dateModified: review.frontmatter.lastUpdated,
  };

  return (
    <article className="space-y-6">
      <Script id="review-article-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Review</p>
      <h1 className="text-4xl font-bold tracking-tight">{review.frontmatter.title}</h1>
      <p className="text-lg text-slate-600">{review.frontmatter.description}</p>
      <p className="text-sm text-slate-500">Last updated: {review.frontmatter.lastUpdated}</p>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-2xl font-semibold">Overview</h2>
        <div className="prose max-w-none mt-2">
          <MDXRemote source={review.body} components={mdxComponents} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
        </div>
      </section>

      {mainProduct ? <ProductCard product={mainProduct} subtag={review.frontmatter.slug} /> : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-2xl font-semibold">Who this is for</h2>
        <p className="mt-2 text-slate-600">Best for users prioritizing {mainProduct?.bestFor ?? "space-efficient training"}.</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-2xl font-semibold">Alternatives</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {alternatives.map((alternative) => (
            <ProductCard key={alternative.name} product={alternative} subtag={review.frontmatter.slug} />
          ))}
        </div>
      </section>

      <WhereToBuy products={review.frontmatter.products.slice(0, 3)} subtag={review.frontmatter.slug} />

      <section>
        <h3 className="text-lg font-semibold">Sources</h3>
        <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
          {(review.frontmatter.sources ?? ["Manufacturer specs", "Retailer listings", "User reviews summary"]).map((source) => (
            <li key={source}>{source}</li>
          ))}
        </ul>
      </section>
    </article>
  );
}
