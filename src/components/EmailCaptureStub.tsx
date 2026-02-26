"use client";

import { FormEvent, useState } from "react";

export function EmailCaptureStub() {
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-xl font-semibold">Get new picks by email</h2>
      <p className="mt-2 text-sm text-slate-600">Email capture placeholder (integration coming soon).</p>
      <form className="mt-3 flex flex-col gap-2 sm:flex-row" onSubmit={onSubmit}>
        <input type="email" required placeholder="you@example.com" className="w-full rounded-xl border border-slate-300 px-3 py-2" />
        <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Notify me</button>
      </form>
      {submitted ? <p className="mt-2 text-xs text-emerald-700">Thanks. Placeholder captured locally.</p> : null}
    </section>
  );
}
