import { isCollection, itemsFor, langOf, publicJson } from "@/lib/public-api";
// GET /api/public/{collection}/{slug}?lang=en|hi|ur: one published item.
export const dynamic = "force-dynamic";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ collection: string; slug: string }> },
) {
  const { collection, slug } = await params;
  if (!isCollection(collection))
    return publicJson({ error: "Not found." }, 404);
  try {
    const item = (await itemsFor(langOf(request), collection)).find(
      (x) => x.slug === slug,
    );
    return item ? publicJson(item) : publicJson({ error: "Not found." }, 404);
  } catch {
    return publicJson({ error: "Content is unavailable." }, 503);
  }
}
