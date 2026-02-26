import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Methodology",
  alternates: { canonical: "/methodology" },
};

export default function MethodologyPage() {
  return (
    <article className="prose max-w-3xl">
      <h1>Methodology</h1>
      <p>We rank products using space efficiency, quality, usability, value, and owner feedback patterns.</p>
      <ul>
        <li>Define use case and constraints for each guide</li>
        <li>Shortlist products from reputable brands and merchants</li>
        <li>Score against criteria and verify tradeoffs</li>
        <li>Update pages with clearer picks and newer models over time</li>
      </ul>
    </article>
  );
}
