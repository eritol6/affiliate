"use client";

import { useState } from "react";

import { Product } from "@/types/content";

export function QuickPicksBox({ products }: { products: Product[] }) {
  const [open, setOpen] = useState(false);
  const picks = products.slice(0, 4);

  return (
    <aside className="rounded-xl border border-neutral-200 bg-white p-4 lg:sticky lg:top-24">
      <button
        className="flex w-full items-center justify-between text-left lg:pointer-events-none"
        onClick={() => setOpen((prev) => !prev)}
      >
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-neutral-700">Quick Picks</h2>
        <span className="text-xs text-neutral-500 lg:hidden">{open ? "Hide" : "Show"}</span>
      </button>
      <ul className={`mt-3 space-y-2.5 border-l border-neutral-200 pl-3 ${open ? "block" : "hidden lg:block"}`}>
        {picks.map((pick) => (
          <li key={pick.name} className="text-sm text-neutral-700">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{pick.bestFor}</p>
            <p className="mt-0.5 font-medium text-slate-900">{pick.name}</p>
          </li>
        ))}
      </ul>
    </aside>
  );
}
