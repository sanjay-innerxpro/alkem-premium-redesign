import { getContent, getSettings, withBrand } from "./content";
import { localizeContent, localizeSettings } from "./i18n-content";
import { dictionaries, dirOf, isLang, languages, type Lang } from "./i18n";
import { collections, type Collection, type Content } from "./types";
// Read-only JSON for the mobile app: the same published, translated, branded content the
// website shows. Image paths stay as stored (relative paths resolve against the site).
export function langOf(request: Request): Lang {
  const lang = new URL(request.url).searchParams.get("lang");
  return isLang(lang) ? lang : "en";
}
export const isCollection = (v: string): v is Collection =>
  (collections as readonly string[]).includes(v);
export function publicJson(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "public, max-age=60",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
// Drafts never reach this point; editing metadata stays private.
function publicItem({ published: _p, sortOrder: _s, ...item }: Content) {
  return item;
}
export async function siteFor(lang: Lang) {
  const s = await getSettings();
  return {
    lang,
    dir: dirOf(lang),
    languages,
    settings: withBrand(localizeSettings(s, lang), s.brand),
    dict: dictionaries[lang],
  };
}
export async function itemsFor(lang: Lang, collection: Collection) {
  const [items, s] = await Promise.all([getContent(collection), getSettings()]);
  return withBrand(localizeContent(items, lang), s.brand).map(publicItem);
}
