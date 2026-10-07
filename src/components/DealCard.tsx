import Link from "next/link";
import type { Deal } from "@/lib/types";
import { money } from "@/lib/format";
import { VehicleImage } from "./VehicleImage";

export function StickerBand({ left, right }: { left: string; right: string }) {
  return (
    <div className="sticker-band">
      <span className="who">
        <img src="/logo-dark.svg" alt="" width={22} height={21} />
        <span className="mono">{left}</span>
      </span>
      <span className="mono">{right}</span>
    </div>
  );
}

export function DealCard({ deal, showImage = true }: { deal: Deal; showImage?: boolean }) {
  return (
    <article className="sticker">
      <Link href={`/deals/${deal.slug}`} className="card-link" aria-label={`${deal.title}, ${money(deal.payment)} a month`}>
        <StickerBand left={deal.make} right={deal.tag} />
        {showImage && <VehicleImage src={deal.image} alt={deal.title} bodyStyle={deal.bodyStyle} />}
        <div className="sticker-body">
          <div>
            <div className="yr">{deal.year}</div>
            <h3 className="disp model">{deal.model}</h3>
            <div className="trim">{deal.trim || " "}</div>
          </div>
          <div>
            <div className="price">
              <span className="disp">{money(deal.payment)}</span>
              <small>/mo</small>
            </div>
            <div className="note">{deal.allQualify ? `${money(deal.allQualify)}/mo without` : deal.paymentLabel}</div>
          </div>
          <div className="spec">
            <div>
              <span>Term</span>
              <span>{deal.termMonths ? `${deal.termMonths} mo` : "Ask us"}</span>
            </div>
            <div>
              <span>Due at signing</span>
              <span>{deal.dueAtSigning ? money(deal.dueAtSigning) : "1st mo + fees"}</span>
            </div>
            <div>
              <span>MSRP</span>
              <span>{money(deal.msrp)}</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
