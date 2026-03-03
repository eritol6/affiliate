import { BuyButton } from "@/components/BuyButton";

type PromoProductCardProps = {
  title: string;
  highlight1?: string;
  highlight2?: string;
  highlight3?: string;
  url: string;
  productName: string;
  placement?: string;
};

export function PromoProductCard({
  title,
  highlight1,
  highlight2,
  highlight3,
  url,
  productName,
  placement = "comparison_quick_verdict",
}: PromoProductCardProps) {
  const highlights = [highlight1, highlight2, highlight3].filter(Boolean) as string[];

  return (
    <article className="rounded-2xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-300 hover:shadow-sm">
      <h3 className="mt-3 text-base font-semibold tracking-tight text-slate-900">{title}</h3>
      <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-700">
        {highlights.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
      <div className="mt-4">
        <BuyButton
          merchant="amazon"
          url={url}
          productName={productName}
          placement={placement}
          label="Check today’s price on Amazon"
        />
      </div>
    </article>
  );
}
