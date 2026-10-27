"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Brand } from "./brand";
import { Icon, SocialLinks } from "./icons";
const links = [
  ["/about", "About", "sparkle"],
  ["/products", "Products", "pill"],
  ["/therapies", "Therapies", "heart"],
  ["/offerings", "Offerings", "award"],
  ["/innovation", "Innovation", "flask"],
  ["/careers", "Careers", "users"],
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
          <div className="np-mobile__grid">
            {links.map(([href, label, icon], i) => (
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
                {label}
              </Link>
            ))}
          </div>
          <div className="np-mobile__foot">
            <Link
              className="np-btn np-btn--primary"
              href="/contact"
              onClick={() => setOpen(false)}
            >
              Contact us <Icon name="arrow" size={16} />
            </Link>
            {(phone || email) && (
              <div className="np-mobile__contact">
                {phone && (
                  <a href={"tel:" + phone.replace(/\s/g, "")}>
                    <Icon name="phone" size={15} /> {phone}
                  </a>
                )}
                {email && (
                  <a href={"mailto:" + email}>
                    <Icon name="mail" size={15} /> {email}
                  </a>
                )}
              </div>
            )}
            {hasSocial && (
              <SocialLinks links={social} className="np-social np-social--menu" />
            )}
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
