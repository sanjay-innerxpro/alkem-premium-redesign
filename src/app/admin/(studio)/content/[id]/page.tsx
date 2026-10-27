import { notFound } from "next/navigation";
import Link from "next/link";
import { getContent } from "@/lib/content";
import { collections, type Collection, type Content } from "@/lib/types";
import { Editor } from "@/components/admin/forms";
export default async function EditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ collection?: string }>;
}) {
  const { id } = await params;
  const collection = (await searchParams).collection || "pages";
  if (!collections.includes(collection as Collection)) notFound();
  const item: Content | undefined =
    id === "new"
      ? {
          id: "",
          collection: collection as Collection,
          slug: "",
          title: "",
          summary: "",
          body: "",
          category: "",
          imageUrl: "",
          location: "",
          employmentType: "",
          composition: "",
          dosageForm: "",
          packSize: "",
          sortOrder: 0,
          published: false,
        }
      : (await getContent(collection as Collection, true)).find(
          (x) => x.id === id,
        );
  if (!item) notFound();
  return (
    <>
      <Link
        className="back-link"
        href={"/admin/content?collection=" + collection}
      >
        ← Back to {collection}
      </Link>
      <div className="studio-page-head">
        <div>
          <span className="section-kicker">{collection}</span>
          <h1>
            {id === "new"
              ? "Add new " + (collection === "products" ? "product" : "item")
              : item.title}
          </h1>
          <p>
            {id === "new"
              ? "New items start as drafts."
              : "Edit your content and save when you are ready."}
          </p>
        </div>
        {item.published && (
          <Link
            className="studio-secondary"
            target="_blank"
            href={
              collection === "pages"
                ? "/" + item.slug
                : "/" + collection + "/" + item.slug
            }
          >
            View page ↗
          </Link>
        )}
      </div>
      <Editor item={item} />
    </>
  );
}
