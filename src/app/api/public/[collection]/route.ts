import { isCollection, itemsFor, langOf, publicJson } from "@/lib/public-api";
// GET /api/public/{products|therapies|offerings|news|careers|pages}?lang=en|hi|ur
export const dynamic = "force-dynamic";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ collection: string }> },
) {
  const { collection } = await params;
  if (!isCollection(collection))
    return publicJson({ error: "Not found." }, 404);
  try {
    return publicJson(await itemsFor(langOf(request), collection));
  } catch {
    return publicJson({ error: "Content is unavailable." }, 503);
  }
}
