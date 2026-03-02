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
      className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:translate-y-px"
    />
  );
}
