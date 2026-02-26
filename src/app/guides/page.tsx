import type { Metadata } from "next";

import { CardGrid } from "@/components/CardGrid";
import { getDocsByType } from "@/lib/content";

export const metadata: Metadata = {
  title: "Guides",
  alternates: { canonical: "/guides" },
};

export default function GuidesIndexPage() {
  const guides = getDocsByType("guides");

  return (
    <div>
      <h1 className="text-3xl font-semibold">Buying Guides</h1>
      <p className="mt-2 text-slate-600">Money pages built for high-intent shopping decisions.</p>
      <div className="mt-6">
        <CardGrid items={guides} />
      </div>
    </div>
  );
}
