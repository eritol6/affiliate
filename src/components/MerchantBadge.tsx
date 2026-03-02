import { affiliateConfig } from "@/lib/affiliateConfig";
import { Merchant } from "@/types/content";

export function MerchantBadge({ merchant }: { merchant: Merchant }) {
  return (
    <span className="rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-neutral-600">
      {affiliateConfig[merchant].badge}
    </span>
  );
}
