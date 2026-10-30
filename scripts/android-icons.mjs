import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
// Copies the brand icons the website draws (/app-icon/...) into the Android project, so the
// launcher icon, splash logo and Play Store graphics match the current Brand name.
// Usage, with the site running: npm run android:icons [-- http://localhost:3000]
const site = (
  process.argv[2] ||
  process.env.APP_URL ||
  "http://localhost:3000"
).replace(/\/$/, "");
const root = join(import.meta.dirname, "..", "android");
const res = join(root, "app/src/main/res");
const files = [
  [join(root, "store/play-icon-512.png"), "full", 512],
  [join(root, "store/feature-graphic-1024x500.png"), "feature", 512],
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
  );
for (const [path, variant, size] of files) {
  const r = await fetch(`${site}/app-icon/${variant}?size=${size}`);
  if (!r.ok || r.headers.get("content-type") !== "image/png")
    throw new Error(`${variant} at ${size}px: HTTP ${r.status} from ${site}`);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, Buffer.from(await r.arrayBuffer()));
}
console.log(`Updated ${files.length} Android icons from ${site}.`);
