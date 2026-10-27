"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Brand } from "./brand";
import { Icon, SocialLinks } from "./icons";
const links = [
  ["/about", "About"],
  ["/products", "Products"],
  ["/therapies", "Therapies"],
  ["/offerings", "Offerings"],
  ["/innovation", "Innovation"],
  ["/careers", "Careers"],
];
export function Header({
  name,
  tagline,
  phone,
  email,
  purpose,
  social,
}: {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  purpose: string;
  social: Record<string, string>;
}) {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const pathname = usePathname();
  const button = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
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
        Skip to content
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
                  <span className="np-topbar__label">Connect with us</span>
                  {phone && (
                    <a href={"tel:" + phone.replace(/\s/g, "")} aria-label={"Call " + phone}>
                      <span className="np-topbar__icon">
                        <Icon name="phone" size={13} />
                      </span>
                      <span className="np-topbar__text">{phone}</span>
                    </a>
                  )}
                  {email && (
                    <a href={"mailto:" + email} aria-label={"Email " + email}>
                      <span className="np-topbar__icon">
                        <Icon name="mail" size={13} />
                      </span>
                      <span className="np-topbar__text">{email}</span>
                    </a>
                  )}
                </>
              ) : (
                <span className="np-topbar__label np-topbar__label--always">
                  {purpose}
                </span>
              )}
            </div>
            {hasSocial && (
              <div className="np-topbar__group">
                <span className="np-topbar__label">Follow us on</span>
                <SocialLinks links={social} />
              </div>
            )}
          </div>
        </div>
        <div className="np-wrap np-header__bar">
          <Brand name={name} tagline={tagline} />
          <nav className="np-nav" aria-label="Primary navigation">
            {links.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                aria-current={pathname.startsWith(href) ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="np-header__actions">
            <Link className="np-btn np-btn--primary np-btn--sm" href="/contact">
              Contact us <Icon name="arrow" size={16} />
            </Link>
            <button
              ref={button}
              className="np-burger"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-controls="np-mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
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
          {[...links, ["/contact", "Contact us"]].map(([href, label], i) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              style={{ "--i": i } as React.CSSProperties}
            >
              <span>{String(i + 1).padStart(2, "0")}</span>
              {label}
              <Icon name="arrow" size={22} />
            </Link>
          ))}
          {hasSocial && <SocialLinks links={social} className="np-social np-social--menu" />}
        </nav>
      </header>
    </>
  );
}
