"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Content } from "@/lib/types";
import { ProductCards } from "./cards";
import { Icon } from "./icons";
// Instant client-side search over the published products. The URL keeps
// ?q= and ?cat= in sync so a filtered view can be shared or bookmarked.
export function ProductBrowser({
  items,
  initialQ = "",
  initialCat = "",
}: {
  items: Content[];
  initialQ?: string;
  initialCat?: string;
}) {
  const [q, setQ] = useState(initialQ);
  const [cat, setCat] = useState(initialCat);
  const [form, setForm] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const areas = useMemo(
    () => [...new Set(items.map((x) => x.category).filter(Boolean))],
    [items],
  );
  const forms = useMemo(
    () => [...new Set(items.map((x) => x.dosageForm).filter(Boolean))],
    [items],
  );
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  const results = items.filter((x) => {
    if (cat && x.category !== cat) return false;
    if (form && x.dosageForm !== form) return false;
    const hay = [x.title, x.composition, x.category, x.dosageForm, x.packSize]
      .join(" ")
      .toLowerCase();
    return terms.every((t) => hay.includes(t));
  });
  useEffect(() => {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (cat) params.set("cat", cat);
    const query = params.toString();
    const next = "/products" + (query ? "?" + query : "");
    window.history.replaceState(null, "", next);
  }, [q, cat]);
  useEffect(() => {
    const focus = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(target.tagName)) {
        e.preventDefault();
        input.current?.focus();
      }
    };
    window.addEventListener("keydown", focus);
    return () => window.removeEventListener("keydown", focus);
  }, []);
  const filtered = q || cat || form;
  return (
    <div className="np-browse">
      <div className="np-glass-search" role="search">
        <div className="np-glass-search__field">
          <Icon name="search" size={22} />
          <label htmlFor="product-search" className="np-sr">
            Search products
          </label>
          <input
            id="product-search"
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value.slice(0, 150))}
            placeholder="Search by name, composition or therapy area…"
            autoComplete="off"
            enterKeyHint="search"
          />
          {q ? (
            <button
              type="button"
              className="np-glass-search__clear"
              onClick={() => {
                setQ("");
                input.current?.focus();
              }}
              aria-label="Clear search"
            >
              ×
            </button>
          ) : (
            <kbd aria-hidden="true">/</kbd>
          )}
        </div>
        <div className="np-glass-search__filters">
          <div className="np-seg" aria-label="Therapy area">
            {["", ...areas].map((a) => (
              <button
                type="button"
                key={a || "all"}
                aria-pressed={a === cat}
                onClick={() => setCat(a)}
              >
                {a || "All areas"}
                <span>
                  {a ? items.filter((x) => x.category === a).length : items.length}
                </span>
              </button>
            ))}
          </div>
          {forms.length > 1 && (
            <label className="np-select">
              <span className="np-sr">Dosage form</span>
              <select value={form} onChange={(e) => setForm(e.target.value)}>
                <option value="">All forms</option>
                {forms.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </label>
          )}
        </div>
      </div>
      <div className="np-browse__bar" aria-live="polite">
        <span>
          <strong>{results.length}</strong>{" "}
          {results.length === 1 ? "product" : "products"}
          {cat && <> in {cat}</>}
          {q.trim() && <> matching “{q.trim()}”</>}
        </span>
        {filtered && (
          <button
            type="button"
            onClick={() => {
              setQ("");
              setCat("");
              setForm("");
            }}
          >
            Reset filters
          </button>
        )}
      </div>
      {results.length ? (
        <ProductCards items={results} reveal={false} />
      ) : (
        <div className="np-empty">
          <span className="np-icon-chip">
            <Icon name="search" size={24} />
          </span>
          <h2>No products found.</h2>
          <p>Try another name or composition, or clear the filters.</p>
        </div>
      )}
    </div>
  );
}
