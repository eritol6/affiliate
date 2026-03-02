import { BuyButton } from "@/components/BuyButton";
import { Product } from "@/types/content";

type ComparisonTableProps = {
  products: Product[];
  subtag?: string;
};

export function ComparisonTable({ products, subtag }: ComparisonTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="sticky top-0 bg-slate-100 text-slate-700">
          <tr>
            <th className="px-5 py-3.5 font-semibold">Product</th>
            <th className="px-5 py-3.5 font-semibold">Best for</th>
            <th className="px-5 py-3.5 font-semibold">Price range</th>
            <th className="px-5 py-3.5 font-semibold">Rating</th>
            <th className="px-5 py-3.5 text-right font-semibold">
              <span className="sr-only">Buy</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.name} className="border-t border-slate-100">
              <td className="px-5 py-3.5 font-medium text-slate-900">{product.name}</td>
              <td className="px-5 py-3.5 text-slate-700">{product.bestFor}</td>
              <td className="px-5 py-3.5 text-slate-700">{product.priceRange}</td>
              <td className="px-5 py-3.5 text-slate-700">{product.rating.toFixed(1)}</td>
              <td className="px-5 py-3.5 text-right">
                {product.url?.trim() && product.merchant ? (
                  <BuyButton merchant={product.merchant} url={product.url} label="Check price" subtag={subtag} />
                ) : (
                  <span className="text-xs text-slate-400">Unavailable</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
