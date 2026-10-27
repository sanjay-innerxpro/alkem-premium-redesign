import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";
const scrypt = promisify(scryptCallback);
export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return (
    salt + ":" + ((await scrypt(password, salt, 64)) as Buffer).toString("hex")
  );
}
export async function verifyPassword(password: string, encoded: string) {
  const [salt, key] = encoded.split(":");
  if (!salt || !key || key.length !== 128) return false;
  const actual = (await scrypt(password, salt, 64)) as Buffer;
  return timingSafeEqual(Buffer.from(key, "hex"), actual);
}
