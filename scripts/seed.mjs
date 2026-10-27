import { register } from "node:module";
register("tsx/esm", import.meta.url);
const { defaultSettings, defaultContent } =
  await import("../src/lib/defaults.ts");
const { db } = await import("../src/lib/db.ts");
const pool = db();
const conn = await pool.getConnection();
try {
  await conn.beginTransaction();
  await conn.execute("INSERT IGNORE INTO settings(id,data) VALUES (1,?)", [
    JSON.stringify(defaultSettings),
  ]);
  for (const item of defaultContent)
    await conn.execute(
      "INSERT IGNORE INTO content(id,collection,slug,title,data,published,sort_order) VALUES (?,?,?,?,?,?,?)",
      [
        item.id,
        item.collection,
        item.slug,
        item.title,
        JSON.stringify(item),
        item.published,
        item.sortOrder,
      ],
    );
  await conn.commit();
  console.log(
    "Seed complete. Existing records were preserved. No admin or fictional vacancies were created.",
  );
} catch (error) {
  await conn.rollback();
  throw error;
} finally {
  conn.release();
  await pool.end();
}
