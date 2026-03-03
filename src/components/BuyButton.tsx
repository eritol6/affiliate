"use client";

import { Merchant } from "@/types/content";

type BuyButtonProps = {
  merchant: Merchant;
  url: string;
  productName?: string;
  placement?: string;
  label?: string;
  subtag?: string;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function BuyButton({ merchant, url, productName, placement, label, subtag }: BuyButtonProps) {
  void merchant;
  void subtag;

  if (!url?.trim()) {
    return <span className="text-xs font-medium text-slate-500">Link coming soon</span>;
  }

  const trackedProductName = productName || label || "unknown";
  const trackedPlacement = placement || "unknown";

  return (
    <a
      href={url}
      target="_blank"
      rel="nofollow sponsored noopener"
      onClick={() => {
        if (typeof window !== "undefined" && typeof window.gtag === "function") {
          window.gtag("event", "affiliate_click", {
            product_name: trackedProductName,
            page_path: window.location.pathname,
            placement: trackedPlacement,
          });
        }
      }}
      className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-center text-sm font-semibold leading-tight !text-white no-underline transition hover:bg-blue-700 hover:!text-white visited:!text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:translate-y-px"
    >
      {label ?? "Check today’s price on Amazon"}
    </a>
  );
}
