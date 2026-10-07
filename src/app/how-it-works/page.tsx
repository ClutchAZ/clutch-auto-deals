import type { Metadata } from "next";
import Link from "next/link";
import { HowWeWork, OnYourSide, PageHead, QuoteSection } from "@/components/Sections";

export const metadata: Metadata = {
  title: "How We Work · What an Auto Broker Does",
  description: "How leasing or buying through Clutch Auto Deals works, start to finish: real numbers in writing, paperwork from home, pickup in Arizona or delivery nationwide.",
  alternates: { canonical: "/how-it-works" },
};

const faq = [
  ["What does an auto broker do?", "We shop the car across our dealer network, negotiate the price and lease or finance terms, and handle the paperwork. You deal with one person instead of a showroom and a finance office."],
  ["Do you charge a fee?", "Yes, a broker fee, which we tell you up front before you commit. It's paid when you lock in the car."],
  ["Is the payment I see on the site what I'll pay?", "The site shows sample payments on base MSRP. Before you sign, we send the full numbers in writing for the exact car: payment, due at signing, term, miles and fees."],
  ["Do I ever have to go to the dealership?", "Only if you want to pick the car up there. Otherwise we arrange delivery, and the paperwork happens remotely."],
  ["What do you need from me?", "Your driver's license, proof of insurance and a credit application. That's it."],
];

export default function HowItWorks() {
  return (
    <>
      <PageHead eyebrow="How we work" title="One text. Real numbers. Keys." lede="Leasing through Clutch is simple on purpose. Here's exactly what happens.">
        <Link className="btn btn-orange" href="/contact">Get started</Link>
      </PageHead>
      <HowWeWork />
      <OnYourSide />
      <section className="section">
        <div className="wrap stack" style={{ gap: 20, maxWidth: 900, marginLeft: "auto", marginRight: "auto" }}>
          <h2 className="disp" style={{ margin: 0, fontSize: 28 }}>Questions people ask us</h2>
          {faq.map(([q, a]) => (
            <details key={q} className="panel" style={{ padding: "20px 24px" }}>
              <summary style={{ cursor: "pointer", fontWeight: 700, fontSize: 18 }}>{q}</summary>
              <p style={{ marginTop: 12 }}>{a}</p>
            </details>
          ))}
        </div>
      </section>
      <QuoteSection />
    </>
  );
}
