"use client";

import { useEffect } from "react";
import { useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { pageview } from "@/lib/gtag";

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    const query = searchParams?.toString();
    const url = pathname + (query ? `?${query}` : "");

    // Let gtag's initial config send the first page_view on hard load.
    // This effect handles client-side navigations in App Router.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    pageview(url);
  }, [pathname, searchParams]);

  return null;
}
