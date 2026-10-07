import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCatalog, pickFeatured } from "@/lib/deals";
import { CITIES, SITE } from "@/lib/site";
import { DealCard } from "@/components/DealCard";
import { HowWeWork, JsonLd, OnYourSide, PageHead, QuoteSection } from "@/components/Sections";

export const revalidate = 900;
export const dynamicParams = false;

export function generateStaticParams() {
  return CITIES.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params;
  const c = CITIES.find((x) => x.slug === city);
  if (!c) return {};
  return {
    title: `${c.name} Auto Broker · New Car Leasing`,
    description: `Clutch Auto Deals is a ${c.name}-area auto broker based in Gilbert, AZ. Pre-negotiated lease and finance deals on new cars, with pickup in the Valley or delivery to your door.`,
    alternates: { canonical: `/auto-broker/${c.slug}` },
  };
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const c = CITIES.find((x) => x.slug === city);
  if (!c) notFound();
  const { deals, brands } = await getCatalog();
  const picks = pickFeatured(deals, 4);
  return (
    <>
      <PageHead
        eyebrow={`${c.name}, Arizona`}
        title={`${c.name} auto broker`}
        lede={`Leasing or buying a new car in ${c.name}? We find it, negotiate it and handle the paperwork, so you skip the showroom. ${c.note}`}
      >
        <div className="row" style={{ gap: 12 }}>
          <Link className="btn btn-orange" href="#quote">Get a quote</Link>
          <a className="btn btn-ghost" href={SITE.smsHref}>Text us</a>
        </div>
      </PageHead>
      <section style={{ paddingBottom: 96 }}>
        <div className="wrap stack" style={{ gap: 28 }}>
          <div className="row between" style={{ gap: 16 }}>
            <h2 className="disp" style={{ margin: 0, fontSize: 28 }}>Deals {c.name} drivers are leasing this month</h2>
            <Link className="link-underline" href="/deals">All {deals.length} deals →</Link>
          </div>
          <div className="grid-4">
            {picks.map((d) => (
              <DealCard key={d.id} deal={d} />
            ))}
          </div>
          <p style={{ margin: 0, color: "var(--text-soft)", fontSize: 16 }}>
            Shop by brand:{" "}
            {brands.map((b, i) => (
              <span key={b.slug}>
                <Link href={`/lease-deals/${b.slug}`} style={{ borderBottom: "1px solid var(--line-3)" }}>{b.title}</Link>
                {i < brands.length - 1 ? " · " : ""}
              </span>
            ))}
          </p>
        </div>
      </section>
      <HowWeWork />
      <OnYourSide />
      <QuoteSection title={`Tell us the car. We'll get it to ${c.name}.`} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Auto broker",
          name: `Auto broker serving ${c.name}, AZ`,
          provider: { "@id": `${SITE.url}/#business` },
          areaServed: { "@type": "City", name: `${c.name}, Arizona` },
        }}
      />
    </>
  );
}
