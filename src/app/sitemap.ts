import type { MetadataRoute } from "next";

import { getAllDocs } from "@/lib/content";
import { getSiteUrl } from "@/lib/site";

const routePrefix = {
  guides: "/guides",
  reviews: "/reviews",
  compare: "/compare",
  category: "/category",
} as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const staticRoutes = ["", "/guides", "/reviews", "/compare", "/categories", "/about", "/privacy", "/affiliate-disclosure", "/methodology", "/deals"];

  const dynamicRoutes = getAllDocs().map((doc) => ({
    url: `${baseUrl}${routePrefix[doc.type]}/${doc.frontmatter.slug}`,
    lastModified: new Date(doc.frontmatter.lastUpdated),
  }));

  return [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
    })),
    ...dynamicRoutes,
  ];
}
