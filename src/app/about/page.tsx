import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <article className="prose max-w-3xl">
      <h1>About Picks Ledger</h1>
      <p>
        Picks Ledger publishes practical buying guides, comparisons, and product reviews across multiple categories.
      </p>
      <p>
        We launch with Home Gym for Small Spaces and expand into Home, Tech, Tools, Outdoor, and more.
      </p>
    </article>
  );
}
