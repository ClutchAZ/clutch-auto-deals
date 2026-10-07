import type { Metadata } from "next";
import { PageHead } from "@/components/Sections";
import { QuoteForm } from "@/components/QuoteForm";

export const metadata: Metadata = {
  title: "Free Lease Deal Review · Is My Car Deal Good?",
  description: "Send us the dealer's lease or finance quote. We check money factor, residual, rebates and add-ons and tell you if it's a good deal, or beat it. Free, no credit pull.",
  alternates: { canonical: "/deal-review" },
};

export default function DealReview() {
  return (
    <>
      <PageHead
        eyebrow="Free deal review"
        title="Got a quote? Let us look."
        lede="Send the dealer's numbers. We'll go through them line by line and tell you straight: it's a good deal, or here's what it should be. If we can beat it, we will."
      />
      <section className="light section">
        <div className="wrap grid-2" style={{ gap: 64, alignItems: "start" }}>
          <div className="stack" style={{ gap: 22 }}>
            <h2 className="disp h3">What we check</h2>
            <ul className="stack" style={{ gap: 14, margin: 0, paddingLeft: 20, fontSize: 18, lineHeight: 1.6, color: "var(--ink-soft)" }}>
              <li>Selling price against MSRP and what other stores are doing this month</li>
              <li>Money factor or APR, and whether it's been marked up</li>
              <li>Residual value and every rebate or lease cash you qualify for</li>
              <li>Add-ons, protection packages and fees that don't belong</li>
              <li>Due at signing, and what's really in it</li>
            </ul>
            <p className="lede">
              Paste the numbers in the notes, or text a photo of the worksheet to (480) 530-6890. No credit pull, no
              obligation.
            </p>
          </div>
          <QuoteForm defaultType="Free deal review" messageLabel="Paste the dealer's numbers (price, payment, due at signing, term, miles)" submitLabel="Review my deal" />
        </div>
      </section>
    </>
  );
}
