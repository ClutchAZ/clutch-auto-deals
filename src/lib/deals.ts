import "server-only";
import { cache } from "react";
import { fetchBrands, fetchDeals, fetchImageLibrary } from "./wix";
import type { Brand, BodyStyle, Deal, RawDeal, VehicleImage } from "./types";
import { slugify } from "./format";
export { money, slugify, formatUpdated } from "./format";

// "GLE 53 AMG" and "AMG GLE 53" should match the same library entry.
const modelKey = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9+ ]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .sort()
    .join(" ");

// Wix stores images as wix:image://v1/<mediaId>/<name>. Turn that into a CDN URL.
export function wixImageUrl(v: string | null | undefined, width = 1200): string | null {
  if (!v) return null;
  if (v.startsWith("http")) return v;
  const m = v.match(/^wix:image:\/\/v1\/([^/#]+)/);
  if (!m) return null;
  const id = m[1];
  return `https://static.wixstatic.com/media/${id}/v1/fit/w_${width},h_${Math.round(width * 0.66)},q_90/${id.replace(/~mv2/, "")}`;
}

function imaginUrl(entry: VehicleImage | null, deal: RawDeal): string | null {
  const key = process.env.IMAGIN_CUSTOMER_KEY;
  if (!key) return null;
  const p = new URLSearchParams({
    customer: key,
    make: slugify(deal.make),
    modelFamily: entry?.imaginModelFamily || slugify(entry?.model || deal.model),
    modelYear: String(deal.year),
    angle: "01",
    zoomType: "fullscreen",
  });
  if (entry?.imaginModelRange) p.set("modelRange", entry.imaginModelRange);
  if (entry?.imaginModelVariant) p.set("modelVariant", entry.imaginModelVariant);
  if (entry?.paintDescription) p.set("paintDescription", entry.paintDescription);
  return `https://cdn.imagin.studio/getImage?${p.toString()}`;
}

// Image order: a photo on the deal itself, then the best library match
// (same make + model or alias, preferring matching trim and year), then IMAGIN, then none.
function findLibraryEntry(lib: VehicleImage[], d: RawDeal): VehicleImage | null {
  const mk = d.make.toLowerCase();
  const target = modelKey(d.model);
  const trim = (d.trim || "").toLowerCase();
  let best: { e: VehicleImage; score: number } | null = null;
  for (const e of lib) {
    if (e.make.toLowerCase() !== mk) continue;
    const names = [e.model, ...(e.aliases || [])].map(modelKey);
    if (!names.includes(target)) continue;
    let score = 1;
    if (e.trim) {
      if (!trim.includes(e.trim.toLowerCase())) continue;
      score += 2;
    }
    if (e.modelYear) {
      if (e.modelYear !== d.year) continue;
      score += 1;
    }
    if (e.image) score += 4;
    if (!best || score > best.score) best = { e, score };
  }
  return best?.e || null;
}

const SUV = /^(gl[abces]|g-class|eqe suv|eqs suv|x\d|xm|ix|q[x]|rx|nx|tx|ux|lx|gx|rz|gv\d|cr-v|hr-v|pilot|passport|explorer|expedition|bronco|wrangler|grand cherokee|compass|cherokee|traverse|trailblazer|trax|equinox|tahoe|suburban|stelvio|tonale|maybach gls|amg gl)/i;
const TRUCK = /^(1500|2500|f-150|f-250|silverado|colorado|maverick|ridgeline|gladiator|sierra|tacoma|tundra)/i;
const VAN = /^(pacifica|odyssey|sienna|carnival)/i;
const COUPE = /(coupe|convertible|z4|m2|m4|mustang|cle|amg gt|8 series)/i;

function bodyStyle(d: RawDeal): BodyStyle {
  const m = d.model.replace(/^amg\s+/i, "");
  if (TRUCK.test(m)) return "truck";
  if (VAN.test(m)) return "van";
  if (SUV.test(m) || SUV.test(d.model)) return "suv";
  if (COUPE.test(`${d.model} ${d.trim || ""}`)) return "coupe";
  return "sedan";
}

const TAG_ORDER = ["PREORDER", "LOYALTY", "CONQUEST", "FLEET", "LOANER", "DEMO", "INBOUND", "NEW"];

export function enrich(d: RawDeal, brands: Brand[], lib: VehicleImage[]): Deal {
  const brand = brands.find((b) => b.title.toLowerCase() === d.make.toLowerCase()) || null;
  const loyalty = d.monthlyLoyalty || null;
  const all = d.monthlyAllQualify || null;
  const payment = loyalty || all || 0;
  const tags = d.badges.map((b) => b.toUpperCase());
  const hasL = tags.includes("LOYALTY");
  const hasC = tags.includes("CONQUEST");
  const paymentLabel = loyalty
    ? tags.includes("FLEET")
      ? "with fleet pricing"
      : hasL && hasC
        ? "with loyalty or conquest"
        : hasC
          ? "with conquest"
          : "with loyalty"
    : hasC
      ? "conquest required"
      : "all customers qualify";
  const entry = findLibraryEntry(lib, d);
  const image = wixImageUrl(d.photo) || wixImageUrl(entry?.image) || imaginUrl(entry, d);
  const title = `${d.year} ${d.make} ${d.model}${d.trim && d.trim !== d.model ? " " + d.trim : ""}`;
  const slugBase = slugify(`${d.year} ${d.make} ${d.model} ${d.trim && d.trim !== d.model ? d.trim : ""}`);
  return {
    id: d.id,
    slug: `${slugBase}-${slugify(d.dealNumber || d.id.slice(0, 8))}`,
    dealNumber: d.dealNumber,
    year: d.year,
    make: d.make,
    makeSlug: brand?.slug || slugify(d.make),
    model: d.model,
    trim: d.trim && d.trim !== d.model ? d.trim : null,
    title,
    msrp: d.msrp,
    discountPct: d.discountPct,
    payment,
    paymentLabel,
    allQualify: loyalty && all && all !== loyalty ? all : null,
    dueAtSigning: d.dueAtSigning ?? brand?.defaultDueAtSigning ?? null,
    termMonths: d.termMonths ?? brand?.defaultTermMonths ?? null,
    milesPerYear: d.milesPerYear ?? brand?.defaultMilesPerYear ?? null,
    badges: tags,
    tag: TAG_ORDER.find((t) => tags.includes(t)) || "NEW",
    featured: d.featured,
    image,
    bodyStyle: bodyStyle(d),
    finePrint:
      d.finePrint ||
      brand?.finePrint ||
      "Sample payments on base MSRP. Excludes taxes, registration and plates. With approved credit. Programs change monthly.",
    requirements: brand?.requirements || null,
    programMonth: brand?.programMonth || null,
    lastUpdated: d.lastUpdated,
  };
}

export const getCatalog = cache(async () => {
  const [raw, brands, lib] = await Promise.all([fetchDeals(), fetchBrands(), fetchImageLibrary()]);
  const deals = raw
    .filter((d) => d.make && d.model && (d.monthlyLoyalty || d.monthlyAllQualify))
    .map((d) => enrich(d, brands, lib))
    .sort((a, b) => a.payment - b.payment);
  const activeBrands = brands
    .filter((b) => b.active !== false)
    .map((b) => ({ ...b, count: deals.filter((d) => d.make.toLowerCase() === b.title.toLowerCase()).length }))
    .filter((b) => b.count > 0)
    .sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99));
  const updated = deals.map((d) => d.lastUpdated).filter(Boolean).sort().pop() || null;
  return { deals, brands: activeBrands, updated };
});

export async function getDeal(slug: string) {
  const { deals } = await getCatalog();
  return deals.find((d) => d.slug === slug) || null;
}

// Homepage picks: deals flagged "featured" in Wix first, then the lowest payment
// from each of the top brands so the row is never empty or one-brand.
export function pickFeatured(deals: Deal[], n = 4): Deal[] {
  const picked: Deal[] = deals.filter((d) => d.featured);
  const seen = new Set(picked.map((d) => d.make));
  for (const d of deals) {
    if (picked.length >= n) break;
    if (seen.has(d.make)) continue;
    if (d.tag === "FLEET" || d.tag === "LOANER") continue;
    picked.push(d);
    seen.add(d.make);
  }
  return picked.slice(0, n);
}

