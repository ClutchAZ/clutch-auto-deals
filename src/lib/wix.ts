import "server-only";
import dealsSnapshot from "@/data/deals-snapshot.json";
import brandsSnapshot from "@/data/brands-snapshot.json";
import imagesSnapshot from "@/data/images-snapshot.json";
import type { RawDeal, Brand, VehicleImage } from "./types";

// Wix is the back office: deals, brand programs, the image library and lead forms
// all live there. This file is the only place the site talks to Wix.

const API = "https://www.wixapis.com";
const CLIENT_ID = process.env.WIX_CLIENT_ID || "70dd81ca-f940-4ee0-bb72-8b14cf26d267";
export const REVALIDATE_SECONDS = 900; // pages refresh from Wix at most every 15 minutes

let cachedToken: { value: string; expires: number } | null = null;

export async function visitorToken(): Promise<string> {
  if (cachedToken && cachedToken.expires > Date.now() + 60_000) return cachedToken.value;
  const res = await fetch(`${API}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clientId: CLIENT_ID, grantType: "anonymous" }),
    // A visitor token lasts 4 hours; reuse it for an hour so pages can be cached.
    cache: "force-cache",
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`Wix token ${res.status}`);
  const json = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = { value: json.access_token, expires: Date.now() + json.expires_in * 1000 };
  return json.access_token;
}

async function queryAll<T>(collection: string, filter: Record<string, unknown> = {}): Promise<T[]> {
  const token = await visitorToken();
  const out: T[] = [];
  for (let offset = 0; offset < 2000; offset += 100) {
    const res = await fetch(`${API}/wix-data/v2/items/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify({ dataCollectionId: collection, query: { filter, paging: { limit: 100, offset } } }),
      cache: "force-cache",
      next: { revalidate: REVALIDATE_SECONDS, tags: ["wix", `wix:${collection}`] },
    });
    if (!res.ok) throw new Error(`Wix ${collection} ${res.status}`);
    const json = (await res.json()) as { dataItems?: { id: string; data: T }[] };
    const items = json.dataItems || [];
    out.push(...items.map((i) => ({ ...i.data, id: i.id }) as T));
    if (items.length < 100) break;
  }
  return out;
}

function warn(what: string, err: unknown) {
  console.warn(`[wix] using snapshot for ${what}: ${(err as Error).message}`);
}

export async function fetchDeals(): Promise<RawDeal[]> {
  try {
    const rows = await queryAll<Record<string, unknown>>("Deals", { active: true });
    return rows.map((x) => ({
      id: String(x.id),
      dealNumber: (x.dealNumber as string) || null,
      year: Number(x.year),
      make: String(x.make || ""),
      model: String(x.model || ""),
      trim: (x.trim as string) || null,
      msrp: (x.msrp as number) || null,
      discountPct: (x.discountPct as number) || null,
      monthlyLoyalty: (x.monthlyLoyalty as number) || null,
      monthlyAllQualify: (x.monthlyAllQualify as number) || null,
      dueAtSigning: (x.dueAtSigning as number) || null,
      termMonths: (x.termMonths as number) || null,
      milesPerYear: (x.milesPerYear as number) || null,
      badges: String(x.badges || "").split(",").map((b) => b.trim()).filter(Boolean),
      featured: Boolean(x.featured),
      photo: ((x.photo || x.image) as string) || null,
      finePrint: (x.finePrint as string) || null,
      lastUpdated: (x.lastUpdated as string) || null,
    }));
  } catch (err) {
    warn("deals", err);
    return dealsSnapshot as RawDeal[];
  }
}

export async function fetchBrands(): Promise<Brand[]> {
  try {
    const rows = await queryAll<Brand>("Brands");
    return rows.length ? rows : (brandsSnapshot as Brand[]);
  } catch (err) {
    warn("brands", err);
    return brandsSnapshot as Brand[];
  }
}

export async function fetchImageLibrary(): Promise<VehicleImage[]> {
  try {
    return await queryAll<VehicleImage>("VehicleImages");
  } catch (err) {
    warn("image library", err);
    return imagesSnapshot as VehicleImage[];
  }
}

// Submit a lead into the "Website Quote Request" Wix form. Submissions show up in
// Wix Forms & Submissions and create/update the contact in the Wix CRM.
export async function submitLead(values: Record<string, string>): Promise<{ ok: boolean; id?: string; error?: string }> {
  const formId = process.env.WIX_LEAD_FORM_ID || "ec479b25-9b2f-4481-bd4f-d157c43c8e75";
  const token = await visitorToken();
  const res = await fetch(`${API}/form-submission-service/v4/submissions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: token },
    body: JSON.stringify({ submission: { formId, submissions: values } }),
    cache: "no-store",
  });
  if (!res.ok) return { ok: false, error: `${res.status} ${await res.text()}` };
  const json = (await res.json()) as { submission?: { id?: string } };
  return { ok: true, id: json.submission?.id };
}
