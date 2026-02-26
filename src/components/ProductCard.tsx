import Image from "next/image";

import { BuyButton } from "@/components/BuyButton";
import { MerchantBadge } from "@/components/MerchantBadge";
import { Product } from "@/types/content";

export function ProductCard({ product, subtag }: { product: Product; subtag?: string }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
          <p className="text-sm text-slate-600">Best for: {product.bestFor}</p>
        </div>
        <MerchantBadge merchant={product.merchant} />
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-[180px_1fr]">
        <Image
          src={product.image}
          alt={product.name}
          width={240}
          height={180}
          className="h-[140px] w-full rounded-xl border border-slate-100 bg-slate-50 object-cover"
        />
        <div className="space-y-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <h4 className="text-sm font-semibold text-emerald-700">Pros</h4>
              <ul className="mt-1 list-disc pl-4 text-sm text-slate-700">
                {product.pros.map((pro) => (
                  <li key={pro}>{pro}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-rose-700">Cons</h4>
              <ul className="mt-1 list-disc pl-4 text-sm text-slate-700">
                {product.cons.map((con) => (
                  <li key={con}>{con}</li>
                ))}
              </ul>
            </div>
          </div>
          {product.specs?.length ? (
            <ul className="flex flex-wrap gap-2 text-xs text-slate-600">
              {product.specs.map((spec) => (
                <li key={spec} className="rounded-full border border-slate-200 px-2 py-1">
                  {spec}
                </li>
              ))}
            </ul>
          ) : null}
          <div className="flex items-center gap-3">
            <BuyButton merchant={product.merchant} url={product.url} subtag={subtag} />
            <span className="text-sm text-slate-500">Price: {product.priceRange}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
