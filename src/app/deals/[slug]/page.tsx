import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCatalog, getDeal } from "@/lib/deals";
import { money } from "@/lib/format";
import { SITE } from "@/lib/site";
import { BigSticker } from "@/components/BigSticker";
import { DealCard } from "@/components/DealCard";
import { JsonLd } from "@/components/Sections";
import { QuoteForm } from "@/components/QuoteForm";
import { VehicleImage } from "@/components/VehicleImage";

export const revalidate = 900;
export const dynamicParams = true;

export async function generateStaticParams() {
  const { deals } = await getCatalog();
  return deals.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = await getDeal(slug);
  if (!d) return { title: "Deal not found" };
  const title = `${d.title} Lease: ${money(d.payment)}/mo`;
  return {
    title,
    description: `${d.title} lease from ${money(d.payment)}/mo for ${d.termMonths || "—"} months (${d.paymentLabel}). MSRP ${money(d.msrp)}. Arizona pickup or nationwide delivery through Clutch Auto Deals.`,
    alternates: { canonical: `/deals/${d.slug}` },
    openGraph: { title, images: d.image ? [{ url: d.image }] : undefined },
  };
}

export default async function DealPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const deal = await getDeal(slug);
  if (!deal) notFound();
  const { deals } = await getCatalog();
  const similar = deals
    .filter((d) => d.id !== deal.id && (d.model === deal.model || d.make === deal.make))
    .sort((a, b) => Math.abs(a.payment - deal.payment) - Math.abs(b.payment - deal.payment))
    .slice(0, 4);

  const requirements: string[] = [];
  if (deal.badges.includes("LOYALTY")) requirements.push(`Loyalty pricing: you currently lease or own a ${deal.make}.`);
  if (deal.badges.includes("CONQUEST")) requirements.push(`Conquest pricing: you currently lease or own a qualifying vehicle from another brand.`);
  if (deal.badges.includes("DEMO") || deal.badges.includes("LOANER")) requirements.push("Demo or loaner unit with some miles. Full-factory warranty from in-service date; ask us for the unit's details.");
  if (deal.badges.includes("FLEET")) requirements.push("Fleet pricing applies where eligible.");
  if (deal.badges.includes("PREORDER")) requirements.push("Pre-order: we lock the program now and deliver when the car arrives.");
  if (deal.requirements) requirements.push(deal.requirements);

  const ld = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: deal.title,
    brand: { "@type": "Brand", name: deal.make },
    model: deal.model,
    vehicleModelDate: String(deal.year),
    itemCondition: "https://schema.org/NewCondition",
    ...(deal.image ? { image: deal.image } : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: deal.payment,
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: deal.payment,
        priceCurrency: "USD",
        unitCode: "MON",
        referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" },
      },
      availability: "https://schema.org/InStock",
      url: `${SITE.url}/deals/${deal.slug}`,
      seller: { "@id": `${SITE.url}/#business` },
    },
  };

  return (
    <>
      <section style={{ padding: "40px 0 96px" }}>
        <div className="wrap stack" style={{ gap: 28 }}>
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/deals">Deals</Link>
            <span aria-hidden="true">/</span>
            <Link href={`/lease-deals/${deal.makeSlug}`}>{deal.make}</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{deal.model}</span>
          </nav>
          <div className="detail-grid">
            <div className="stack" style={{ gap: 28 }}>
              <div className="sticker" style={{ overflow: "hidden" }}>
                <VehicleImage src={deal.image} alt={deal.title} bodyStyle={deal.bodyStyle} priority />
              </div>
              <div className="stack" style={{ gap: 16 }}>
                <span className="eyebrow">
                  {deal.dealNumber ? `Program ${deal.dealNumber}` : "Lease program"}
                  {deal.programMonth ? ` · ${deal.programMonth}` : ""}
                </span>
                <p className="lede">
                  {deal.title} for {money(deal.payment)} a month, {deal.paymentLabel}
                  {deal.termMonths ? `, over ${deal.termMonths} months` : ""}. Pick it up from the dealer in Arizona or
                  have it shipped to you. Tell us your ZIP and we'll confirm availability, color and the final numbers in
                  writing.
                </p>
                {requirements.length > 0 && (
                  <ul className="stack" style={{ gap: 8, margin: 0, paddingLeft: 20, color: "var(--text-soft)", fontSize: 16, lineHeight: 1.55 }}>
                    {requirements.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                )}
                <p className="fine">{deal.finePrint}</p>
              </div>
            </div>
            <div className="stack" style={{ gap: 24 }}>
              <BigSticker deal={deal} headingLevel="h1" />
              <div id="lock">
                <QuoteForm
                  vehicle={deal.title}
                  dealReference={`${deal.dealNumber || deal.id} · ${deal.title} · ${money(deal.payment)}/mo`}
                  submitLabel="Lock in this deal"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {similar.length > 0 && (
        <section style={{ paddingBottom: 104 }}>
          <div className="wrap stack" style={{ gap: 28 }}>
            <div className="row between" style={{ gap: 16 }}>
              <h2 className="disp" style={{ margin: 0, fontSize: 28 }}>Similar deals</h2>
              <Link className="link-underline" href={`/lease-deals/${deal.makeSlug}`}>
                All {deal.make} deals →
              </Link>
            </div>
            <div className="grid-4">
              {similar.map((d) => (
                <DealCard key={d.id} deal={d} />
              ))}
            </div>
          </div>
        </section>
      )}
      <JsonLd data={ld} />
    </>
  );
}
