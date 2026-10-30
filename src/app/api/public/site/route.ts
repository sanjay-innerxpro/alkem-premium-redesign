import { langOf, publicJson, siteFor } from "@/lib/public-api";
// GET /api/public/site?lang=en|hi|ur: settings, interface text and languages.
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try {
    return publicJson(await siteFor(langOf(request)));
  } catch {
    return publicJson({ error: "Content is unavailable." }, 503);
  }
}
