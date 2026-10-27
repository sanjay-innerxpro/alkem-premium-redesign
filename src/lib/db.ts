import mysql, { type Pool } from "mysql2/promise";
const globalDb = globalThis as unknown as { alkemPool?: Pool };
export function db(): Pool {
  if (!process.env.DATABASE_URL)
    throw new Error(
      "DATABASE_URL is not configured. Set up MySQL or explicitly enable DEMO_MODE for read-only preview.",
    );
  if (!globalDb.alkemPool)
    globalDb.alkemPool = mysql.createPool({
      uri: process.env.DATABASE_URL,
      connectionLimit: 10,
      charset: "utf8mb4",
      timezone: "Z",
      ssl:
        process.env.DATABASE_SSL === "true"
          ? { rejectUnauthorized: true }
          : undefined,
    });
  return globalDb.alkemPool;
}
export const isDemo = () => process.env.DEMO_MODE === "true";
export function writable() {
  if (isDemo())
    throw new Error("Read-only preview: MySQL is required to save changes.");
}
