import type { Metadata } from "next";
import { getCatalog } from "@/lib/deals";
import { formatUpdated } from "@/lib/format";
import { DealsBrowser } from "@/components/DealsBrowser";
import { PageHead } from "@/components/Sections";

export const revalidate = 900;

export const metadata: Metadata = {
  title: "New Car Lease Deals This Month",
  description:
    "This month's pre-negotiated lease deals on BMW, Mercedes-Benz, Lexus, Genesis, Honda, Ford and more. Filter by budget and brand, then lock it in with a Clutch broker.",
  alternates: { canonical: "/deals" },
};

export default async function DealsPage() {
  const { deals, brands, updated } = await getCatalog();
  const u = formatUpdated(updated);
  return (
    <div style={{ paddingBottom: 96 }}>
      <PageHead
        eyebrow={`This month's programs${u ? ` · updated ${u}` : ""}`}
        title="Lease deals"
        lede={`${deals.length} pre-negotiated programs across ${brands.length} brands. Pick one and lock it in, or ask us to source anything not listed.`}
      />
      <DealsBrowser
        deals={deals}
        brands={brands.map((b) => ({ title: b.title, slug: b.slug, count: b.count }))}
        initial={{}}
        readUrl
      />
      <div className="wrap" style={{ marginTop: 40 }}>
        <p className="fine">
          Sample payments on base MSRP. Unless a due-at-signing amount is shown, the first month plus taxes and fees is
          due at signing. Excludes taxes, registration and plates. Loyalty pricing requires a current lease or ownership
          of the same brand; conquest pricing requires a qualifying vehicle from another brand. All programs require
          credit approval and change monthly. We serve the entire United States; nationwide shipping can be arranged.
        </p>
      </div>
    </div>
  );
}
