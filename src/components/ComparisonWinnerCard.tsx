import { BuyButton } from "@/components/BuyButton";
import { Merchant } from "@/types/content";

type ComparisonWinnerCardProps = {
  kicker: string;
  productName: string;
  image?: string;
  reason: string;
  url: string;
  merchant?: Merchant;
};

export function ComparisonWinnerCard({
  kicker,
  productName,
  image,
  reason,
  url,
  merchant = "amazon",
}: ComparisonWinnerCardProps) {
  void image;
  return (
    <div className="not-prose flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{kicker}</p>
      <p className="mt-1 text-lg font-semibold text-slate-900">{productName}</p>
      <p className="mt-2 text-sm leading-6 text-slate-700">{reason}</p>
      <div className="mt-3">
        <BuyButton
          merchant={merchant}
          url={url}
          productName={productName}
          placement="comparison_winner"
          label="Check today’s price on Amazon"
        />
      </div>
    </div>
  );
}
