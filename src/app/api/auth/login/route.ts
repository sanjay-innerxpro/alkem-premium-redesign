import { NextResponse } from "next/server";
import { db, isDemo } from "@/lib/db";
import { sameOrigin, clientKey, rateLimit } from "@/lib/security";
import { createSession, sessionOptions, SESSION_COOKIE } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";
import type { RowDataPacket } from "mysql2/promise";
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  if (isDemo())
    return NextResponse.json(
      {
        error: "Read-only preview. Configure MySQL to use the content studio.",
      },
      { status: 503 },
    );
  try {
    const raw = await request.text();
    if (raw.length > 20000)
      return NextResponse.json(
        { error: "Request too large." },
        { status: 413 },
      );
    const body = JSON.parse(raw);
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (!email || email.length > 254 || password.length > 200)
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 400 },
      );
    const ip = clientKey(request);
    if (
      !(await rateLimit("login-ip:" + ip, 30, 900)) ||
      !(await rateLimit("login-email:" + email, 5, 900))
    )
      return NextResponse.json(
        { error: "Too many attempts. Try again in 15 minutes." },
        { status: 429 },
      );
    const [rows] = await db().execute<RowDataPacket[]>(
      "SELECT id,password_hash FROM admins WHERE email=?",
      [email],
    );
    const dummy = "00000000000000000000000000000000:" + "0".repeat(128);
    const valid = await verifyPassword(
      password,
      rows[0]?.password_hash || dummy,
    );
    if (!rows.length || !valid)
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    const token = await createSession(rows[0].id);
    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, token, sessionOptions());
    return res;
  } catch {
    return NextResponse.json(
      { error: "Sign-in is unavailable. Please try again later." },
      { status: 503 },
    );
  }
}
