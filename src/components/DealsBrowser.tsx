"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Deal } from "@/lib/types";
import { DealCard } from "./DealCard";

const BUDGETS = [
  { id: "all", label: "Any budget", test: () => true },
  { id: "u300", label: "Under $300", test: (p: number) => p < 300 },
  { id: "300-500", label: "$300–500", test: (p: number) => p >= 300 && p < 500 },
  { id: "500-800", label: "$500–800", test: (p: number) => p >= 500 && p < 800 },
  { id: "800p", label: "$800+", test: (p: number) => p >= 800 },
];
const BODIES = [
  { id: "all", label: "All" },
  { id: "suv", label: "SUV" },
  { id: "sedan", label: "Sedan" },
  { id: "coupe", label: "Coupe & convertible" },
  { id: "truck", label: "Truck" },
  { id: "van", label: "Minivan" },
];
const PAGE = 24;

export function DealsBrowser({
  deals,
  brands,
  initial,
  lockBrand,
  readUrl,
}: {
  deals: Deal[];
  brands: { title: string; slug: string; count: number }[];
  initial: { brand?: string; pay?: string; body?: string };
  lockBrand?: boolean;
  readUrl?: boolean;
}) {
  const [brand, setBrand] = useState(initial.brand || "all");
  const [pay, setPay] = useState(BUDGETS.some((b) => b.id === initial.pay) ? initial.pay! : "all");
  const [body, setBody] = useState(BODIES.some((b) => b.id === initial.body) ? initial.body! : "all");
  const [sort, setSort] = useState<"low" | "high" | "msrp">("low");
  const [q, setQ] = useState("");
  const [shown, setShown] = useState(PAGE);

  // Deep links like /deals?pay=u300&brand=bmw (the homepage budget buttons use these).
  useEffect(() => {
    if (!readUrl) return;
    const p = new URL(window.location.href).searchParams;
    const b = p.get("brand"), y = p.get("pay"), bd = p.get("body");
    if (b) setBrand(b);
    if (y && BUDGETS.some((x) => x.id === y)) setPay(y);
    if (bd && BODIES.some((x) => x.id === bd)) setBody(bd);
  }, [readUrl]);

  const update = (k: string, v: string) => {
    setShown(PAGE);
    if (lockBrand) return;
    const url = new URL(window.location.href);
    if (v === "all" || !v) url.searchParams.delete(k);
    else url.searchParams.set(k, v);
    window.history.replaceState(null, "", url.toString());
  };

  const list = useMemo(() => {
    const budget = BUDGETS.find((b) => b.id === pay)!;
    const term = q.trim().toLowerCase();
    const out = deals.filter(
      (d) =>
        (brand === "all" || d.makeSlug === brand) &&
        (body === "all" || d.bodyStyle === body) &&
        budget.test(d.payment) &&
        (!term || d.title.toLowerCase().includes(term)),
    );
    out.sort((a, b) =>
      sort === "low" ? a.payment - b.payment : sort === "high" ? b.payment - a.payment : (a.msrp || 0) - (b.msrp || 0),
    );
    return out;
  }, [deals, brand, pay, body, sort, q]);

  const bodyCounts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const d of deals) c[d.bodyStyle] = (c[d.bodyStyle] || 0) + 1;
    return c;
  }, [deals]);

  return (
    <div className="wrap deals-layout">
      <aside className="deals-side" aria-label="Filters">
        {!lockBrand && (
          <div className="stack" style={{ gap: 10 }}>
            <span className="mono" style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-mute)" }}>
              Brand
            </span>
            <button
              className="chip"
              type="button"
              aria-pressed={brand === "all"}
              onClick={() => {
                setBrand("all");
                update("brand", "all");
              }}
            >
              <span>All brands</span>
              <span className="mono">{deals.length}</span>
            </button>
            {brands.map((b) => (
              <button
                key={b.slug}
                className="chip"
                type="button"
                aria-pressed={brand === b.slug}
                onClick={() => {
                  setBrand(b.slug);
                  update("brand", b.slug);
                }}
              >
                <span>{b.title}</span>
                <span className="mono">{b.count}</span>
              </button>
            ))}
          </div>
        )}
        <div className="stack" style={{ gap: 10 }}>
          <span className="mono" style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-mute)" }}>
            Body style
          </span>
          {BODIES.filter((b) => b.id === "all" || bodyCounts[b.id]).map((b) => (
            <button
              key={b.id}
              className="chip"
              type="button"
              aria-pressed={body === b.id}
              onClick={() => {
                setBody(b.id);
                update("body", b.id);
              }}
            >
              <span>{b.label}</span>
              <span className="mono">{b.id === "all" ? deals.length : bodyCounts[b.id]}</span>
            </button>
          ))}
        </div>
        <div className="panel-bone stack" style={{ gap: 12, padding: 24 }}>
          <span className="disp" style={{ fontSize: 20, lineHeight: 1.05 }}>
            Don't see your car?
          </span>
          <p style={{ fontSize: 15 }}>We source any make, model and package, nationwide.</p>
          <Link className="btn btn-ink" href="/contact">
            Request a car
          </Link>
        </div>
      </aside>

      <div className="deals-main">
        <div className="row" style={{ gap: 10 }} role="group" aria-label="Monthly budget">
          {BUDGETS.map((b) => (
            <button
              key={b.id}
              className="pill"
              type="button"
              aria-pressed={pay === b.id}
              onClick={() => {
                setPay(b.id);
                update("pay", b.id);
              }}
            >
              {b.label}
            </button>
          ))}
        </div>
        <div className="toolbar">
          <span style={{ fontSize: 15, color: "var(--text-soft)" }} aria-live="polite">
            Showing <strong style={{ color: "var(--bone)" }}>{Math.min(shown, list.length)}</strong> of {list.length}{" "}
            {list.length === 1 ? "deal" : "deals"}
          </span>
          <div className="row" style={{ gap: 10 }}>
            <label className="sr-only" htmlFor="deal-search">
              Search deals
            </label>
            <input
              id="deal-search"
              className="search"
              type="search"
              placeholder="Search model or trim"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setShown(PAGE);
              }}
            />
            <label className="sr-only" htmlFor="deal-sort">
              Sort
            </label>
            <select id="deal-sort" className="search" style={{ minWidth: 0 }} value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
              <option value="low">Lowest payment</option>
              <option value="high">Highest payment</option>
              <option value="msrp">Lowest MSRP</option>
            </select>
          </div>
        </div>

        {list.length === 0 ? (
          <div className="empty stack" style={{ gap: 12, alignItems: "center" }}>
            <span className="disp" style={{ fontSize: 24 }}>
              Nothing in that range right now
            </span>
            <p style={{ margin: 0, color: "var(--text-soft)" }}>Tell us what you want and we'll source it.</p>
            <Link className="btn btn-orange" href="/contact">
              Request a car
            </Link>
          </div>
        ) : (
          <div className="deals-grid">
            {list.slice(0, shown).map((d) => (
              <DealCard key={d.id} deal={d} />
            ))}
          </div>
        )}
        {shown < list.length && (
          <button className="btn btn-ghost" type="button" onClick={() => setShown((s) => s + PAGE)} style={{ alignSelf: "center" }}>
            Show more deals
          </button>
        )}
      </div>
    </div>
  );
}
