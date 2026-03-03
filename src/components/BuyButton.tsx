import { Merchant } from "@/types/content";

type BuyButtonProps = {
  merchant: Merchant;
  url: string;
  label?: string;
  subtag?: string;
};

export function BuyButton({ merchant, url, label, subtag }: BuyButtonProps) {
  void merchant;
  void subtag;

  if (!url?.trim()) {
    return <span className="text-xs font-medium text-slate-500">Link coming soon</span>;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="nofollow sponsored noopener"
      className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:translate-y-px"
    >
      {label ?? "Check price on Amazon"}
    </a>
  );
}
