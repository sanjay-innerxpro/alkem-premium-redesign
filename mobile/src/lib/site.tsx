import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { useApi, type Lang, type Site } from "./api";

// Website settings, interface text and the visitor's language, shared by every screen.
type SiteState = {
  site: Site | undefined;
  lang: Lang;
  rtl: boolean;
  latin: boolean;
  offline: boolean;
  failed: boolean;
  setLang: (lang: Lang) => void;
  refresh: () => Promise<void>;
};
const SiteContext = createContext<SiteState | null>(null);
const LANG_KEY = "lang";

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  useEffect(() => {
    AsyncStorage.getItem(LANG_KEY)
      .then((saved) => {
        if (saved === "hi" || saved === "ur") setLangState(saved);
      })
      .catch(() => {});
  }, []);
  const setLang = (next: Lang) => {
    setLangState(next);
    AsyncStorage.setItem(LANG_KEY, next).catch(() => {});
  };
  const { data, offline, failed, refresh } = useApi<Site>(`/site?lang=${lang}`);
  return (
    <SiteContext.Provider
      value={{
        site: data,
        lang,
        rtl: lang === "ur",
        latin: lang === "en",
        offline,
        failed,
        setLang,
        refresh,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const value = useContext(SiteContext);
  if (!value) throw new Error("useSite must be used inside SiteProvider");
  return value;
}

// For screens rendered after the site has loaded (the root layout waits for it).
export function useLoadedSite() {
  const state = useSite();
  if (!state.site) throw new Error("Site settings are not loaded yet");
  return {
    ...state,
    site: state.site,
    t: state.site.dict,
    s: state.site.settings,
  };
}
