"use client";

import { useState } from "react";

import { Product } from "@/types/content";

export function QuickPicksBox({ products }: { products: Product[] }) {
  const [open, setOpen] = useState(false);
  const picks = products.slice(0, 4);

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-24">
      <button
        className="flex w-full items-center justify-between text-left lg:pointer-events-none"
        onClick={() => setOpen((prev) => !prev)}
      >
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Quick Picks</h2>
        <span className="text-xs text-slate-500 lg:hidden">{open ? "Hide" : "Show"}</span>
      </button>
      <ul className={`mt-3 space-y-2 ${open ? "block" : "hidden lg:block"}`}>
        {picks.map((pick) => (
          <li key={pick.name} className="rounded-lg bg-slate-50 p-2 text-sm text-slate-700">
            <p className="font-medium text-slate-900">{pick.bestFor}</p>
            <p>{pick.name}</p>
          </li>
        ))}
      </ul>
    </aside>
  );
}
