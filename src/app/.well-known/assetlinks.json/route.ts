// Digital Asset Links: proves to Android that the Play Store app may open this site
// full-screen (Trusted Web Activity). Without a match, the app falls back to showing
// a browser address bar. Not configured → 404, so nothing is claimed by default.
// Both variables are comma-separated, e.g. the store app plus its ".test" build.
export const dynamic = "force-dynamic";
const list = (value = "") =>
  value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
export function GET() {
  const packages = list(process.env.ANDROID_PACKAGE_NAME).filter((p) =>
    /^[a-zA-Z][\w]*(\.[a-zA-Z][\w]*)+$/.test(p),
  );
  const fingerprints = list(process.env.ANDROID_SHA256_FINGERPRINTS)
    .map((f) => f.toUpperCase())
    .filter((f) => /^([0-9A-F]{2}:){31}[0-9A-F]{2}$/.test(f));
  if (packages.length === 0 || fingerprints.length === 0)
    return new Response("Not found", { status: 404 });
  return Response.json(
    packages.map((package_name) => ({
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name,
        sha256_cert_fingerprints: fingerprints,
      },
    })),
  );
}
