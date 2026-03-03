import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-neutral-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-sm text-neutral-600 sm:px-6">
        <p>© {new Date().getFullYear()} The Buyers Reports</p>
        <div className="flex gap-3">
          <Link href="/affiliate-disclosure" className="hover:text-blue-700">
            Affiliate Disclosure
          </Link>
          <Link href="/privacy" className="hover:text-blue-700">
            Privacy
          </Link>
          <Link href="/methodology" className="hover:text-blue-700">
            Methodology
          </Link>
        </div>
      </div>
    </footer>
  );
}
