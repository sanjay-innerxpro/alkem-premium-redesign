import Link from "next/link";
import { Header } from "@/components/header";
import { Brand } from "@/components/brand";
import { Icon, SocialLinks } from "@/components/icons";
import { Reveal } from "@/components/reveal";
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
    <div className="np">
      <Header
        name={s.brand}
        tagline={s.tagline}
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
              <Brand name={s.brand} tagline={s.tagline} />
              <p>{s.footerText}</p>
              <div className="np-footer__contact">
                {s.contactEmail && (
                  <a href={"mailto:" + s.contactEmail}>
                    <Icon name="mail" size={18} />
                    {s.contactEmail}
                  </a>
                )}
                {s.contactPhone && (
                  <a href={"tel:" + s.contactPhone.replace(/\s/g, "")}>
                    <Icon name="phone" size={18} />
                    {s.contactPhone}
                  </a>
                )}
                {s.contactAddress && (
                  <span>
                    <Icon name="pin" size={18} />
                    {s.contactAddress}
                  </span>
                )}
              </div>
              <SocialLinks links={s.social} className="np-social np-social--footer" />
            </div>
            <div className="np-footer__cols">
              <div>
                <h3>Company</h3>
                <Link href="/about">About us</Link>
                <Link href="/innovation">Innovation</Link>
                <Link href="/impact">Our impact</Link>
                <Link href="/sustainability">Sustainability</Link>
              </div>
              <div>
                <h3>Healthcare</h3>
                <Link href="/products">Products</Link>
                <Link href="/offerings">Offerings</Link>
                <Link href="/therapies">Therapy areas</Link>
                <Link href="/news">News &amp; insights</Link>
              </div>
              <div>
                <h3>Connect</h3>
                <Link href="/contact">Contact us</Link>
                <Link href="/careers">Careers</Link>
                <Link href="/privacy">Privacy</Link>
              </div>
            </div>
          </div>
          <div className="np-footer__word" aria-hidden="true">
            {s.brand}
          </div>
          <div className="np-footer__bottom">
            <span>
              © {new Date().getFullYear()} {s.brand} {s.tagline}. All rights
              reserved.
            </span>
            <span>
              Information on this website is general and not a substitute for
              professional medical advice.
            </span>
            <a href="#main">
              Back to top <Icon name="arrow" size={16} />
            </a>
          </div>
        </div>
      </footer>
      <Reveal />
    </div>
  );
}
