import type { MetadataRoute } from "next";

import { getDocsByType } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://thebuyersreports.com";

  const guides = getDocsByType("guides");
  const reviews = getDocsByType("reviews");

  const guideUrls = guides.map((guide) => ({
    url: `${baseUrl}/guides/${guide.frontmatter.slug}`,
    lastModified: new Date(guide.frontmatter.lastUpdated),
  }));

  const reviewUrls = reviews.map((review) => ({
    url: `${baseUrl}/reviews/${review.frontmatter.slug}`,
    lastModified: new Date(review.frontmatter.lastUpdated),
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
    ...guideUrls,
    ...reviewUrls,
  ];
}
