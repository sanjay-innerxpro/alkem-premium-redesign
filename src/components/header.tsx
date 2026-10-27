"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Brand } from "./brand";
import { Icon } from "./icons";
const links = [
  ["/about", "About"],
  ["/offerings", "Offerings"],
  ["/therapies", "Therapies"],
  ["/innovation", "Innovation"],
  ["/impact", "Impact"],
  ["/careers", "Careers"],
];
export function Header({ name, tagline }: { name: string; tagline: string }) {
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
        </nav>
      </header>
    </>
  );
}
