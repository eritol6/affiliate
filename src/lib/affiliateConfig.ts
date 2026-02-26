import { getEnv } from "./env.ts";
import type { Merchant } from "../types/content.ts";

type MerchantConfig = {
  displayName: string;
  defaultLabel: string;
  badge: string;
  buildUrl: (url: string, subtag?: string) => string;
};

function withQueryParams(url: string, params: Record<string, string | undefined>) {
  const parsed = new URL(url);
  Object.entries(params).forEach(([key, value]) => {
    if (value) parsed.searchParams.set(key, value);
  });
  return parsed.toString();
}

const env = getEnv();

export const affiliateConfig: Record<Merchant, MerchantConfig> = {
  amazon: {
    displayName: "Amazon",
    defaultLabel: "Check price on Amazon",
    badge: "Amazon",
    buildUrl: (url, subtag) => withQueryParams(url, { tag: env.NEXT_PUBLIC_AMAZON_TAG, ascsubtag: subtag }),
  },
  walmart: {
    displayName: "Walmart",
    defaultLabel: "Check price on Walmart",
    badge: "Walmart",
    buildUrl: (url, subtag) => withQueryParams(url, { subtag: subtag ?? env.MERCHANT_WALMART_SUBTAG }),
  },
  target: {
    displayName: "Target",
    defaultLabel: "Check price on Target",
    badge: "Target",
    buildUrl: (url, subtag) => withQueryParams(url, { subtag: subtag ?? env.MERCHANT_TARGET_SUBTAG }),
  },
  other: {
    displayName: "Store",
    defaultLabel: "Check current price",
    badge: "Partner",
    buildUrl: (url) => url,
  },
};

export function formatAffiliateUrl(merchant: Merchant, url: string, subtag?: string) {
  return affiliateConfig[merchant].buildUrl(url, subtag);
}
