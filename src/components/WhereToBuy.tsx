import { BuyButton } from "@/components/BuyButton";
import { Product } from "@/types/content";

export function WhereToBuy({ products, subtag }: { products: Product[]; subtag?: string }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <h2 className="text-lg font-semibold text-slate-900">Where to buy</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {products.map((product) => (
          <BuyButton
            key={product.name}
            merchant={product.merchant}
            url={product.url}
            label={`Buy ${product.name}`}
            subtag={subtag}
          />
        ))}
      </div>
    </section>
  );
}
