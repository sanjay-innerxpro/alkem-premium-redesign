"use server";
import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { db, writable } from "@/lib/db";
import { contentSchema, settingsSchema } from "@/lib/validation";
import { collections, socialNetworks } from "@/lib/types";
import type { ResultSetHeader } from "mysql2/promise";
export type ActionState = { error?: string; success?: string };
async function audit(
  adminId: string,
  action: string,
  target: string,
  conn: import("mysql2/promise").PoolConnection,
) {
  await conn.execute(
    "INSERT INTO audit_log(admin_id,action,target) VALUES (?,?,?)",
    [adminId, action, target],
  );
}
export async function saveContent(
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin();
  writable();
  const parsed = contentSchema.safeParse({
    ...Object.fromEntries(form),
    published: form.get("published") === "on",
  });
  if (!parsed.success)
    return {
      error: parsed.error.issues
        .map((x) => x.path.join(".") + ": " + x.message)
        .join(" "),
    };
  const x = parsed.data;
  const isNew = !x.id;
  x.id = x.id || randomUUID();
  const conn = await db().getConnection();
  try {
    await conn.beginTransaction();
    if (isNew)
      await conn.execute(
        "INSERT INTO content(id,collection,slug,title,data,published,sort_order) VALUES (?,?,?,?,?,?,?)",
        [
          x.id,
          x.collection,
          x.slug,
          x.title,
          JSON.stringify(x),
          x.published,
          x.sortOrder,
        ],
      );
    else {
      const [result] = await conn.execute<ResultSetHeader>(
        "UPDATE content SET slug=?,title=?,data=?,published=?,sort_order=? WHERE id=? AND collection=?",
        [
          x.slug,
          x.title,
          JSON.stringify(x),
          x.published,
          x.sortOrder,
          x.id,
          x.collection,
        ],
      );
      if (!result.affectedRows) throw new Error("missing");
    }
    await audit(
      admin.id,
      isNew ? "content.create" : "content.update",
      x.collection + "/" + x.slug,
      conn,
    );
    await conn.commit();
  } catch (e) {
    await conn.rollback();
    return {
      error:
        (e as { code?: string }).code === "ER_DUP_ENTRY"
          ? "This slug is already used in this collection."
          : "Unable to save. The item may have been removed; refresh and try again.",
    };
  } finally {
    conn.release();
  }
  revalidatePath("/", "layout");
  redirect("/admin/content?collection=" + x.collection + "&saved=1");
}
export async function deleteContent(
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin();
  writable();
  const id = String(form.get("id") || "");
  const collection = String(form.get("collection") || "");
  if (!collections.includes(collection as (typeof collections)[number]) || !id)
    return { error: "Invalid item." };
  const conn = await db().getConnection();
  try {
    await conn.beginTransaction();
    await conn.execute("DELETE FROM content WHERE id=? AND collection=?", [
      id,
      collection,
    ]);
    await audit(admin.id, "content.delete", collection + "/" + id, conn);
    await conn.commit();
  } catch {
    await conn.rollback();
    return { error: "Unable to delete. Try again." };
  } finally {
    conn.release();
  }
  revalidatePath("/", "layout");
  redirect("/admin/content?collection=" + collection + "&deleted=1");
}
export async function saveSettings(
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin();
  writable();
  const data: Record<string, unknown> = {};
  for (const [key, value] of form.entries()) {
    if (key.startsWith("$ACTION")) continue;
    const parts = key.split(".");
    if (parts.length === 1) data[key] = value;
  }
  data.metrics = Array.from({ length: 4 }, (_, i) => ({
    value: form.get("metrics." + i + ".value"),
    label: form.get("metrics." + i + ".label"),
  }));
  data.social = Object.fromEntries(
    socialNetworks.map((k) => [k, form.get("social." + k) ?? ""]),
  );
  data.sections = Object.fromEntries(
    [
      "about",
      "products",
      "offerings",
      "innovation",
      "therapies",
      "impact",
      "sustainability",
      "careers",
      "news",
      "contact",
    ].map((key) => [
      key,
      Object.fromEntries(
        ["eyebrow", "title", "description", "imageUrl"].map((f) => [
          f,
          form.get("sections." + key + "." + f),
        ]),
      ),
    ]),
  );
  const parsed = settingsSchema.safeParse(data);
  if (!parsed.success)
    return {
      error: parsed.error.issues
        .map((x) => x.path.join(".") + ": " + x.message)
        .join(" "),
    };
  const conn = await db().getConnection();
  try {
    await conn.beginTransaction();
    await conn.execute("UPDATE settings SET data=? WHERE id=1", [
      JSON.stringify(parsed.data),
    ]);
    await audit(admin.id, "settings.update", "homepage", conn);
    await conn.commit();
  } catch {
    await conn.rollback();
    return { error: "Unable to save settings. Try again." };
  } finally {
    conn.release();
  }
  revalidatePath("/", "layout");
  return {
    success:
      "Website settings saved. Published pages now use your updated content.",
  };
}
export async function updateEnquiry(
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin();
  writable();
  const id = String(form.get("id") || "");
  const status = String(form.get("status") || "");
  if (!id || !["new", "read", "resolved", "delete"].includes(status))
    return { error: "Invalid action." };
  const conn = await db().getConnection();
  try {
    await conn.beginTransaction();
    if (status === "delete")
      await conn.execute("DELETE FROM enquiries WHERE id=?", [id]);
    else
      await conn.execute("UPDATE enquiries SET status=? WHERE id=?", [
        status,
        id,
      ]);
    await audit(admin.id, "enquiry." + status, id, conn);
    await conn.commit();
  } catch {
    await conn.rollback();
    return { error: "Unable to update enquiry." };
  } finally {
    conn.release();
  }
  revalidatePath("/admin");
  revalidatePath("/admin/enquiries");
  return {
    success: status === "delete" ? "Enquiry deleted." : "Enquiry updated.",
  };
}
