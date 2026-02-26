import { affiliateConfig } from "@/lib/affiliateConfig";
import { Merchant } from "@/types/content";

export function MerchantBadge({ merchant }: { merchant: Merchant }) {
  return (
    <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700">
      {affiliateConfig[merchant].badge}
    </span>
  );
}
