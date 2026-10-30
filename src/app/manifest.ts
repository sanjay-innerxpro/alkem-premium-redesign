import type { MetadataRoute } from "next";
import { getSettingsOrDefault, withBrand } from "@/lib/content";
// Web app manifest. The Android app (android/) is a Trusted Web Activity over this site,
// so these colours and icons also drive its install prompt and task-switcher appearance.
// Name and icons follow the brand in Website settings.
export const dynamic = "force-dynamic";
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const s = await getSettingsOrDefault();
  return {
    id: "/",
    name: `${s.brand} ${s.tagline}`,
    short_name: s.brand,
    description: withBrand(s.seoDescription, s.brand),
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#071526",
    theme_color: "#071526",
    categories: ["medical", "health", "business"],
    icons: [
      { src: "/app-icon/icon?size=192", sizes: "192x192", type: "image/png" },
      { src: "/app-icon/icon?size=512", sizes: "512x512", type: "image/png" },
      {
        src: "/app-icon/full?size=512",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
