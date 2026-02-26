import { Product } from "@/types/content";

export function ComparisonTable({ products }: { products: Product[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="sticky top-0 bg-slate-100 text-slate-700">
          <tr>
            <th className="px-4 py-3 font-semibold">Product</th>
            <th className="px-4 py-3 font-semibold">Best for</th>
            <th className="px-4 py-3 font-semibold">Price range</th>
            <th className="px-4 py-3 font-semibold">Rating</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.name} className="border-t border-slate-100">
              <td className="px-4 py-3 font-medium text-slate-900">{product.name}</td>
              <td className="px-4 py-3 text-slate-700">{product.bestFor}</td>
              <td className="px-4 py-3 text-slate-700">{product.priceRange}</td>
              <td className="px-4 py-3 text-slate-700">{product.rating.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
