import { getEnv } from "./env.ts";

export function getSiteUrl() {
  return getEnv().NEXT_PUBLIC_SITE_URL ?? "https://www.thebuyersreports.com";
}
