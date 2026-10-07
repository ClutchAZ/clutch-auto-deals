import Link from "next/link";
import type { Deal } from "@/lib/types";
import { formatUpdated, money } from "@/lib/format";
import { StickerBand } from "./DealCard";
import { VehicleImage } from "./VehicleImage";

export function BigSticker({
  deal,
  cta,
  tilt = false,
  showImage = false,
  headingLevel = "h2",
}: {
  deal: Deal;
  cta?: { href: string; label: string };
  tilt?: boolean;
  showImage?: boolean;
  headingLevel?: "h1" | "h2";
}) {
  const H = headingLevel;
  const updated = formatUpdated(deal.lastUpdated);
  const cells: [string, string][] = [
    ["Term", deal.termMonths ? `${deal.termMonths} mo` : "Ask us"],
    ["MSRP", money(deal.msrp)],
    ["Due at signing", deal.dueAtSigning ? money(deal.dueAtSigning) : "1st mo + fees"],
    ["Miles / yr", deal.milesPerYear ? deal.milesPerYear.toLocaleString("en-US") : "Ask us"],
    [deal.allQualify ? "Without loyalty" : "Off MSRP", deal.allQualify ? money(deal.allQualify) : deal.discountPct ? `${deal.discountPct}%` : "—"],
    ["Updated", updated ? updated.replace(/, \d{4}$/, "") : "This month"],
  ];
  return (
    <div
      className="sticker big-sticker"
      style={tilt ? { transform: "rotate(1.2deg)", boxShadow: "0 30px 80px rgba(0,0,0,.5)" } : { boxShadow: "0 20px 60px rgba(0,0,0,.35)" }}
    >
      <StickerBand left="Clutch lease program" right={deal.tag} />
      {showImage && <VehicleImage src={deal.image} alt={deal.title} bodyStyle={deal.bodyStyle} priority />}
      <div className="sticker-body">
        <div>
          <div className="yr" style={{ fontSize: 13 }}>
            {deal.year} · {deal.make}
          </div>
          <H className="disp model" style={{ margin: 0 }}>
            {deal.model}
          </H>
          <div className="trim">{deal.trim || " "}</div>
        </div>
        <div className="price">
          <span className="disp">{money(deal.payment)}</span>
          <span className="stack" style={{ fontSize: 14, fontWeight: 600, paddingBottom: 4 }}>
            <span>/month</span>
            <span style={{ color: "var(--ink-mute)", fontWeight: 500 }}>{deal.paymentLabel}</span>
          </span>
        </div>
        <div className="spec">
          {cells.map(([k, v]) => (
            <div key={k}>
              <span>{k}</span>
              <span>{v}</span>
            </div>
          ))}
        </div>
        {cta && (
          <Link className="btn btn-ink btn-block" href={cta.href}>
            {cta.label}
          </Link>
        )}
        <p className="note" style={{ margin: 0, fontSize: 10.5, lineHeight: 1.5 }}>
          Sample payment on base MSRP. Excludes taxes, registration and plates. With approved credit.
        </p>
      </div>
    </div>
  );
}
