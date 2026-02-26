import { OutboundLink } from "@/components/OutboundLink";
import { Merchant } from "@/types/content";

type BuyButtonProps = {
  merchant: Merchant;
  url: string;
  label?: string;
  subtag?: string;
};

export function BuyButton({ merchant, url, label, subtag }: BuyButtonProps) {
  return (
    <OutboundLink
      merchant={merchant}
      url={url}
      subtag={subtag}
      label={label}
      className="inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
    />
  );
}
