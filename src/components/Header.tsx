import Link from "next/link";

import { SearchBar } from "@/components/SearchBar";
import { SearchEntry } from "@/types/content";

export function Header({ searchIndex }: { searchIndex: SearchEntry[] }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-3 px-4 py-4 sm:px-6">
        <Link href="/" className="text-lg font-bold tracking-tight text-slate-900">
          Picks Ledger
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-slate-700">
          <Link href="/guides">Guides</Link>
          <Link href="/categories">Categories</Link>
          <Link href="/reviews">Reviews</Link>
          <Link href="/methodology">Methodology</Link>
          <Link href="/about">About</Link>
        </nav>
        <div className="ml-auto">
          <SearchBar items={searchIndex} />
        </div>
      </div>
    </header>
  );
}
