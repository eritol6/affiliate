import Image from "next/image";

import { BuyButton } from "@/components/BuyButton";
import { Product } from "@/types/content";

type ComparisonTableProps = {
  products: Product[];
  subtag?: string;
  topPickName?: string;
  topPickSlug?: string;
};

function slugifyProduct(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function ComparisonTable({ products, subtag, topPickName, topPickSlug }: ComparisonTableProps) {
  const getScore = (product: Product) => product.score ?? product.rating ?? 0;
  const getCell = (value?: string) => value?.trim() || "—";
  const useDumbbellColumns = products.length > 0 && products.every((product) => Boolean(product.weightRange || product.incrementSize || product.adjustmentSpeed));

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="sticky top-0 bg-slate-100 text-slate-700">
          <tr>
            <th className="px-5 py-3.5 font-semibold">Product</th>
            {useDumbbellColumns ? (
              <>
                <th className="px-5 py-3.5 font-semibold">Weight Range</th>
                <th className="px-5 py-3.5 font-semibold">Increment Size</th>
                <th className="px-5 py-3.5 font-semibold">Footprint</th>
                <th className="px-5 py-3.5 font-semibold">Adjustment Speed</th>
                <th className="px-5 py-3.5 font-semibold">Best For</th>
              </>
            ) : (
              <>
                <th className="px-5 py-3.5 font-semibold">Footprint</th>
                <th className="px-5 py-3.5 font-semibold">Ceiling</th>
                <th className="px-5 py-3.5 font-semibold">Resistance</th>
                <th className="px-5 py-3.5 font-semibold">Max</th>
              </>
            )}
            <th className="px-5 py-3.5 font-semibold">Score (10-point)</th>
            <th className="px-5 py-3.5 text-right font-semibold">
              <span className="sr-only">Buy</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const isTopPick = topPickSlug ? slugifyProduct(product.name) === topPickSlug : topPickName ? product.name === topPickName : false;

            return (
              <tr key={product.name} className={`border-t border-slate-100 ${isTopPick ? "bg-slate-50" : ""}`}>
                <td className={`px-5 py-3.5 ${isTopPick ? "border-l-4 border-l-blue-600" : ""}`}>
                  <div className="flex items-center gap-3">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={`${product.name} thumbnail`}
                        width={72}
                        height={72}
                        className="h-[56px] w-[56px] rounded-md border border-slate-200 bg-white object-contain p-1"
                      />
                    ) : null}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-slate-900">{product.name}</span>
                        {isTopPick ? (
                          <span className="inline-flex items-center rounded-full bg-blue-600 px-2 py-0.5 text-[11px] font-bold text-white">
                            Top Pick
                          </span>
                        ) : null}
                      </div>
                      {!useDumbbellColumns && product.bestFor ? <div className="mt-1 text-xs text-slate-600">{product.bestFor}</div> : null}
                    </div>
                  </div>
                </td>
                {useDumbbellColumns ? (
                  <>
                    <td className="px-5 py-3.5 text-slate-700">{getCell(product.weightRange)}</td>
                    <td className="px-5 py-3.5 text-slate-700">{getCell(product.incrementSize)}</td>
                    <td className="px-5 py-3.5 text-slate-700">{getCell(product.footprint)}</td>
                    <td className="px-5 py-3.5 text-slate-700">{getCell(product.adjustmentSpeed)}</td>
                    <td className="px-5 py-3.5 text-slate-700">{getCell(product.bestFor)}</td>
                  </>
                ) : (
                  <>
                    <td className="px-5 py-3.5 text-slate-700">{getCell(product.footprint)}</td>
                    <td className="px-5 py-3.5 text-slate-700">{getCell(product.ceilingHeight)}</td>
                    <td className="px-5 py-3.5 text-slate-700">{getCell(product.resistanceType)}</td>
                    <td className="px-5 py-3.5 text-slate-700">{getCell(product.maxResistance)}</td>
                  </>
                )}
                <td className="px-5 py-3.5 text-slate-700">{getScore(product).toFixed(1)}/10</td>
                <td className="px-5 py-3.5 text-right">
                  <BuyButton
                    merchant={product.merchant}
                    url={product.url}
                    productName={product.name}
                    placement="comparison_table"
                    label="Check today’s price on Amazon"
                    subtag={subtag}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
