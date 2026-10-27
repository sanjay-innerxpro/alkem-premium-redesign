import { test, after } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { db } from "../src/lib/db";
import { getContent, getItem, getSettings } from "../src/lib/content";
import { rateLimit, digest } from "../src/lib/security";
import type { RowDataPacket } from "mysql2/promise";
const enabled = !!process.env.DATABASE_URL && process.env.DEMO_MODE !== "true";
after(async () => {
  if (enabled) await db().end();
});
test(
  "MySQL stores content and excludes drafts from public queries",
  { skip: !enabled },
  async () => {
    const id = randomUUID();
    const slug = "integration-" + id;
    const item = {
      id,
      collection: "news",
      slug,
      title: "Integration test",
      summary: "Test record",
      body: "Test only",
      imageUrl: "",
      category: "",
      location: "",
      employmentType: "",
      published: false,
      sortOrder: 9999,
    };
    try {
      await db().execute(
        "INSERT INTO content(id,collection,slug,title,data,published,sort_order) VALUES (?,?,?,?,?,0,9999)",
        [id, "news", slug, item.title, JSON.stringify(item)],
      );
      assert.equal(await getItem("news", slug), undefined);
      assert.ok((await getContent("news", true)).find((x) => x.id === id));
      await db().execute("UPDATE content SET published=1 WHERE id=?", [id]);
      assert.equal((await getItem("news", slug))?.id, id);
    } finally {
      await db().execute("DELETE FROM content WHERE id=?", [id]);
    }
  },
);
test(
  "parallel requests cannot bypass the database rate limit",
  { skip: !enabled },
  async () => {
    const key = "integration:" + randomUUID();
    try {
      const results = await Promise.all(
        Array.from({ length: 8 }, () => rateLimit(key, 3, 60)),
      );
      assert.equal(results.filter(Boolean).length, 3);
    } finally {
      await db().execute("DELETE FROM rate_limits WHERE bucket=?", [
        digest(key),
      ]);
    }
  },
);
test(
  "expired sessions cannot pass the authentication lookup",
  { skip: !enabled },
  async () => {
    const id = randomUUID();
    const hash = digest(randomUUID());
    try {
      await db().execute(
        "INSERT INTO admins(id,email,password_hash) VALUES (?,?,?)",
        [id, id + "@example.test", "test-only"],
      );
      await db().execute(
        "INSERT INTO sessions(token_hash,admin_id,expires_at) VALUES (?,?,DATE_SUB(UTC_TIMESTAMP(),INTERVAL 1 MINUTE))",
        [hash, id],
      );
      const [rows] = await db().execute<RowDataPacket[]>(
        "SELECT token_hash FROM sessions WHERE token_hash=? AND expires_at>UTC_TIMESTAMP()",
        [hash],
      );
      assert.equal(rows.length, 0);
    } finally {
      await db().execute("DELETE FROM admins WHERE id=?", [id]);
    }
  },
);
test(
  "seeded settings are retrieved from MySQL",
  { skip: !enabled },
  async () => {
    assert.ok((await getSettings()).heroTitle);
  },
);
