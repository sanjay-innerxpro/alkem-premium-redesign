import type { Metadata, Viewport } from "next";
import {
  Instrument_Serif,
  Noto_Naskh_Arabic,
  Noto_Sans_Devanagari,
  Plus_Jakarta_Sans,
} from "next/font/google";
import "./globals.css";
import { ServiceWorker } from "@/components/service-worker";
import { getSettingsOrDefault, withBrand } from "@/lib/content";
// next/font self-hosts these at build time, so the CSP's font-src 'self' still holds.
const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});
// Script fonts for Hindi and Urdu; not preloaded, so English visitors never download them.
const devanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-deva",
  display: "swap",
  preload: false,
});
const urdu = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-urdu",
  display: "swap",
  preload: false,
});
// Titles and icons follow the brand in Website settings.
export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettingsOrDefault();
  return {
    title: { default: `${s.brand} ${s.tagline}`, template: `%s | ${s.brand}` },
    description: withBrand(s.seoDescription, s.brand),
    icons: {
      icon: { url: "/app-icon/icon?size=64", type: "image/png" },
      apple: "/app-icon/full?size=180",
    },
  };
}
export const viewport: Viewport = { themeColor: "#071526" };
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={[sans, serif, devanagari, urdu].map((f) => f.variable).join(" ")}
    >
      <body>
        {children}
        <ServiceWorker />
      </body>
    </html>
  );
}
