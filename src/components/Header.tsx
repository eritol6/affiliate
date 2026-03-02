"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SearchBar } from "@/components/SearchBar";
import { SearchEntry } from "@/types/content";

export function Header({ searchIndex }: { searchIndex: SearchEntry[] }) {
  const pathname = usePathname();
  const links = [
    { href: "/guides", label: "Guides" },
    { href: "/categories", label: "Categories" },
    { href: "/reviews", label: "Reviews" },
    { href: "/methodology", label: "Methodology" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-3 px-4 py-4 sm:px-6">
        <Link href="/" className="inline-flex items-center gap-2 rounded-lg px-1 py-0.5 text-lg font-bold tracking-tight text-slate-900 transition hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60">
          <span className="h-2 w-2 rounded-full bg-blue-600" aria-hidden />
          Picks Ledger
        </Link>
        <nav className="flex items-center gap-1 text-sm font-medium text-slate-700">
          {links.map((link) => {
            const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(`${link.href}/`));

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-lg px-3 py-1.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 ${
                  active
                    ? "font-semibold text-slate-900 underline decoration-blue-500 underline-offset-8"
                    : "text-slate-700 hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto w-full sm:w-auto">
          <SearchBar items={searchIndex} />
        </div>
      </div>
    </header>
  );
}
