import { cache } from "react";
import { cookies } from "next/headers";
import { getContent, getSettings, withBrand } from "./content";
import { dictionaries, isLang, LANG_COOKIE, type Lang } from "./i18n";
import { localizeContent, localizeSettings } from "./i18n-content";
import type { Collection } from "./types";
// Public-site data access in the visitor's chosen language. The admin studio
// keeps using getSettings/getContent directly so it always edits the English source.
export async function getLang(): Promise<Lang> {
  const value = (await cookies()).get(LANG_COOKIE)?.value;
  return isLang(value) ? value : "en";
}
export async function getDict() {
  return dictionaries[await getLang()];
}
const settingsOnce = cache(getSettings);
export async function siteSettings() {
  const [s, lang] = await Promise.all([settingsOnce(), getLang()]);
  return withBrand(localizeSettings(s, lang), s.brand);
}
export async function siteContent(collection?: Collection) {
  const [items, lang, s] = await Promise.all([
    getContent(collection),
    getLang(),
    settingsOnce(),
  ]);
  return withBrand(localizeContent(items, lang), s.brand);
}
export async function siteItem(collection: Collection, slug: string) {
  return (await siteContent(collection)).find((x) => x.slug === slug);
}
