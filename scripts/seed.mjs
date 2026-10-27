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
  // Fill contact details and social links only where they are still blank,
  // so values an admin has saved are never overwritten.
  for (const key of ["contactEmail", "contactPhone"])
    await conn.execute(
      `UPDATE settings SET data=JSON_SET(data,'$.${key}',?) WHERE id=1 AND COALESCE(JSON_UNQUOTE(JSON_EXTRACT(data,'$.${key}')),'')=''`,
      [defaultSettings[key]],
    );
  await conn.execute(
    "UPDATE settings SET data=JSON_SET(data,'$.social',JSON_OBJECT()) WHERE id=1 AND JSON_EXTRACT(data,'$.social') IS NULL",
  );
  for (const [network, url] of Object.entries(defaultSettings.social))
    await conn.execute(
      `UPDATE settings SET data=JSON_SET(data,'$.social.${network}',?) WHERE id=1 AND COALESCE(JSON_UNQUOTE(JSON_EXTRACT(data,'$.social.${network}')),'')=''`,
      [url],
    );
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
