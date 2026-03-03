import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function LegacyReviewRedirectPage({ params }: Props) {
  const { slug } = await params;
  redirect(`/guides/${slug}`);
}
