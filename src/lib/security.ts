import { createHash } from "node:crypto";
import { db } from "./db";
import type { RowDataPacket } from "mysql2/promise";
export const digest = (input: string) =>
  createHash("sha256").update(input).digest("hex");
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const allowed = new URL(process.env.APP_URL || "http://localhost:3000")
    .origin;
  return origin === allowed;
}
export function clientKey(request: Request) {
  // Untrusted client headers must never defeat rate limiting. Shared bucket by default.
  return process.env.TRUST_PROXY === "true"
    ? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "shared"
    : "shared";
}
export async function rateLimit(
  key: string,
  max: number,
  windowSeconds: number,
) {
  const conn = await db().getConnection();
  try {
    await conn.beginTransaction();
    const bucket = digest(key);
    await conn.execute(
      "INSERT IGNORE INTO rate_limits(bucket,attempts,reset_at) VALUES (?,0,DATE_ADD(UTC_TIMESTAMP(), INTERVAL ? SECOND))",
      [bucket, windowSeconds],
    );
    const [rows] = await conn.execute<RowDataPacket[]>(
      "SELECT attempts,reset_at<=UTC_TIMESTAMP() AS expired FROM rate_limits WHERE bucket=? FOR UPDATE",
      [bucket],
    );
    if (rows[0].expired) {
      await conn.execute(
        "UPDATE rate_limits SET attempts=1,reset_at=DATE_ADD(UTC_TIMESTAMP(),INTERVAL ? SECOND) WHERE bucket=?",
        [windowSeconds, bucket],
      );
      await conn.commit();
      return true;
    }
    if (rows[0].attempts >= max) {
      await conn.commit();
      return false;
    }
    await conn.execute(
      "UPDATE rate_limits SET attempts=attempts+1 WHERE bucket=?",
      [bucket],
    );
    await conn.commit();
    return true;
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}
