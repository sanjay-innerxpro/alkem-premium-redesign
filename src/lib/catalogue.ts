import type { PoolConnection, RowDataPacket } from "mysql2/promise";
import { db, isDemo } from "./db";
import { defaultContent } from "./defaults";
// The company product list (defaults.ts) is written to the database once per database by a
// data migration at server start. After that the database is the only source: products are
// added, edited and removed in the Content Studio, and the website and app read them from it.
const catalogue = defaultContent.filter((x) => x.collection === "products");
// Sample products shipped with the first seed (product-0 … product-7).
const isSampleProduct = (id: string) => /^product-\d+$/.test(id);

async function writeCatalogue(conn: PoolConnection) {
  const [rows] = await conn.query<RowDataPacket[]>(
    "SELECT id FROM content WHERE collection='products' FOR UPDATE",
  );
  const stale = rows
    .map((r) => r.id as string)
    .filter((id) => isSampleProduct(id) && !catalogue.some((c) => c.id === id));
  if (stale.length)
    await conn.query(
      "DELETE FROM content WHERE collection='products' AND id IN (?)",
      [stale],
    );
  for (const x of catalogue)
    await conn.execute(
      "INSERT INTO content(id,collection,slug,title,data,published,sort_order) VALUES (?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE slug=VALUES(slug),title=VALUES(title),data=VALUES(data),published=VALUES(published),sort_order=VALUES(sort_order)",
      [
        x.id,
        x.collection,
        x.slug,
        x.title,
        JSON.stringify(x),
        x.published,
        x.sortOrder,
      ],
    );
  // The purpose line became the logo's slogan; only an unedited default is changed.
  await conn.execute(
    "UPDATE settings SET data=JSON_SET(data,'$.purpose',?) WHERE id=1 AND JSON_UNQUOTE(JSON_EXTRACT(data,'$.purpose'))=?",
    ["Excellence in every dose", "Healthier lives, everywhere"],
  );
}

// The site moved from nexpharm.smartsoch.store to nexpharmhealth.in; only the old address
// is replaced, never one an editor typed.
async function moveContactEmail(conn: PoolConnection) {
  await conn.execute(
    "UPDATE settings SET data=JSON_SET(data,'$.contactEmail',?) WHERE id=1 AND JSON_UNQUOTE(JSON_EXTRACT(data,'$.contactEmail'))=?",
    ["info@nexpharmhealth.in", "info@nexpharm.smartsoch.store"],
  );
}

const MIGRATIONS: [string, (conn: PoolConnection) => Promise<void>][] = [
  ["data-001-product-catalogue", writeCatalogue],
  ["data-002-nexpharmhealth-email", moveContactEmail],
];

// Runs at server start (instrumentation.ts). Recorded in schema_migrations with the SQL
// migrations, so none runs twice; a failure is logged and retried on the next start.
export async function runDataMigrations() {
  if (isDemo() || !process.env.DATABASE_URL) return;
  for (const [version, run] of MIGRATIONS) await runOnce(version, run);
}

async function runOnce(
  version: string,
  run: (conn: PoolConnection) => Promise<void>,
) {
  const conn = await db().getConnection();
  try {
    await conn.beginTransaction();
    const [done] = await conn.query<RowDataPacket[]>(
      "SELECT version FROM schema_migrations WHERE version=? FOR UPDATE",
      [version],
    );
    if (done.length) {
      await conn.rollback();
      return;
    }
    await run(conn);
    await conn.execute("INSERT INTO schema_migrations(version) VALUES (?)", [
      version,
    ]);
    await conn.commit();
    console.log("Applied " + version);
  } catch (e) {
    await conn.rollback().catch(() => {});
    console.error("Data migration " + version + " failed", e);
  } finally {
    conn.release();
  }
}
