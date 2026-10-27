"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  dictionaries,
  languages,
  LANG_COOKIE,
  type Dict,
  type Lang,
} from "@/lib/i18n";
import { Icon } from "./icons";
const I18n = createContext<{ lang: Lang; t: Dict }>({
  lang: "en",
  t: dictionaries.en,
});
export function I18nProvider({
  lang,
  children,
}: {
  lang: Lang;
  children: React.ReactNode;
}) {
  return (
    <I18n.Provider value={{ lang, t: dictionaries[lang] }}>
      {children}
    </I18n.Provider>
  );
}
export const useI18n = () => useContext(I18n);
// Dropdown language picker. Choosing a language stores it in a cookie and
// re-renders the page on the server in that language.
export function LangSelect({ className = "" }: { className?: string }) {
  const { lang, t } = useI18n();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);
  const current = languages.find((l) => l.code === lang) ?? languages[0];
  useEffect(() => {
    if (!open) return;
    const outside = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    items.current[languages.findIndex((l) => l.code === lang)]?.focus();
    return () => document.removeEventListener("pointerdown", outside);
  }, [open, lang]);
  const choose = (code: Lang) => {
    setOpen(false);
    if (code === lang) return;
    document.cookie = `${LANG_COOKIE}=${code}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  };
  return (
    <div
      ref={root}
      className={"np-langdd " + className}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          e.stopPropagation();
          setOpen(false);
          root.current?.querySelector<HTMLButtonElement>(".np-langdd__btn")?.focus();
        }
        if (!open || !["ArrowDown", "ArrowUp"].includes(e.key)) return;
        e.preventDefault();
        const i = items.current.indexOf(document.activeElement as HTMLButtonElement);
        const next = (i + (e.key === "ArrowDown" ? 1 : -1) + languages.length) % languages.length;
        items.current[next]?.focus();
      }}
    >
      <button
        type="button"
        className="np-langdd__btn"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t.language + ": " + current.label}
        onClick={() => setOpen(!open)}
      >
        <Icon name="globe" size={14} />
        <span lang={current.code} className="np-langdd__label">
          {current.label}
        </span>
        <span lang={current.code} className="np-langdd__short">
          {current.short}
        </span>
        <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true" className="np-langdd__chev">
          <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="np-langdd__menu" role="menu" aria-label={t.language}>
          {languages.map((l, i) => (
            <button
              type="button"
              role="menuitemradio"
              aria-checked={l.code === lang}
              key={l.code}
              lang={l.code}
              ref={(el) => {
                items.current[i] = el;
              }}
              onClick={() => choose(l.code)}
            >
              <span className="np-langdd__code">{l.short}</span>
              <span>{l.label}</span>
              {l.code === lang && (
                <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" className="np-langdd__tick">
                  <path d="m5 12 5 5 9-10" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
