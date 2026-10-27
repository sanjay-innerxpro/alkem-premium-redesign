import { test, after, before } from "node:test";
import assert from "node:assert/strict";
import { spawn, type ChildProcess } from "node:child_process";
import { randomUUID } from "node:crypto";
import { db } from "../src/lib/db";
import { hashPassword } from "../src/lib/password";
import type { RowDataPacket } from "mysql2/promise";
const enabled = !!process.env.DATABASE_URL && process.env.DEMO_MODE !== "true";
const origin = "http://127.0.0.1:4317";
const id = randomUUID();
const email = id + "@example.test";
const password = randomUUID();
let child: ChildProcess | undefined;
before(async () => {
  if (!enabled) return;
  await db().execute(
    "INSERT INTO admins(id,email,password_hash) VALUES (?,?,?)",
    [id, email, await hashPassword(password)],
  );
  child = spawn(
    process.execPath,
    [
      "node_modules/next/dist/bin/next",
      "start",
      "--hostname",
      "127.0.0.1",
      "--port",
      "4317",
    ],
    {
      env: {
        ...process.env,
        APP_URL: origin,
        COOKIE_SECURE: "false",
        DEMO_MODE: "false",
      },
      stdio: "ignore",
    },
  );
  for (let i = 0; i < 100; i++) {
    try {
      if ((await fetch(origin + "/admin/login")).status === 200) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error(
    "Integration server did not become ready. Build before running integration tests.",
  );
});
after(async () => {
  child?.kill("SIGTERM");
  if (enabled) {
    await db().execute("DELETE FROM admins WHERE id=?", [id]);
    await db().execute("DELETE FROM enquiries WHERE email=?", [email]);
    await db().end();
  }
});
const post = (
  path: string,
  body: object,
  headers: Record<string, string> = {},
) =>
  fetch(origin + path, {
    method: "POST",
    headers: { origin, "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
    redirect: "manual",
  });
test(
  "admin pages redirect anonymous visitors and cross-origin login is rejected",
  { skip: !enabled },
  async () => {
    const page = await fetch(origin + "/admin", { redirect: "manual" });
    assert.equal(page.status, 307);
    assert.equal(page.headers.get("location"), "/admin/login");
    assert.equal(
      (
        await post(
          "/api/auth/login",
          { email, password },
          { origin: "https://evil.test" },
        )
      ).status,
      403,
    );
  },
);
test(
  "admin login sets a protected session and logout revokes it",
  { skip: !enabled },
  async () => {
    assert.equal(
      (await post("/api/auth/login", { email, password: "incorrect" })).status,
      401,
    );
    const login = await post("/api/auth/login", { email, password });
    assert.equal(login.status, 200);
    const cookie = login.headers.get("set-cookie")!;
    assert.match(cookie, /HttpOnly/i);
    assert.match(cookie, /SameSite=lax/i);
    const session = cookie.split(";")[0];
    assert.equal(
      (await fetch(origin + "/admin", { headers: { cookie: session } })).status,
      200,
    );
    assert.equal(
      (
        await fetch(origin + "/api/auth/logout", {
          method: "POST",
          headers: { origin, cookie: session },
          redirect: "manual",
        })
      ).status,
      303,
    );
    assert.equal(
      (
        await fetch(origin + "/admin", {
          headers: { cookie: session },
          redirect: "manual",
        })
      ).status,
      307,
    );
  },
);
test(
  "contact API validates, persists and rate-limits actual MySQL messages",
  { skip: !enabled },
  async () => {
    const body = {
      name: "Integration Visitor",
      email,
      subject: "Integration test",
      message: "Disposable integration test message.",
    };
    assert.equal(
      (await post("/api/enquiries", { ...body, email: "invalid" })).status,
      400,
    );
    assert.equal(
      (await post("/api/enquiries", body, { origin: "https://evil.test" }))
        .status,
      403,
    );
    assert.equal((await post("/api/enquiries", body)).status, 201);
    const [rows] = await db().execute<RowDataPacket[]>(
      "SELECT message FROM enquiries WHERE email=?",
      [email],
    );
    assert.equal(rows[0].message, body.message);
    assert.equal((await post("/api/enquiries", body)).status, 201);
    assert.equal((await post("/api/enquiries", body)).status, 201);
    assert.equal((await post("/api/enquiries", body)).status, 429);
  },
);
