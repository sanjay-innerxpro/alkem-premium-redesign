import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
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
    <html lang="en" className={sans.variable + " " + serif.variable}>
      <body>{children}</body>
    </html>
  );
}
