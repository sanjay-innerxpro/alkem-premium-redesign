"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Brand } from "./brand";
import { Icon, SocialLinks } from "./icons";
import { LangSelect, useI18n } from "./i18n-provider";
import type { Dict } from "@/lib/i18n";
const links: [string, keyof Dict, string][] = [
  ["/about", "nav_about", "sparkle"],
  ["/products", "nav_products", "pill"],
  ["/therapies", "nav_therapies", "heart"],
  ["/offerings", "nav_offerings", "award"],
  ["/innovation", "nav_innovation", "flask"],
  ["/careers", "nav_careers", "users"],
];
export function Header({
  name,
  tagline,
  logo,
  phone,
  email,
  purpose,
  social,
}: {
  name: string;
  tagline: string;
  logo: string;
  phone: string;
  email: string;
  purpose: string;
  social: Record<string, string>;
}) {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const pathname = usePathname();
  const { t, lang } = useI18n();
  const button = useRef<HTMLButtonElement>(null);
  // Close the menu after navigating or once a newly chosen language has loaded.
  useEffect(() => {
    setOpen(false);
  }, [pathname, lang]);
  // Keep the page from scrolling behind the open menu.
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);
  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    const scroll = () => setSolid(window.scrollY > 24);
    scroll();
    window.addEventListener("keydown", close);
    window.addEventListener("scroll", scroll, { passive: true });
    return () => {
      window.removeEventListener("keydown", close);
      window.removeEventListener("scroll", scroll);
    };
  }, []);
  const hasSocial = Object.values(social).some(Boolean);
  return (
    <>
      <a className="np-skip" href="#main">
        {t.skip}
      </a>
      <header
        className={
          "np-header" +
          (solid ? " np-header--solid" : "") +
          (open ? " np-header--open" : "")
        }
      >
        <div className="np-topbar">
          <div className="np-wrap np-topbar__inner">
            <div className="np-topbar__group">
              {phone || email ? (
                <>
                  <span className="np-topbar__label">{t.connect_with_us}</span>
                  {phone && (
                    <a
                      href={"tel:" + phone.replace(/\s/g, "")}
                      aria-label={"Call " + phone}
                    >
                      <span className="np-topbar__icon">
                        <Icon name="phone" size={13} />
                      </span>
                      <bdi className="np-topbar__text">{phone}</bdi>
                    </a>
                  )}
                  {email && (
                    <a href={"mailto:" + email} aria-label={"Email " + email}>
                      <span className="np-topbar__icon">
                        <Icon name="mail" size={13} />
                      </span>
                      <bdi className="np-topbar__text">{email}</bdi>
                    </a>
                  )}
                </>
              ) : (
                <span className="np-topbar__label np-topbar__label--always">
                  {purpose}
                </span>
              )}
            </div>
            <div className="np-topbar__group">
              {hasSocial && (
                <>
                  <span className="np-topbar__label">{t.follow_us}</span>
                  <SocialLinks links={social} />
                </>
              )}
              <LangSelect />
            </div>
          </div>
        </div>
        <div className="np-wrap np-header__bar">
          <Brand name={name} tagline={tagline} logo={logo} />
          <nav className="np-nav" aria-label="Primary navigation">
            {links.map(([href, key]) => (
              <Link
                key={href}
                href={href}
                aria-current={pathname.startsWith(href) ? "page" : undefined}
              >
                {t[key]}
              </Link>
            ))}
          </nav>
          <div className="np-header__actions">
            <Link className="np-btn np-btn--primary np-btn--sm" href="/contact">
              {t.contact_us} <Icon name="arrow" size={16} />
            </Link>
            <button
              ref={button}
              className="np-burger"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-controls="np-mobile-menu"
              aria-label={open ? t.close_menu : t.open_menu}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
        <nav
          id="np-mobile-menu"
          className={"np-mobile" + (open ? " np-mobile--open" : "")}
          inert={!open}
          aria-label="Mobile navigation"
        >
          <div className="np-mobile__grid">
            {links.map(([href, key, icon], i) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                aria-current={pathname.startsWith(href) ? "page" : undefined}
                style={{ "--i": i } as React.CSSProperties}
              >
                <span className="np-mobile__icon">
                  <Icon name={icon} size={18} />
                </span>
                {t[key]}
              </Link>
            ))}
          </div>
          <div className="np-mobile__foot">
            <Link
              className="np-btn np-btn--primary"
              href="/contact"
              onClick={() => setOpen(false)}
            >
              {t.contact_us} <Icon name="arrow" size={16} />
            </Link>
            {(phone || email) && (
              <div className="np-mobile__contact">
                {phone && (
                  <a href={"tel:" + phone.replace(/\s/g, "")}>
                    <Icon name="phone" size={15} /> <bdi>{phone}</bdi>
                  </a>
                )}
                {email && (
                  <a href={"mailto:" + email}>
                    <Icon name="mail" size={15} /> <bdi>{email}</bdi>
                  </a>
                )}
              </div>
            )}
            <div className="np-mobile__row">
              {hasSocial && (
                <SocialLinks
                  links={social}
                  className="np-social np-social--menu"
                />
              )}
              <LangSelect className="np-langdd--menu" />
            </div>
          </div>
        </nav>
      </header>
      <div
        className={"np-scrim" + (open ? " np-scrim--on" : "")}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
    </>
  );
}
