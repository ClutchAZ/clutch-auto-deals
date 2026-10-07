import type { Metadata } from "next";
import Link from "next/link";
import { getCatalog } from "@/lib/deals";
import { SITE } from "@/lib/site";
import { OnYourSide, PageHead, QuoteSection } from "@/components/Sections";

export const metadata: Metadata = {
  title: "About Clutch Auto Deals · Gilbert, AZ",
  description: "Clutch Auto Deals is a small auto broker team in Gilbert, Arizona, negotiating new-car leases and purchases for buyers across Arizona and the country.",
  alternates: { canonical: "/about" },
};

export default async function About() {
  const { brands } = await getCatalog();
  return (
    <>
      <PageHead
        eyebrow="About us"
        title="A small team in Gilbert that hates bad car deals."
        lede={`Clutch Auto Deals works for the buyer, not the dealer. We negotiate new-car leases and purchases across ${brands.length} brands and deliver them in Arizona and nationwide.`}
      >
        <a className="btn btn-orange" href={SITE.smsHref}>Text us</a>
      </PageHead>
      <OnYourSide />
      <section className="section">
        <div className="wrap grid-2" style={{ gap: 40 }}>
          <div className="panel stack" style={{ gap: 14 }}>
            <span className="eyebrow">Visit or call</span>
            <p className="mono" style={{ fontSize: 15, lineHeight: 1.8 }}>
              {SITE.address.street}
              <br />
              {SITE.address.city}, {SITE.address.region} {SITE.address.postalCode}
              <br />
              <a href={SITE.phoneHref}>{SITE.phone}</a>
              <br />
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </p>
          </div>
          <div className="panel stack" style={{ gap: 14 }}>
            <span className="eyebrow">Where we deliver</span>
            <p>
              Everywhere. Pick up at the dealer here in the Valley, or we'll ship the car to your driveway in any state.
            </p>
            <Link className="link-underline" href="/deals" style={{ alignSelf: "flex-start" }}>See this month's deals →</Link>
          </div>
        </div>
      </section>
      <QuoteSection />
    </>
  );
}
