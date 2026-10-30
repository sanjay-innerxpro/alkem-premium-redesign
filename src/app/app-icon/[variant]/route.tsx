import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getSettingsOrDefault } from "@/lib/content";
import { initialOf } from "@/components/brand";
// PNG icons drawn from the brand name, so renaming in Website settings updates the favicon,
// install icon and (via npm run android:icons) the Android app. ?size= sets the pixel size.
//   icon        rounded square, transparent corners (favicon, web app)
//   full        full-bleed square with a safe margin (maskable, Apple, Play Store icon)
//   foreground  glyph only, inside Android's adaptive-icon safe zone
//   background  gradient only (adaptive-icon background layer)
//   feature     1024x500 Play Store feature graphic
export const dynamic = "force-dynamic";
const GRADIENT =
  "linear-gradient(135deg, #22B3A0 0%, #1F9BB5 55%, #2F7FA3 100%)";
const variants = [
  "icon",
  "full",
  "foreground",
  "background",
  "feature",
] as const;
type Variant = (typeof variants)[number];
// Plus Jakarta Sans Bold (SIL Open Font License), the site's heading font.
const font = readFile(
  join(process.cwd(), "src/assets/PlusJakartaSans-Bold.woff"),
);

// The letter and dot from the Mark component, in its 40-unit space scaled about the centre.
function Glyph({
  letter,
  size,
  scale,
}: {
  letter: string;
  size: number;
  scale: number;
}) {
  const u = (size / 40) * scale;
  const at = (v: number) => size / 2 + (v - 20) * u;
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex" }}>
      <div
        style={{
          position: "absolute",
          left: at(19) - 15 * u,
          top: at(21.5) - 15 * u,
          width: 30 * u,
          height: 30 * u,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: 23 * u,
          fontWeight: 700,
          fontFamily: "Jakarta",
          lineHeight: 1,
        }}
      >
        {letter}
      </div>
      <div
        style={{
          position: "absolute",
          left: at(31) - 2.6 * u,
          top: at(9) - 2.6 * u,
          width: 5.2 * u,
          height: 5.2 * u,
          borderRadius: "50%",
          background: "#fff",
        }}
      />
    </div>
  );
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ variant: string }> },
) {
  const variant = (await params).variant as Variant;
  if (!variants.includes(variant))
    return new Response("Not found", { status: 404 });
  const requested = Number(new URL(request.url).searchParams.get("size"));
  const size = Math.min(1024, Math.max(16, Math.round(requested) || 512));
  const s = await getSettingsOrDefault();
  const letter = initialOf(s.brand);
  const options = {
    fonts: [{ name: "Jakarta", data: await font, weight: 700 as const }],
    headers: { "Cache-Control": "public, max-age=3600" },
  };

  if (variant === "feature") {
    const w = 1024,
      h = 500;
    return new ImageResponse(
      <div
        style={{
          width: w,
          height: h,
          display: "flex",
          alignItems: "center",
          padding: "0 110px",
          gap: 46,
          background: "linear-gradient(100deg, #071526 0%, #0d2a3d 100%)",
          fontFamily: "Jakarta",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            width: 220,
            height: 220,
            borderRadius: 66,
            background: GRADIENT,
            flexShrink: 0,
          }}
        >
          <Glyph letter={letter} size={220} scale={1} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
          <div
            style={{
              color: "#fff",
              fontSize: 80,
              fontWeight: 700,
              lineHeight: 1.1,
            }}
          >
            {s.brand}
          </div>
          <div style={{ color: "#9FE7DC", fontSize: 34, marginTop: 14 }}>
            {s.tagline}
          </div>
        </div>
      </div>,
      { width: w, height: h, ...options },
    );
  }

  const scale = { icon: 1, full: 0.8, foreground: 0.66, background: 0 }[
    variant
  ];
  return new ImageResponse(
    <div
      style={{
        position: "relative",
        display: "flex",
        width: size,
        height: size,
        background: variant === "foreground" ? "transparent" : GRADIENT,
        borderRadius: variant === "icon" ? size * 0.3 : 0,
      }}
    >
      {scale > 0 && <Glyph letter={letter} size={size} scale={scale} />}
    </div>,
    { width: size, height: size, ...options },
  );
}
