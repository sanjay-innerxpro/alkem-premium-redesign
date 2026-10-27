"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Brand } from "./brand";
const links = [
  ["/about", "About us"],
  ["/offerings", "Our offerings"],
  ["/innovation", "Innovation"],
  ["/impact", "Our impact"],
  ["/careers", "Careers"],
];
export function Header({ name, tagline }: { name: string; tagline: string }) {
  const [open, setOpen] = useState(false);
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
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="concept-ribbon">
        UNOFFICIAL DESIGN CONCEPT <span /> Inspired by Alkem Laboratories{" "}
        <a
          href="https://www.alkemlabs.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Official website ↗
        </a>
      </div>
      <header className="site-header">
        <div className="nav-shell">
          <Brand name={name} tagline={tagline} />
          <nav className="desktop-nav" aria-label="Primary navigation">
            {links.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                aria-current={pathname === href ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="nav-actions">
            <Link className="nav-contact" href="/contact">
              Get in touch <span>↗</span>
            </Link>
            <button
              ref={button}
              className="menu-toggle"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
        <nav
          id="mobile-menu"
          className={"mobile-menu" + (open ? " open" : "")}
          inert={!open}
          aria-label="Mobile navigation"
        >
          {[...links, ["/contact", "Get in touch"]].map(([href, label], i) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}>
              {label}
              <span>0{i + 1}</span>
            </Link>
          ))}
        </nav>
      </header>
    </>
  );
}
