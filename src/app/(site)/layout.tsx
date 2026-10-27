import Link from "next/link";
import { Header } from "@/components/header";
import { Brand } from "@/components/brand";
import { getSettings } from "@/lib/content";
import { isDemo } from "@/lib/db";
export const dynamic = "force-dynamic";
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const s = await getSettings();
  return (
    <>
      <Header name={s.brand} tagline={s.tagline} />
      {isDemo() && (
        <div className="preview-banner">
          Design preview · Changes and enquiries are disabled until MySQL is
          connected.
        </div>
      )}
      {children}
      <footer className="footer">
        <div className="page-container">
          <div className="footer-top">
            <div className="footer-brand">
              <Brand name={s.brand} tagline={s.tagline} />
              <p>{s.footerText}</p>
            </div>
            <div className="footer-links">
              <div>
                <h3>Explore</h3>
                <Link href="/about">About us</Link>
                <Link href="/offerings">Offerings</Link>
                <Link href="/therapies">Therapies</Link>
                <Link href="/innovation">Innovation</Link>
              </div>
              <div>
                <h3>Our world</h3>
                <Link href="/impact">Global presence</Link>
                <Link href="/sustainability">Sustainability</Link>
                <Link href="/careers">Careers</Link>
                <Link href="/news">News & perspectives</Link>
              </div>
              <div>
                <h3>Connect</h3>
                <Link href="/contact">Get in touch</Link>
                <a
                  href="https://www.alkemlabs.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Official website ↗
                </a>
                <Link href="/privacy">Privacy</Link>
                <Link href="/admin">Content studio</Link>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} {s.brand} redesign concept.
            </span>
            <span>
              Independent concept · Not affiliated with Alkem Laboratories.
            </span>
            <Link href="/">BACK TO HOME ↑</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
