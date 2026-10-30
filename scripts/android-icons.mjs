import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
// Copies the brand icons the website draws (/app-icon/...) into both Android apps (android/
// and the Expo app in mobile/), so launcher icons, splash logos and Play Store graphics
// match the current Brand name.
// Usage, with the site running: npm run android:icons [-- http://localhost:3000]
const site = (
  process.argv[2] ||
  process.env.APP_URL ||
  "http://localhost:3000"
).replace(/\/$/, "");
const root = join(import.meta.dirname, "..", "android");
const res = join(root, "app/src/main/res");
const mobile = join(import.meta.dirname, "..", "mobile", "assets");
const files = [
  [join(root, "store/play-icon-512.png"), "full", 512],
  [join(root, "store/feature-graphic-1024x500.png"), "feature", 512],
  [join(mobile, "icon.png"), "full", 1024],
  [join(mobile, "android-icon-foreground.png"), "foreground", 1024],
  [join(mobile, "android-icon-background.png"), "background", 1024],
  [join(mobile, "android-icon-monochrome.png"), "foreground", 1024],
  [join(mobile, "splash-icon.png"), "icon", 512],
  [join(mobile, "favicon.png"), "icon", 48],
];
const densities = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };
for (const [d, k] of Object.entries(densities))
  files.push(
    [join(res, `mipmap-${d}/ic_launcher.png`), "icon", 48 * k],
    [
      join(res, `mipmap-${d}/ic_launcher_foreground.png`),
      "foreground",
      108 * k,
    ],
    [join(res, `drawable-${d}/splash.png`), "icon", 128 * k],
    [
      join(res, `mipmap-${d}/ic_launcher_background.png`),
      "background",
      108 * k,
    ],
  );
for (const [path, variant, size] of files) {
  const r = await fetch(`${site}/app-icon/${variant}?size=${size}`);
  if (!r.ok || r.headers.get("content-type") !== "image/png")
    throw new Error(`${variant} at ${size}px: HTTP ${r.status} from ${site}`);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, Buffer.from(await r.arrayBuffer()));
}
console.log(`Updated ${files.length} Android icons from ${site}.`);
