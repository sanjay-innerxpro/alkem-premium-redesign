import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { db, isDemo } from "@/lib/db";
import { enquirySchema } from "@/lib/validation";
import { acceptsEnquiryOrigin, clientKey, rateLimit } from "@/lib/security";
import { getItem, getContent } from "@/lib/content";
export async function POST(request: Request) {
  if (!acceptsEnquiryOrigin(request))
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  if (isDemo())
    return NextResponse.json(
      {
        error:
          "This is a read-only design preview. Messages cannot be sent until MySQL is connected.",
      },
      { status: 503 },
    );
  try {
    if (Number(request.headers.get("content-length") || 0) > 20000)
      return NextResponse.json({ error: "Message too long." }, { status: 413 });
    const raw = await request.text();
    if (raw.length > 20000)
      return NextResponse.json({ error: "Message too long." }, { status: 413 });
    const result = enquirySchema.safeParse(JSON.parse(raw));
    if (!result.success)
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 },
      );
    const data = result.data;
    if (data.website) return NextResponse.json({ ok: true });
    if (
      !(await rateLimit("enquiry-ip:" + clientKey(request), 10, 3600)) ||
      !(await rateLimit("enquiry-email:" + data.email.toLowerCase(), 3, 3600))
    )
      return NextResponse.json(
        { error: "Too many messages. Please try again in an hour." },
        { status: 429 },
      );
    let subject = data.subject;
    if (data.jobId) {
      const job = (await getContent("careers")).find(
        (x) => x.id === data.jobId,
      );
      if (!job)
        return NextResponse.json(
          { error: "This role is no longer available." },
          { status: 400 },
        );
      subject = ("Career enquiry: " + job.title).slice(0, 180);
    }
    await db().execute(
      "INSERT INTO enquiries(id,name,email,subject,message) VALUES (?,?,?,?,?)",
      [
        randomUUID(),
        data.name,
        data.email.toLowerCase(),
        subject,
        data.message,
      ],
    );
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Your message could not be saved. Please try again later." },
      { status: 503 },
    );
  }
}
