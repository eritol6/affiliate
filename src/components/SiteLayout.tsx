import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getSearchIndex } from "@/lib/content";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const searchIndex = getSearchIndex();

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header searchIndex={searchIndex} />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
      <Footer />
    </div>
  );
}
