import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { SiteLayout } from "@/components/SiteLayout";
import { getSiteUrl } from "@/lib/site";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const siteUrl = getSiteUrl();
const defaultOgImage = "/images/og-default.svg";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "The Buyers Reports | Trusted Guides, Reviews & Comparisons",
    template: "%s | The Buyers Reports",
  },
  description:
    "Independent buying guides and reviews to help you choose better products across home, tech, tools, and more.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "The Buyers Reports",
    description: "Independent buying guides and reviews.",
    type: "website",
    siteName: "The Buyers Reports",
    url: siteUrl,
    images: [{ url: defaultOgImage, width: 1200, height: 630, alt: "The Buyers Reports" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Buyers Reports",
    description: "Independent buying guides and reviews.",
    images: [defaultOgImage],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}
