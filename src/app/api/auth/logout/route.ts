import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db, isDemo } from "@/lib/db";
import { digest, sameOrigin } from "@/lib/security";
import { SESSION_COOKIE, sessionOptions } from "@/lib/auth";
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return new NextResponse("Invalid origin", { status: 403 });
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (token && !isDemo())
    await db().execute("DELETE FROM sessions WHERE token_hash=?", [
      digest(token),
    ]);
  const res = NextResponse.redirect(
    new URL("/admin/login", process.env.APP_URL || request.url),
    303,
  );
  res.cookies.set(SESSION_COOKIE, "", { ...sessionOptions(), maxAge: 0 });
  return res;
}
