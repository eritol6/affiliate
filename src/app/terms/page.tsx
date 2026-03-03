import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <section className="max-w-3xl">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Terms of Use</h1>
      <p className="mt-4 text-base leading-7 text-slate-700">
        By using The Buyers Reports, you agree to use this site for informational purposes only and to review product
        listings and merchant policies directly before making a purchase.
      </p>
      <p className="mt-4 text-base leading-7 text-slate-700">
        Content is provided as-is without warranties. Product availability, pricing, and specifications may change at
        any time. We may earn affiliate commissions from qualifying purchases at no extra cost to you.
      </p>
      <p className="mt-4 text-base leading-7 text-slate-700">
        Continued use of this site indicates acceptance of these terms. For privacy details, review our Privacy Policy.
      </p>
    </section>
  );
}
