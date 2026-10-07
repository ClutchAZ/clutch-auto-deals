import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { PageHead } from "@/components/Sections";

export const metadata: Metadata = { title: "Terms", alternates: { canonical: "/terms" } };

export default function Terms() {
  return (
    <>
      <PageHead eyebrow="Legal" title="Terms" />
      <section style={{ paddingBottom: 104 }}>
        <div className="wrap prose">
          <h2>Advertised payments</h2>
          <p>Payments shown on this site are sample payments on base MSRP. They exclude taxes, registration, plates and dealer fees unless stated, require approved credit, and may depend on loyalty, conquest or other eligibility. Programs change monthly and vehicles are subject to availability. Your final numbers are the ones we send you in writing for a specific vehicle.</p>
          <h2>Broker fee</h2>
          <p>Clutch Auto Deals charges a broker fee for its services. We tell you the amount before you commit.</p>
          <h2>Images</h2>
          <p>Vehicle images are for illustration. Color, trim and equipment of the actual vehicle may differ.</p>
          <h2>Questions</h2>
          <p>Email <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or call {SITE.phone}.</p>
        </div>
      </section>
    </>
  );
}
