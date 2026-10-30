import Link from "next/link";
import { getContent } from "@/lib/content";
import { collections, type Collection } from "@/lib/types";
import { notFound } from "next/navigation";
import { catalogue, catalogueMissing } from "@/lib/catalogue";
import { loadCatalogue } from "@/app/admin/actions";
export default async function ContentList({
  searchParams,
}: {
  searchParams: Promise<{
    collection?: string;
    q?: string;
    saved?: string;
    deleted?: string;
  }>;
}) {
  const search = await searchParams;
  const collection = search.collection || "pages";
  if (!collections.includes(collection as Collection)) notFound();
  const items = await getContent(collection as Collection, true);
  const q = (search.q || "").trim().toLowerCase().slice(0, 150);
  const filtered = items.filter((x) =>
    (x.title + " " + x.slug).toLowerCase().includes(q),
  );
  return (
    <>
      <div className="studio-page-head">
        <div>
          <span className="section-kicker">Content</span>
          <h1>{collection.charAt(0).toUpperCase() + collection.slice(1)}</h1>
          <p>
            {items.length} items · Drafts are hidden from the website until
            published.
          </p>
        </div>
        <Link
          className="studio-button"
          href={"/admin/content/new?collection=" + collection}
        >
          + Add{" "}
          {collection === "careers"
            ? "role"
            : collection === "products"
              ? "product"
              : "item"}
        </Link>
      </div>
      {search.saved && (
        <p role="status" className="success-message">
          Content saved.
        </p>
      )}
      {search.deleted && (
        <p role="status" className="success-message">
          Content deleted.
        </p>
      )}
      {collection === "products" && catalogueMissing(items) && (
        <section className="studio-card">
          <h2>Product list available</h2>
          <p>
            Load the company product list ({catalogue.length} products with
            price, pack size and MOQ). It replaces the sample products and
            overwrites earlier copies of these {catalogue.length}; products you
            added yourself are kept.
          </p>
          <form action={loadCatalogue}>
            <button className="studio-button">Load product list</button>
          </form>
        </section>
      )}
      <section className="studio-card">
        <form className="studio-search">
          <input name="collection" type="hidden" value={collection} />
          <label htmlFor="studio-search" className="sr-only">
            Search content
          </label>
          <input
            id="studio-search"
            name="q"
            defaultValue={search.q}
            placeholder="Search titles or slugs…"
          />
          <button className="studio-secondary">Search</button>
        </form>
        <div className="table-scroll">
          <table className="content-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Order</th>
                <th>Updated</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((x) => (
                <tr key={x.id}>
                  <td>
                    <Link
                      href={
                        "/admin/content/" + x.id + "?collection=" + collection
                      }
                    >
                      <strong>{x.title}</strong>
                      <small>
                        /{collection === "pages" ? "" : collection + "/"}
                        {x.slug}
                      </small>
                    </Link>
                  </td>
                  <td>
                    <span
                      className={
                        "badge " + (x.published ? "published" : "draft")
                      }
                    >
                      {x.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td>{x.sortOrder}</td>
                  <td>
                    {x.updatedAt
                      ? new Date(x.updatedAt).toLocaleDateString("en-IN", {
                          timeZone: "Asia/Kolkata",
                        })
                      : "—"}
                  </td>
                  <td>
                    <Link
                      className="edit-link"
                      href={
                        "/admin/content/" + x.id + "?collection=" + collection
                      }
                    >
                      Edit ↗
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!filtered.length && (
          <div className="empty-state compact">
            <h3>{q ? "No matching items." : "Your next story starts here."}</h3>
            <p>
              {q
                ? "Try another search."
                : "Create an item and publish it when you are ready."}
            </p>
          </div>
        )}
      </section>
    </>
  );
}
