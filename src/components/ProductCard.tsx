import Image from "next/image";

import { BuyButton } from "@/components/BuyButton";
import { MerchantBadge } from "@/components/MerchantBadge";
import { Product } from "@/types/content";

export function ProductCard({ product, subtag }: { product: Product; subtag?: string }) {
  return (
    <article className="rounded-2xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-300 hover:shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-600">
            Best for: {product.bestFor}
          </div>
          <h3 className="text-lg font-semibold tracking-tight text-slate-900">{product.name}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Sold by</span>
          <MerchantBadge merchant={product.merchant} />
        </div>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-[170px_1fr]">
        <Image
          src={product.image}
          alt={product.name}
          width={200}
          height={200}
          className="aspect-square w-full rounded-xl border border-neutral-200 bg-neutral-50 object-contain p-2"
        />
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Pros</h4>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-700">
                {product.pros.map((pro) => (
                  <li key={pro}>{pro}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Cons</h4>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-700">
                {product.cons.map((con) => (
                  <li key={con}>{con}</li>
                ))}
              </ul>
            </div>
          </div>
          {product.specs?.length ? (
            <ul className="flex flex-wrap gap-2 text-xs text-slate-600">
              {product.specs.map((spec) => (
                <li key={spec} className="rounded-full border border-neutral-200 bg-white px-2.5 py-1">
                  {spec}
                </li>
              ))}
            </ul>
          ) : null}
          <div className="flex flex-wrap items-center gap-3">
            <BuyButton merchant={product.merchant} url={product.url} subtag={subtag} />
            <span className="text-sm font-medium text-neutral-600">Price: {product.priceRange}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
