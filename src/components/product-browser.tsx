"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Content } from "@/lib/types";
import { ProductCards } from "./cards";
import { Icon } from "./icons";
import { useI18n } from "./i18n-provider";
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
  const { t } = useI18n();
  // Filter and link by the untranslated category; show the translated label.
  const keyOf = (x: Content) => x.categoryKey ?? x.category;
  const areas = useMemo(() => {
    const map = new Map<string, string>();
    for (const x of items) if (keyOf(x)) map.set(keyOf(x), x.category);
    return [...map];
  }, [items]);
  const forms = useMemo(
    () => [...new Set(items.map((x) => x.dosageForm).filter(Boolean))],
    [items],
  );
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  const results = items.filter((x) => {
    if (cat && keyOf(x) !== cat) return false;
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
            {t.search_products}
          </label>
          <input
            id="product-search"
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value.slice(0, 150))}
            placeholder={t.pb_placeholder}
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
              aria-label={t.clear_search}
            >
              ×
            </button>
          ) : (
            <kbd aria-hidden="true">/</kbd>
          )}
        </div>
        <div className="np-glass-search__filters">
          <div className="np-seg" aria-label={t.therapy_area}>
            {[["", t.all_areas], ...areas].map(([key, name]) => (
              <button
                type="button"
                key={key || "all"}
                aria-pressed={key === cat}
                onClick={() => setCat(key)}
              >
                {name}
                <span>
                  {key ? items.filter((x) => keyOf(x) === key).length : items.length}
                </span>
              </button>
            ))}
          </div>
          {forms.length > 1 && (
            <label className="np-select">
              <span className="np-sr">{t.dosage_form}</span>
              <select value={form} onChange={(e) => setForm(e.target.value)}>
                <option value="">{t.all_forms}</option>
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
          {results.length === 1 ? t.product_one : t.product_many}
          {cat && (
            <>
              {" "}
              {t.in_word} {areas.find(([key]) => key === cat)?.[1] ?? cat}
            </>
          )}
          {q.trim() && (
            <>
              {" "}
              {t.matching} “{q.trim()}”
            </>
          )}
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
            {t.reset_filters}
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
          <h2>{t.no_products}</h2>
          <p>{t.no_products_text}</p>
        </div>
      )}
    </div>
  );
}
