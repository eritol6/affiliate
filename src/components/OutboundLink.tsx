"use client";

import { trackEvent } from "@/lib/analytics";
import { affiliateConfig, formatAffiliateUrl } from "@/lib/affiliateConfig";
import { Merchant } from "@/types/content";

type OutboundLinkProps = {
  merchant: Merchant;
  url: string;
  label?: string;
  subtag?: string;
  className?: string;
};

export function OutboundLink({ merchant, url, label, subtag, className }: OutboundLinkProps) {
  const href = formatAffiliateUrl(merchant, url, subtag);
  const text = label ?? affiliateConfig[merchant].defaultLabel;

  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow sponsored noopener noreferrer"
      className={className}
      onClick={() => trackEvent("affiliate_click", { merchant, href })}
    >
      {text}
    </a>
  );
}
