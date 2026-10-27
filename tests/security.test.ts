import { test } from "node:test";
import assert from "node:assert/strict";
import { hashPassword, verifyPassword } from "../src/lib/password";
import {
  safeImage,
  contentSchema,
  enquirySchema,
  settingsSchema,
} from "../src/lib/validation";
import { defaultContent, defaultSettings } from "../src/lib/defaults";
import { sameOrigin, digest } from "../src/lib/security";

test("passwords are salted, verifiable and reject incorrect credentials", async () => {
  const a = await hashPassword("correct-password-123");
  const b = await hashPassword("correct-password-123");
  assert.notEqual(a, b);
  assert.ok(await verifyPassword("correct-password-123", a));
  assert.equal(await verifyPassword("incorrect-password", a), false);
  assert.equal(await verifyPassword("x", "invalid"), false);
});
test("image values cannot execute script or point to insecure/protocol-relative hosts", () => {
  for (const v of [
    "javascript:alert(1)",
    "//evil.example/file.svg",
    "http://example.com/x",
    "/\\evil.example/x",
    "data:text/html,test",
  ])
    assert.equal(safeImage.safeParse(v).success, false, v);
  for (const v of ["/science.svg", "https://example.com/image.jpg", ""])
    assert.equal(safeImage.safeParse(v).success, true, v);
});
test("content enforces URL-safe slugs and bounded data", () => {
  const item = defaultContent[0];
  assert.ok(contentSchema.safeParse(item).success);
  for (const slug of ["../admin", "hello world", "<script>", "/test", "UPPER"])
    assert.equal(contentSchema.safeParse({ ...item, slug }).success, false);
  assert.equal(
    contentSchema.safeParse({ ...item, title: "x".repeat(181) }).success,
    false,
  );
  assert.equal(
    contentSchema.safeParse({ ...item, sortOrder: -1 }).success,
    false,
  );
});
test("settings seed matches the same schema used by the CMS", () => {
  assert.ok(settingsSchema.safeParse(defaultSettings).success);
  for (const item of defaultContent)
    assert.ok(contentSchema.safeParse(item).success);
});
test("enquiries require a real-shaped email and useful message", () => {
  const input = {
    name: "Test Visitor",
    email: "test@example.com",
    subject: "A test enquiry",
    message: "Please share more details.",
  };
  assert.ok(enquirySchema.safeParse(input).success);
  assert.equal(
    enquirySchema.safeParse({ ...input, email: "invalid" }).success,
    false,
  );
  assert.equal(
    enquirySchema.safeParse({ ...input, message: "x" }).success,
    false,
  );
});
test("state-changing APIs reject absent and foreign Origins", () => {
  process.env.APP_URL = "https://example.test";
  assert.equal(
    sameOrigin(new Request("https://example.test/api/enquiries")),
    false,
  );
  assert.equal(
    sameOrigin(
      new Request("https://example.test/api/enquiries", {
        headers: { origin: "https://evil.test" },
      }),
    ),
    false,
  );
  assert.equal(
    sameOrigin(
      new Request("https://example.test/api/enquiries", {
        headers: { origin: "https://example.test" },
      }),
    ),
    true,
  );
});
test("session and rate keys use deterministic SHA-256 digests", () => {
  assert.equal(digest("token").length, 64);
  assert.notEqual(digest("token"), digest("other"));
});
