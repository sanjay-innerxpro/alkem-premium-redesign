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
// Enquiry forms: browsers always send Origin on a POST, so a foreign Origin is a cross-site
// request and is refused. Native clients (the mobile app) send none and are allowed;
// rate limits still apply to them.
export const acceptsEnquiryOrigin = (request: Request) =>
  request.headers.get("origin") === null || sameOrigin(request);
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
    // ON DUPLICATE KEY takes an exclusive row lock up front; INSERT IGNORE takes a shared
    // lock that deadlocks when concurrent requests upgrade it via FOR UPDATE.
    await conn.execute(
      "INSERT INTO rate_limits(bucket,attempts,reset_at) VALUES (?,0,DATE_ADD(UTC_TIMESTAMP(), INTERVAL ? SECOND)) ON DUPLICATE KEY UPDATE bucket=bucket",
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
