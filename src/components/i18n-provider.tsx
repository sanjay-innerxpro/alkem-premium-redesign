"use client";
import { createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import {
  dictionaries,
  languages,
  LANG_COOKIE,
  type Dict,
  type Lang,
} from "@/lib/i18n";
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
export function LangSwitch({ className = "" }: { className?: string }) {
  const { lang, t } = useI18n();
  const router = useRouter();
  return (
    <div className={"np-lang " + className} role="group" aria-label={t.language}>
      {languages.map((l) => (
        <button
          type="button"
          key={l.code}
          lang={l.code}
          aria-pressed={l.code === lang}
          onClick={() => {
            if (l.code === lang) return;
            document.cookie = `${LANG_COOKIE}=${l.code}; path=/; max-age=31536000; samesite=lax`;
            router.refresh();
          }}
        >
          {l.short}
        </button>
      ))}
    </div>
  );
}
