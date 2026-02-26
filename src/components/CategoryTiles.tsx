import Link from "next/link";

type CategoryTile = {
  slug: string;
  title: string;
  description: string;
};

export function CategoryTiles({ categories }: { categories: CategoryTile[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/category/${category.slug}`}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
        >
          <h3 className="text-base font-semibold text-slate-900">{category.title}</h3>
          <p className="mt-2 text-sm text-slate-600">{category.description}</p>
        </Link>
      ))}
    </div>
  );
}
