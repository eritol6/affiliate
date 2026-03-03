import fs from "node:fs";
import path from "node:path";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import matter from "gray-matter";
import remarkGfm from "remark-gfm";

import { mdxComponents } from "@/components/mdx-components";

type MethodologyFrontmatter = {
  title: string;
  slug: string;
  description: string;
  lastUpdated: string;
};

function getMethodologyDoc() {
  const fullPath = path.join(process.cwd(), "content", "pages", "methodology.mdx");
  if (!fs.existsSync(fullPath)) return null;

  const source = fs.readFileSync(fullPath, "utf8");
  const parsed = matter(source);
  return {
    frontmatter: parsed.data as MethodologyFrontmatter,
    body: parsed.content,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const doc = getMethodologyDoc();

  if (!doc) {
    return {
      title: "Methodology",
      alternates: { canonical: "/methodology" },
    };
  }

  return {
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
    alternates: { canonical: "/methodology" },
  };
}

export default function MethodologyPage() {
  const doc = getMethodologyDoc();

  if (!doc) {
    notFound();
  }

  return (
    <article className="prose max-w-3xl">
      <MDXRemote source={doc.body} components={mdxComponents} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
    </article>
  );
}
