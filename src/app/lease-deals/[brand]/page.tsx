import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCatalog } from "@/lib/deals";
import { formatUpdated, money } from "@/lib/format";
import { DealsBrowser } from "@/components/DealsBrowser";
import { JsonLd, PageHead, QuoteSection } from "@/components/Sections";
import { SITE } from "@/lib/site";

export const revalidate = 900;

export async function generateStaticParams() {
  const { brands } = await getCatalog();
  return brands.map((b) => ({ brand: b.slug }));
}

async function load(slug: string) {
  const { deals, brands, updated } = await getCatalog();
  const brand = brands.find((b) => b.slug === slug);
  if (!brand) return null;
  const list = deals.filter((d) => d.makeSlug === slug);
  return { brand, list, updated };
}

export async function generateMetadata({ params }: { params: Promise<{ brand: string }> }): Promise<Metadata> {
  const { brand: slug } = await params;
  const x = await load(slug);
  if (!x) return { title: "Brand not found" };
  const low = x.list[0];
  return {
    title: `${x.brand.title} Lease Deals in Arizona${x.brand.programMonth ? ` · ${x.brand.programMonth}` : ""}`,
    description: `${x.list.length} ${x.brand.title} lease programs${low ? ` from ${money(low.payment)}/mo` : ""}. Pre-negotiated by Clutch Auto Deals in Gilbert, AZ, with Arizona pickup or nationwide delivery.`,
    alternates: { canonical: `/lease-deals/${slug}` },
  };
}

export default async function BrandPage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand: slug } = await params;
  const x = await load(slug);
  if (!x) notFound();
  const { brand, list, updated } = x;
  const low = list[0];
  const models = Array.from(new Set(list.map((d) => d.model)));
  const month = brand.programMonth || (formatUpdated(updated) ? `updated ${formatUpdated(updated)}` : "this month");
  const faq = [
    {
      q: `What's the lowest ${brand.title} lease payment right now?`,
      a: low
        ? `${low.title} at ${money(low.payment)} a month (${low.paymentLabel})${low.termMonths ? ` for ${low.termMonths} months` : ""}. Taxes, registration and plates are extra.`
        : `Programs change monthly. Text us and we'll send the current numbers.`,
    },
    {
      q: `Do I have to live in Arizona to lease a ${brand.title} through Clutch?`,
      a: `No. We're based in Gilbert and work with buyers nationwide. You can pick up at the dealer or have the car shipped to you.`,
    },
    {
      q: `Can you get a ${brand.title} that isn't listed here?`,
      a: `Yes. These are the programs we've pre-negotiated this month. Tell us the model, trim and color you want and we'll source it.`,
    },
  ];
  return (
    <>
      <PageHead
        eyebrow={`${brand.title} · ${month}`}
        title={brand.headline || `${brand.title} lease deals`}
        lede={
          brand.intro ||
          `${list.length} ${brand.title} programs${low ? ` from ${money(low.payment)} a month` : ""}, across ${models.length} models. Negotiated by our team in Gilbert, picked up in Arizona or delivered nationwide.`
        }
      >
        <Link className="btn btn-orange" href="#quote">
          Ask about a {brand.title}
        </Link>
      </PageHead>
      {brand.requirements && (
        <div className="wrap" style={{ marginBottom: 24 }}>
          <p className="fine" style={{ color: "var(--text-soft)" }}>{brand.requirements}</p>
        </div>
      )}
      <div style={{ paddingBottom: 72 }}>
        <DealsBrowser
          deals={list}
          brands={[{ title: brand.title, slug: brand.slug, count: list.length }]}
          initial={{ brand: brand.slug }}
          lockBrand
        />
        <div className="wrap" style={{ marginTop: 40 }}>
          <p className="fine">{brand.finePrint}</p>
        </div>
      </div>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap stack" style={{ gap: 24, maxWidth: 900, marginLeft: "auto", marginRight: "auto" }}>
          <h2 className="disp" style={{ margin: 0, fontSize: 28 }}>{brand.title} leasing questions</h2>
          {faq.map((f) => (
            <details key={f.q} className="panel" style={{ padding: "20px 24px" }}>
              <summary style={{ cursor: "pointer", fontWeight: 700, fontSize: 18 }}>{f.q}</summary>
              <p style={{ marginTop: 12 }}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>
      <QuoteSection title={`Want a ${brand.title}? Tell us which one.`} vehicle={`${brand.title} `} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Deals", item: `${SITE.url}/deals` },
            { "@type": "ListItem", position: 2, name: `${brand.title} lease deals`, item: `${SITE.url}/lease-deals/${brand.slug}` },
          ],
        }}
      />
    </>
  );
}
