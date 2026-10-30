import Link from "next/link";
import { Mark } from "@/components/brand";
import { getLang } from "@/lib/i18n-server";
import { getSettingsOrDefault } from "@/lib/content";
import { dictionaries, dirOf } from "@/lib/i18n";
export default async function NotFound() {
  const [lang, s] = await Promise.all([getLang(), getSettingsOrDefault()]);
  const t = dictionaries[lang];
  return (
    <main id="main" className="np np-standalone" lang={lang} dir={dirOf(lang)}>
      <div className="np-aurora" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="np-standalone__inner">
        <Mark name={s.brand} logo={s.logoUrl} size={52} />
        <span className="np-pill">
          <i />
          {t.nf_label}
        </span>
        <h1>
          {t.nf_title_a} <em className="np-gradient-text">{t.nf_title_b}</em>
        </h1>
        <p>{t.nf_text}</p>
        <Link className="np-btn np-btn--light np-btn--lg" href="/">
          {t.back_home}
        </Link>
      </div>
    </main>
  );
}
