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
  const data: Partial<Settings> =
    typeof rows[0].data === "string" ? JSON.parse(rows[0].data) : rows[0].data;
  // Settings saved before a field existed fall back to its default, so new
  // fields never need a data migration.
  return mapStrings(
    {
      ...defaultSettings,
      ...data,
      social: { ...defaultSettings.social, ...data.social },
      sections: { ...defaultSettings.sections, ...data.sections },
    },
    fromLegacyCopy,
  );
}
// For pages that must render even when the database is unreachable (404, icons, manifest).
export async function getSettingsOrDefault(): Promise<Settings> {
  try {
    return await getSettings();
  } catch {
    return structuredClone(defaultSettings);
  }
}
function mapStrings<T>(value: T, fn: (s: string) => string): T {
  if (typeof value === "string") return fn(value) as T;
  if (Array.isArray(value)) return value.map((v) => mapStrings(v, fn)) as T;
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, mapStrings(v, fn)]),
    ) as T;
  return value;
}
// Copy may contain {brand}; the public site shows the current brand name there, so a
// rename in Website settings reaches every page in every language.
export const withBrand = <T>(value: T, brand: string): T =>
  mapStrings(value, (s) => s.replaceAll("{brand}", brand));
// Seed copy saved before {brand} existed spelled the company name out. Unedited seed text
// is read as today's default, so translations still match it and renames reach it.
const seedCopy = new Set<string>();
mapStrings([defaultSettings, defaultContent], (s) => (seedCopy.add(s), s));
const legacyNames = [
  "NexPharm Healthcare Private Limited",
  "NexPharm Healthcare",
  "NexPharm",
];
export function fromLegacyCopy(text: string) {
  if (!text.includes("NexPharm")) return text;
  const upgraded = legacyNames.reduce(
    (t, name) => t.replaceAll(name, "{brand}"),
    text,
  );
  return seedCopy.has(upgraded) ? upgraded : text;
}
function normalize(row: RowDataPacket): Content {
  const data = typeof row.data === "string" ? JSON.parse(row.data) : row.data;
  return {
    location: "",
    employmentType: "",
    composition: "",
    dosageForm: "",
    packSize: "",
    price: "",
    moq: "",
    ...mapStrings(data, fromLegacyCopy),
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
