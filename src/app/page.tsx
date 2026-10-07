import Link from "next/link";
import { getCatalog, pickFeatured } from "@/lib/deals";
import { REVIEWS, SITE } from "@/lib/site";
import { formatUpdated } from "@/lib/format";
import { DealCard } from "@/components/DealCard";
import { BigSticker } from "@/components/BigSticker";
import { HowWeWork, OnYourSide, QuoteSection, ReviewsBlock } from "@/components/Sections";

export const revalidate = 900;

export default async function Home() {
  const { deals, brands, updated } = await getCatalog();
  const featured = pickFeatured(deals, 5);
  const hero = featured[0];
  const row = featured.slice(1, 5);
  const updatedLabel = formatUpdated(updated);

  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="stack" style={{ gap: 28 }}>
            <span className="eyebrow">
              Arizona's auto broker · {brands.length} brands · Nationwide delivery
            </span>
            <h1 className="disp h1">
              Skip the dealer.
              <br />
              <span className="accent">Keep the deal.</span>
            </h1>
            <p className="lede">
              We source, negotiate and deliver your next new car, lease or purchase. You get the bottom line in writing
              and sign from home. No showroom, no finance-office games.
            </p>
            <div className="row" style={{ gap: 14 }}>
              <Link className="btn btn-orange" href="/deals">
                Browse this month's deals
              </Link>
              <Link className="btn btn-ghost" href="/deal-review">
                Get a free deal review
              </Link>
            </div>
            <div className="stack" style={{ gap: 12, marginTop: 8 }}>
              <span className="mono" style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-mute)" }}>
                Shop by monthly budget
              </span>
              <div className="row" style={{ gap: 10 }}>
                <Link className="pill" href="/deals?pay=u300">Under $300</Link>
                <Link className="pill" href="/deals?pay=300-500">$300–500</Link>
                <Link className="pill" href="/deals?pay=500-800">$500–800</Link>
                <Link className="pill" href="/deals?pay=800p">$800+</Link>
              </div>
            </div>
          </div>
          {hero && <BigSticker deal={hero} tilt cta={{ href: `/deals/${hero.slug}`, label: "See this deal" }} />}
        </div>
      </section>

      <section aria-label="At a glance" className="statbar">
        <div className="wrap grid-4">
          {REVIEWS.rating ? (
            <div className="stat">
              <span className="disp">★ {REVIEWS.rating}</span>
              <p>{REVIEWS.count} Google reviews</p>
            </div>
          ) : (
            <div className="stat">
              <span className="disp">1 person</span>
              <p>To text from quote to keys</p>
            </div>
          )}
          <div className="stat">
            <span className="disp">{deals.length}</span>
            <p>Live lease programs{updatedLabel ? `, updated ${updatedLabel.replace(/, \d{4}$/, "")}` : ""}</p>
          </div>
          <div className="stat">
            <span className="disp">{brands.length}</span>
            <p>Brands, from Honda to BMW M</p>
          </div>
          <div className="stat">
            <span className="disp">50 states</span>
            <p>Pickup in AZ or shipped to you</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap stack" style={{ gap: 44 }}>
          <div className="stack" style={{ gap: 14, maxWidth: 760 }}>
            <span className="eyebrow">Two ways in</span>
            <h2 className="disp h2">Wherever you are, start here.</h2>
          </div>
          <div className="grid-2">
            <div className="panel-bone stack" style={{ gap: 20 }}>
              <span className="mono" style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-mute)" }}>
                Need a deal?
              </span>
              <h3 className="disp" style={{ margin: 0, fontSize: 34, lineHeight: 1.02 }}>We'll go get it.</h3>
              <p>
                Tell us the car. We source it across our dealer network, structure the lease or finance numbers and hand
                you a written quote. Don't see it on our list? We source any make or model.
              </p>
              <div className="row" style={{ gap: 12, marginTop: "auto" }}>
                <Link className="btn btn-ink" href="/contact">Get a quote</Link>
                <Link className="btn btn-outline-ink" href="/deals">See current deals</Link>
              </div>
            </div>
            <div className="panel-orange stack" style={{ gap: 20 }}>
              <span className="eyebrow">Already have a quote?</span>
              <h3 className="disp" style={{ margin: 0, fontSize: 34, lineHeight: 1.02 }}>Free review. If we can beat it, we will.</h3>
              <p>
                Send us the dealer's numbers. We check money factor, residual, rebates and add-ons line by line and flag
                any markup. No credit pull, no obligation.
              </p>
              <div className="row" style={{ gap: 12, marginTop: "auto" }}>
                <Link className="btn btn-ink" href="/deal-review">Send my quote</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {row.length > 0 && (
        <section aria-labelledby="sharpest" style={{ paddingBottom: 104 }}>
          <div className="wrap stack" style={{ gap: 36 }}>
            <div className="row between" style={{ gap: 20, alignItems: "flex-end" }}>
              <div className="stack" style={{ gap: 14 }}>
                <span className="eyebrow">This month's programs · updated monthly</span>
                <h2 id="sharpest" className="disp h2">This month's sharpest.</h2>
              </div>
              <Link className="link-underline" href="/deals">
                View all {deals.length} deals →
              </Link>
            </div>
            <div className="grid-4">
              {row.map((d) => (
                <DealCard key={d.id} deal={d} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section aria-labelledby="by-brand" style={{ paddingBottom: 104 }}>
        <div className="wrap stack" style={{ gap: 28 }}>
          <h2 id="by-brand" className="disp" style={{ margin: 0, fontSize: 28 }}>Lease deals by brand</h2>
          <div className="brands-grid">
            {brands.map((b) => (
              <Link key={b.slug} href={`/lease-deals/${b.slug}`}>
                <strong>{b.title}</strong>
                <span>{b.count} programs</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <HowWeWork />
      <OnYourSide />
      <ReviewsBlock />

      <section aria-labelledby="ig" className="section">
        <div className="wrap">
          <div className="panel row between" style={{ gap: 32, borderColor: "var(--orange)", borderWidth: 2 }}>
            <div className="stack" style={{ gap: 14, maxWidth: 640 }}>
              <span className="eyebrow">{SITE.instagramHandle}</span>
              <h2 id="ig" className="disp h3">New deals hit Instagram first.</h2>
              <p>Every program we post links straight back to its page here, so you can lock it in from your phone.</p>
            </div>
            <div className="row" style={{ gap: 12 }}>
              <a className="btn btn-orange" href={SITE.instagram}>Follow on Instagram</a>
              <Link className="btn btn-ghost" href="/sell-your-car">Sell your car</Link>
            </div>
          </div>
        </div>
      </section>

      <QuoteSection />
    </>
  );
}
