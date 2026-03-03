import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

import { ComparisonTable } from "@/components/ComparisonTable";
import { ProductCard } from "@/components/ProductCard";
import { mdxComponents } from "@/components/mdx-components";
import { getDocBySlug, getDocsByType } from "@/lib/content";
import { getSiteUrl } from "@/lib/site";

const defaultOgImage = "/images/og-default.svg";

export async function generateStaticParams() {
  return getDocsByType("compare").map((item) => ({ slug: item.frontmatter.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const doc = getDocBySlug("compare", slug);
  if (!doc) return {};

  const canonical = `/compare/${doc.frontmatter.slug}`;
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

export default async function ComparisonPage({ params }: Props) {
  const { slug } = await params;
  const doc = getDocBySlug("compare", slug);

  if (!doc) notFound();
  const products = doc.frontmatter.products;
  const marker = "<!--COMPARISON_TABLE-->";
  const hasMarker = doc.body.includes(marker);
  const [beforeTableContent, afterTableContent] = hasMarker ? doc.body.split(marker) : ["", doc.body];
  const topPick = [...products].sort((a, b) => (b.score ?? b.rating ?? 0) - (a.score ?? a.rating ?? 0))[0];

  return (
    <article className="space-y-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Comparison</p>
      <h1 className="text-4xl font-bold tracking-tight">{doc.frontmatter.title}</h1>
      <p className="text-lg text-slate-600">{doc.frontmatter.description}</p>

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
    </article>
  );
}
