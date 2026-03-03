import type { MetadataRoute } from "next";

import { getDocsByType } from "@/lib/content";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const baseUrl = siteUrl.startsWith("http://localhost") ? "https://thebuyersreports.com" : siteUrl;

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
