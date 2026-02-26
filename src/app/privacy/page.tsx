import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <article className="prose max-w-3xl">
      <h1>Privacy Policy</h1>
      <p>We do not sell personal information. Basic analytics may be used to improve site performance.</p>
      <p>Email capture forms are placeholders in this MVP and are not connected to a provider.</p>
    </article>
  );
}
