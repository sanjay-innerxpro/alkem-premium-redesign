import type { Metadata, Viewport } from "next";
import {
  Instrument_Serif,
  Noto_Naskh_Arabic,
  Noto_Sans_Devanagari,
  Plus_Jakarta_Sans,
} from "next/font/google";
import "./globals.css";
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
export const metadata: Metadata = {
  title: {
    default: "NexPharm Healthcare Private Limited",
    template: "%s | NexPharm Healthcare",
  },
  description:
    "NexPharm Healthcare Private Limited develops and delivers quality, affordable medicines across key therapeutic areas.",
  icons: { icon: "/illustrations/mark.svg" },
};
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
      <body>{children}</body>
    </html>
  );
}
