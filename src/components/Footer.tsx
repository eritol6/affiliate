import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-sm text-slate-600 sm:px-6">
        <p>© {new Date().getFullYear()} Picks Ledger</p>
        <div className="flex gap-3">
          <Link href="/affiliate-disclosure">Affiliate Disclosure</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/methodology">Methodology</Link>
        </div>
      </div>
    </footer>
  );
}
