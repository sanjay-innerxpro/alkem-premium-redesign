import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { randomBytes } from "node:crypto";
import { db, isDemo } from "./db";
import { digest } from "./security";
import type { RowDataPacket } from "mysql2/promise";
export const SESSION_COOKIE = "nexpharm_session";
export async function currentAdmin() {
  if (isDemo()) return null;
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const [rows] = await db().execute<RowDataPacket[]>(
    "SELECT a.id,a.email FROM sessions s JOIN admins a ON a.id=s.admin_id WHERE s.token_hash=? AND s.expires_at>UTC_TIMESTAMP()",
    [digest(token)],
  );
  return rows.length
    ? { id: String(rows[0].id), email: String(rows[0].email) }
    : null;
}
export async function requireAdmin() {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
export async function createSession(adminId: string) {
  const token = randomBytes(32).toString("hex");
  await db().execute("DELETE FROM sessions WHERE expires_at<=UTC_TIMESTAMP()");
  await db().execute(
    "INSERT INTO sessions(token_hash,admin_id,expires_at) VALUES (?,?,DATE_ADD(UTC_TIMESTAMP(),INTERVAL 8 HOUR))",
    [digest(token), adminId],
  );
  return token;
}
export const sessionOptions = () => ({
  httpOnly: true,
  secure:
    process.env.COOKIE_SECURE === "true" ||
    (process.env.NODE_ENV === "production" &&
      process.env.COOKIE_SECURE !== "false"),
  sameSite: "lax" as const,
  path: "/",
  maxAge: 8 * 60 * 60,
});
