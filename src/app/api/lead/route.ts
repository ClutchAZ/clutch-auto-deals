import { NextResponse } from "next/server";
import { submitLead } from "@/lib/wix";

const FIELDS = ["first_name", "last_name", "email", "phone", "request_type", "vehicle", "delivery_zip", "deal_reference", "message"] as const;
const TYPES = ["Lease quote", "Finance or cash quote", "Free deal review", "Sell my car", "Buy out my lease", "Something else"];

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  // Honeypot: bots fill hidden fields; quietly accept and drop.
  if (typeof body.company_website === "string" && body.company_website.trim()) {
    return NextResponse.json({ ok: true });
  }
  const values: Record<string, string> = {};
  for (const k of FIELDS) {
    const v = typeof body[k] === "string" ? (body[k] as string).trim().slice(0, 2000) : "";
    if (v) values[k] = v;
  }
  if (!values.first_name || !values.email || !values.phone) {
    return NextResponse.json({ error: "Name, email and phone are required." }, { status: 422 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    return NextResponse.json({ error: "Check the email address." }, { status: 422 });
  }
  if (!TYPES.includes(values.request_type)) values.request_type = "Something else";
  try {
    const res = await submitLead(values);
    if (!res.ok) {
      console.error("[lead] Wix rejected submission", res.error);
      return NextResponse.json({ error: "Could not send" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[lead] submit failed", err);
    return NextResponse.json({ error: "Could not send" }, { status: 502 });
  }
}
