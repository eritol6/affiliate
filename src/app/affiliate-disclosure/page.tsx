import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  alternates: { canonical: "/affiliate-disclosure" },
};

export default function AffiliateDisclosurePage() {
  return (
    <article className="prose max-w-3xl">
      <h1>Affiliate Disclosure</h1>
      <p>
        The Buyers Reports participates in affiliate programs. When you click partner links and buy, we may earn a commission
        at no extra cost to you.
      </p>
      <p>All affiliate links include disclosure-friendly attributes such as nofollow and sponsored.</p>
    </article>
  );
}
