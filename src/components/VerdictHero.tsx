import { BuyButton } from "@/components/BuyButton";
import { Product } from "@/types/content";

type AlternatePick = {
  label: string;
  product?: Product;
};

type VerdictHeroProps = {
  topPick?: Product;
  alternates: AlternatePick[];
  subtag: string;
  topPickBestForOverride?: string;
};

export function VerdictHero({ topPick, alternates, subtag, topPickBestForOverride }: VerdictHeroProps) {
  if (!topPick) return null;
  const topPickScore = (topPick.score ?? topPick.rating ?? 0).toFixed(1);

  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Our top pick</p>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{topPick.name}</h2>
            <p className="mt-1 text-sm font-medium text-slate-700">Score: {topPickScore}/10</p>
            <p className="mt-2 text-sm text-slate-700">Best for: {topPickBestForOverride ?? topPick.bestFor}</p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <BuyButton
              merchant={topPick.merchant}
              url={topPick.url}
              productName={topPick.name}
              placement="hero"
              subtag={subtag}
              label="Check today’s price on Amazon"
            />
            <a
              href="#comparison"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2"
            >
              See comparison
            </a>
          </div>
          <p className="text-xs text-slate-500">Fast shipping and easy returns available on Amazon.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {alternates.map((entry) =>
            entry.product ? (
              <article key={entry.label} className="rounded-xl border border-slate-200 bg-white p-3.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{entry.label}</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{entry.product.name}</p>
                <p className="mt-1 text-xs font-medium text-slate-600">Score: {(entry.product.score ?? entry.product.rating ?? 0).toFixed(1)}/10</p>
                {entry.product.priceRange ? <p className="mt-1 text-xs text-slate-600">{entry.product.priceRange}</p> : null}
                <div className="mt-3">
                  <BuyButton
                    merchant={entry.product.merchant}
                    url={entry.product.url}
                    productName={entry.product.name}
                    placement="hero_alternate"
                    subtag={subtag}
                    label="Check today’s price on Amazon"
                  />
                </div>
              </article>
            ) : null,
          )}
        </div>
      </div>

      <nav className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-slate-200 pt-4 text-sm font-medium text-slate-700">
        <a href="#comparison" className="underline decoration-slate-300 underline-offset-4 hover:text-blue-700 hover:decoration-blue-300">
          Comparison table
        </a>
        <a href="#top-picks" className="underline decoration-slate-300 underline-offset-4 hover:text-blue-700 hover:decoration-blue-300">
          Top picks
        </a>
        <a href="#how-to-choose" className="underline decoration-slate-300 underline-offset-4 hover:text-blue-700 hover:decoration-blue-300">
          How to choose
        </a>
      </nav>
    </section>
  );
}
