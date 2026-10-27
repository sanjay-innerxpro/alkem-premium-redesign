import { cookies } from "next/headers";
import { getContent, getSettings } from "./content";
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
export async function siteSettings() {
  const [s, lang] = await Promise.all([getSettings(), getLang()]);
  return localizeSettings(s, lang);
}
export async function siteContent(collection?: Collection) {
  const [items, lang] = await Promise.all([getContent(collection), getLang()]);
  return localizeContent(items, lang);
}
export async function siteItem(collection: Collection, slug: string) {
  return (await siteContent(collection)).find((x) => x.slug === slug);
}
