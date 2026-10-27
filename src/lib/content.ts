import { db, isDemo } from "./db";
import { defaultContent, defaultSettings } from "./defaults";
import type { Collection, Content, Settings, Enquiry } from "./types";
import type { RowDataPacket } from "mysql2/promise";
export async function getSettings(): Promise<Settings> {
  if (isDemo()) return structuredClone(defaultSettings);
  const [rows] = await db().query<RowDataPacket[]>(
    "SELECT data FROM settings WHERE id=1",
  );
  if (!rows.length)
    throw new Error("Database is not seeded. Run npm run db:seed.");
  return typeof rows[0].data === "string"
    ? JSON.parse(rows[0].data)
    : rows[0].data;
}
function normalize(row: RowDataPacket): Content {
  const data = typeof row.data === "string" ? JSON.parse(row.data) : row.data;
  return {
    ...data,
    id: row.id,
    collection: row.collection,
    slug: row.slug,
    published: !!row.published,
    sortOrder: row.sort_order,
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}
export async function getContent(
  collection?: Collection,
  includeDrafts = false,
): Promise<Content[]> {
  if (isDemo())
    return defaultContent
      .filter(
        (x) =>
          (!collection || x.collection === collection) &&
          (includeDrafts || x.published),
      )
      .map((x) => ({ ...x }));
  const terms: string[] = [];
  const params: string[] = [];
  if (collection) {
    terms.push("collection=?");
    params.push(collection);
  }
  if (!includeDrafts) terms.push("published=1");
  const [rows] = await db().query<RowDataPacket[]>(
    "SELECT * FROM content" +
      (terms.length ? " WHERE " + terms.join(" AND ") : "") +
      " ORDER BY sort_order,title",
    params,
  );
  return rows.map(normalize);
}
export async function getItem(collection: Collection, slug: string) {
  return (await getContent(collection)).find((x) => x.slug === slug);
}
export async function getEnquiries(): Promise<Enquiry[]> {
  if (isDemo()) return [];
  const [rows] = await db().query<RowDataPacket[]>(
    "SELECT id,name,email,subject,message,status,created_at FROM enquiries ORDER BY created_at DESC LIMIT 500",
  );
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    subject: r.subject,
    message: r.message,
    status: r.status,
    createdAt: new Date(r.created_at).toISOString(),
  }));
}
