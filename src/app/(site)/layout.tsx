import Link from "next/link";
import { Header } from "@/components/header";
import { Brand } from "@/components/brand";
import { Icon, SocialLinks } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { I18nProvider } from "@/components/i18n-provider";
import { getLang, siteSettings } from "@/lib/i18n-server";
import { dictionaries, dirOf } from "@/lib/i18n";
import { isDemo } from "@/lib/db";
export const dynamic = "force-dynamic";
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [s, lang] = await Promise.all([siteSettings(), getLang()]);
  const t = dictionaries[lang];
  return (
    <I18nProvider lang={lang}>
      <div className="np" lang={lang} dir={dirOf(lang)}>
        <Header
          name={s.brand}
          tagline={s.tagline}
          logo={s.logoUrl}
          phone={s.contactPhone}
          email={s.contactEmail}
          purpose={s.purpose}
          social={s.social}
        />
        {isDemo() && (
          <div className="np-preview">
            Design preview · Changes and enquiries are disabled until MySQL is
            connected.
          </div>
        )}
        {children}
        <footer className="np-footer">
          <div className="np-footer__glow" aria-hidden="true" />
          <div className="np-wrap">
            <div className="np-footer__top">
              <div className="np-footer__brand">
                <Brand name={s.brand} tagline={s.tagline} logo={s.logoUrl} />
                <p>{s.footerText}</p>
                <div className="np-footer__contact">
                  {s.contactEmail && (
                    <a href={"mailto:" + s.contactEmail}>
                      <Icon name="mail" size={18} />
                      <bdi>{s.contactEmail}</bdi>
                    </a>
                  )}
                  {s.contactPhone && (
                    <a href={"tel:" + s.contactPhone.replace(/\s/g, "")}>
                      <Icon name="phone" size={18} />
                      <bdi>{s.contactPhone}</bdi>
                    </a>
                  )}
                  {s.contactAddress && (
                    <span>
                      <Icon name="pin" size={18} />
                      {s.contactAddress}
                    </span>
                  )}
                </div>
                <SocialLinks
                  links={s.social}
                  className="np-social np-social--footer"
                />
              </div>
              <div className="np-footer__cols">
                <div>
                  <h3>{t.f_company}</h3>
                  <Link href="/about">{t.f_about}</Link>
                  <Link href="/innovation">{t.nav_innovation}</Link>
                  <Link href="/impact">{t.f_impact}</Link>
                  <Link href="/sustainability">{t.f_sustainability}</Link>
                </div>
                <div>
                  <h3>{t.f_healthcare}</h3>
                  <Link href="/products">{t.nav_products}</Link>
                  <Link href="/offerings">{t.nav_offerings}</Link>
                  <Link href="/therapies">{t.f_therapy_areas}</Link>
                  <Link href="/news">{t.f_news}</Link>
                </div>
                <div>
                  <h3>{t.f_connect}</h3>
                  <Link href="/contact">{t.contact_us}</Link>
                  <Link href="/careers">{t.nav_careers}</Link>
                  <Link href="/privacy">{t.f_privacy}</Link>
                </div>
              </div>
            </div>
            <div className="np-footer__word" aria-hidden="true">
              {s.brand}
            </div>
            <div className="np-footer__bottom">
              <span>
                © {new Date().getFullYear()} {s.brand} {s.tagline}. {t.rights}
              </span>
              <span>{t.disclaimer}</span>
              <a href="#main">
                {t.back_top} <Icon name="arrow" size={16} />
              </a>
            </div>
          </div>
        </footer>
        <Reveal />
      </div>
    </I18nProvider>
  );
}
