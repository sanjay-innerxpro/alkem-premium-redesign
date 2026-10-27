import mysql from "mysql2/promise";
import { readFile, readdir } from "node:fs/promises";
if (!process.env.DATABASE_URL)
  throw new Error("Set DATABASE_URL in .env.local.");
const conn = await mysql.createConnection({
  uri: process.env.DATABASE_URL,
  multipleStatements: true,
  ssl:
    process.env.DATABASE_SSL === "true"
      ? { rejectUnauthorized: true }
      : undefined,
});
try {
  await conn.query(
    "CREATE TABLE IF NOT EXISTS schema_migrations (version VARCHAR(100) PRIMARY KEY, applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)",
  );
  for (const file of (await readdir(new URL("../database/", import.meta.url)))
    .filter((x) => x.endsWith(".sql"))
    .sort()) {
    const [rows] = await conn.execute(
      "SELECT version FROM schema_migrations WHERE version=?",
      [file],
    );
    if (rows.length) continue;
    // MySQL DDL commits implicitly. Migrations must be idempotent for safe recovery.
    await conn.query(
      await readFile(new URL("../database/" + file, import.meta.url), "utf8"),
    );
    await conn.execute("INSERT INTO schema_migrations(version) VALUES (?)", [
      file,
    ]);
    console.log("Applied " + file);
  }
} finally {
  await conn.end();
}
