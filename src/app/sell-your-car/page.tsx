import type { Metadata } from "next";
import { PageHead } from "@/components/Sections";
import { QuoteForm } from "@/components/QuoteForm";

export const metadata: Metadata = {
  title: "Sell Your Car or Get Out of Your Lease",
  description: "Sell your car or buy out your lease through Clutch Auto Deals. We shop it to our dealer network, bring back a written number and handle the payoff.",
  alternates: { canonical: "/sell-your-car" },
};

export default function Sell() {
  return (
    <>
      <PageHead
        eyebrow="Sell your car · Buy out my lease"
        title="Got a car or a lease to get out of?"
        lede="Send the year, model, mileage and a few photos. We shop it across our dealer network, bring back a written number and handle the payoff, whether or not you buy from us."
      />
      <section className="light section">
        <div className="wrap grid-2" style={{ gap: 64, alignItems: "start" }}>
          <div className="stack" style={{ gap: 18 }}>
            <h2 className="disp h3">How it goes</h2>
            <ol className="stack" style={{ gap: 14, margin: 0, paddingLeft: 22, fontSize: 18, lineHeight: 1.6, color: "var(--ink-soft)" }}>
              <li>Tell us about the car, and text photos to (480) 530-6890.</li>
              <li>We get offers from our dealer network and send you the best one in writing.</li>
              <li>Say yes, and we handle the payoff and paperwork.</li>
            </ol>
          </div>
          <QuoteForm defaultType="Sell my car" messageLabel="Year, model, mileage, condition, and any payoff amount" submitLabel="Get my number" />
        </div>
      </section>
    </>
  );
}
