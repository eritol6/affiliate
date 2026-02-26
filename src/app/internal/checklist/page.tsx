import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getAllDocs } from "@/lib/content";
import { getEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Internal Checklist",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

type Props = {
  searchParams: Promise<{ key?: string }>;
};

export default async function ChecklistPage({ searchParams }: Props) {
  const params = await searchParams;
  const configuredKey = getEnv().CHECKLIST_KEY;

  if (configuredKey && params.key !== configuredKey) {
    notFound();
  }

  const docs = getAllDocs();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Content Checklist</h1>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-3 py-2 text-left">Page</th>
              <th className="px-3 py-2 text-left">Has products</th>
              <th className="px-3 py-2 text-left">Has sources</th>
              <th className="px-3 py-2 text-left">Last updated</th>
            </tr>
          </thead>
          <tbody>
            {docs.map((doc) => (
              <tr key={`${doc.type}-${doc.frontmatter.slug}`} className="border-t border-slate-100">
                <td className="px-3 py-2">{doc.frontmatter.title}</td>
                <td className="px-3 py-2">{doc.frontmatter.products.length > 0 ? "Yes" : "No"}</td>
                <td className="px-3 py-2">{doc.frontmatter.sources?.length ? "Yes" : "No"}</td>
                <td className="px-3 py-2">{doc.frontmatter.lastUpdated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
