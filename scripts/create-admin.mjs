import { register } from "node:module";
import { createInterface } from "node:readline/promises";
import { randomUUID } from "node:crypto";
register("tsx/esm", import.meta.url);
const { hashPassword } = await import("../src/lib/password.ts");
const { db } = await import("../src/lib/db.ts");
// Read a JSON object from stdin to keep passwords out of process arguments and shell history.
const chunks = [];
for await (const chunk of process.stdin) chunks.push(chunk);
const { email, password } = JSON.parse(Buffer.concat(chunks).toString("utf8"));
if (
  typeof email !== "string" ||
  !/^\S+@\S+\.\S+$/.test(email) ||
  typeof password !== "string" ||
  password.length < 12 ||
  password.length > 200
)
  throw new Error(
    "Provide JSON on stdin with a valid email and a password of 12–200 characters.",
  );
const pool = db();
try {
  await pool.execute(
    "INSERT INTO admins(id,email,password_hash) VALUES (?,?,?)",
    [randomUUID(), email.trim().toLowerCase(), await hashPassword(password)],
  );
  console.log("Admin created.");
} finally {
  await pool.end();
}
