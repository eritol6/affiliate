import type { MetadataRoute } from "next";

import { getAllDocs } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.thebuyersreports.com";
  const docs = getAllDocs();

  const guideUrls = docs.map((doc) => ({
    url: `${baseUrl}/guides/${doc.frontmatter.slug}`,
    lastModified: new Date(doc.frontmatter.lastUpdated ?? doc.frontmatter.date ?? new Date().toISOString()),
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/methodology`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
    },
    ...guideUrls,
  ];
}
