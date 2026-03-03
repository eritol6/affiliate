"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { SearchBar } from "@/components/SearchBar";
import { SearchEntry } from "@/types/content";

type NavLink = {
  href: string;
  label: string;
  activePrefixes: string[];
};

export function Header({ searchIndex }: { searchIndex: SearchEntry[] }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const links: NavLink[] = [
    { href: "/guides", label: "Guides", activePrefixes: ["/guides"] },
    { href: "/comparisons", label: "Comparisons", activePrefixes: ["/compare", "/comparisons"] },
    { href: "/reviews", label: "Reviews", activePrefixes: ["/reviews"] },
    { href: "/methodology", label: "Methodology", activePrefixes: ["/methodology"] },
    { href: "/about", label: "About", activePrefixes: ["/about"] },
  ];

  const isActive = (link: NavLink) =>
    link.activePrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-3 px-4 py-4 sm:px-6">
        <Link href="/" className="inline-flex items-center gap-2 rounded-lg px-1 py-0.5 text-lg font-bold tracking-tight text-slate-900 transition hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60">
          <span className="h-2 w-2 rounded-full bg-blue-600" aria-hidden />
          The Buyers Reports
        </Link>
        <button
          type="button"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
          onClick={() => setMenuOpen((open) => !open)}
          className="ml-auto inline-flex h-10 items-center rounded-lg border border-neutral-300 px-3 text-sm font-semibold text-slate-700 md:hidden"
        >
          Menu
        </button>
        <nav className="hidden items-center gap-1 text-sm font-medium text-slate-700 md:flex">
          {links.map((link) => {
            const active = isActive(link);

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
        <div className="w-full md:ml-auto md:w-auto">
          <SearchBar items={searchIndex} />
        </div>
        {menuOpen ? (
          <nav className="w-full border-t border-neutral-200 pt-2 md:hidden">
            <div className="flex flex-col gap-1">
              {links.map((link) => {
                const active = isActive(link);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 ${
                      active
                        ? "font-semibold text-slate-900 underline decoration-blue-500 underline-offset-4"
                        : "text-slate-700 hover:text-slate-900"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
