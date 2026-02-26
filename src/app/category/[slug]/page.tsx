import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

import { CategoryHubClient } from "@/components/CategoryHubClient";
import { mdxComponents } from "@/components/mdx-components";
import { getCategoryDocs, getDocBySlug, getDocsByType } from "@/lib/content";
import { getSiteUrl } from "@/lib/site";

const defaultOgImage = "/images/og-default.svg";

export async function generateStaticParams() {
  return getDocsByType("category").map((category) => ({ slug: category.frontmatter.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const category = getDocBySlug("category", slug);
  if (!category) return {};

  const canonical = `/category/${category.frontmatter.slug}`;
  const ogImage = category.frontmatter.ogImage ?? defaultOgImage;

  return {
    title: category.frontmatter.title,
    description: category.frontmatter.description,
    alternates: { canonical },
    openGraph: {
      title: category.frontmatter.title,
      description: category.frontmatter.description,
      type: "article",
      url: `${getSiteUrl()}${canonical}`,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: category.frontmatter.title,
      description: category.frontmatter.description,
      images: [ogImage],
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getDocBySlug("category", slug);
  if (!category) notFound();

  const docs = getCategoryDocs(slug);

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold tracking-tight">{category.frontmatter.title}</h1>
      <p className="text-lg text-slate-600">{category.frontmatter.description}</p>

      <section className="prose max-w-none rounded-2xl border border-slate-200 bg-white p-5">
        <MDXRemote source={category.body} components={mdxComponents} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
      </section>

      <CategoryHubClient guides={docs.guides} reviews={docs.reviews} comparisons={docs.comparisons} />
    </div>
  );
}
