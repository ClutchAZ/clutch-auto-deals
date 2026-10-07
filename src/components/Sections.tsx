import Link from "next/link";
import { REVIEWS, SITE } from "@/lib/site";
import { QuoteForm } from "./QuoteForm";

export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function HowWeWork() {
  const steps = [
    { n: "01", t: "Text or call us", d: "Tell us what you're after, or pick one off our deals page. Not listed? We'll go find it." },
    { n: "02", t: "Get real numbers", d: "Payment, due at signing, term, miles and fees, in writing. What we quote is what you sign." },
    { n: "03", t: "Sign from home", d: "Credit app, license and insurance, all from your phone. No showroom, no finance office." },
    { n: "04", t: "Pick it up or we bring it", d: "Grab it at the dealer here in the Valley, or we ship it to your driveway anywhere in the country." },
  ];
  return (
    <section id="how" className="section light">
      <div className="wrap stack" style={{ gap: 52 }}>
        <div className="stack" style={{ gap: 14, maxWidth: 760 }}>
          <span className="eyebrow">How we work</span>
          <h2 className="disp h2">Tell us the car. We take it from there.</h2>
        </div>
        <ol className="grid-4 steps" style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {steps.map((s) => (
            <li className="step" key={s.n}>
              <span className="num">{s.n}</span>
              <h3 className="disp">{s.t}</h3>
              <p>{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function OnYourSide() {
  return (
    <section aria-labelledby="side" className="light" style={{ padding: "0 0 104px" }}>
      <div className="wrap grid-2" style={{ gap: 56, alignItems: "center", borderTop: "2px solid var(--ink)", paddingTop: 72 }}>
        <h2 id="side" className="disp h3" style={{ fontSize: "clamp(30px, 3.6vw, 50px)", lineHeight: 1 }}>
          We're on your side of the table.
        </h2>
        <div className="stack" style={{ gap: 20 }}>
          <p style={{ margin: 0, fontSize: 19, lineHeight: 1.65, color: "#2a2824" }}>
            The dealer works for the dealer. We work for you. We're a small team in Gilbert that does this every day. We
            know what the banks and manufacturers are offering this month, which stores will actually hit the number,
            and which add-ons to strike before you sign.
          </p>
          <p style={{ margin: 0, fontSize: 19, lineHeight: 1.65, color: "#2a2824" }}>
            You get one person to text from first question to keys in hand.
          </p>
          <div className="row" style={{ gap: 12 }}>
            <a className="btn btn-ink" href={SITE.smsHref}>
              Text us {SITE.phone}
            </a>
            <Link className="btn btn-outline-ink" href="/contact">
              Get a quote
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ReviewsBlock() {
  if (!REVIEWS.items.length) return null;
  return (
    <section id="reviews" className="section">
      <div className="wrap stack" style={{ gap: 40 }}>
        <div className="row between" style={{ gap: 20, alignItems: "flex-end" }}>
          <div className="stack" style={{ gap: 14 }}>
            {REVIEWS.rating && (
              <span className="eyebrow">
                Google reviews · ★ {REVIEWS.rating} from {REVIEWS.count}
              </span>
            )}
            <h2 className="disp h2">Don't take our word for it.</h2>
          </div>
          {REVIEWS.googleUrl && (
            <a className="link-underline" href={REVIEWS.googleUrl}>
              Read all on Google →
            </a>
          )}
        </div>
        <div className="grid-3">
          {REVIEWS.items.map((r) => (
            <figure key={r.name + r.quote.slice(0, 10)} className="panel stack" style={{ margin: 0, gap: 20, padding: 32 }}>
              <span aria-label="5 stars" style={{ color: "var(--orange)", fontSize: 18, letterSpacing: 3 }}>
                ★★★★★
              </span>
              <blockquote style={{ margin: 0, fontSize: 18, lineHeight: 1.6, color: "#e4dfd5" }}>{r.quote}</blockquote>
              <figcaption className="stack" style={{ marginTop: "auto", gap: 2 }}>
                <span style={{ fontWeight: 700 }}>{r.name}</span>
                {r.car && <span className="mono" style={{ fontSize: 12, color: "var(--text-mute)" }}>{r.car}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function QuoteSection({
  title = "Tell us the car. We'll handle the rest.",
  eyebrow = "Get a quote",
  vehicle,
  dealReference,
  defaultType,
}: {
  title?: string;
  eyebrow?: string;
  vehicle?: string;
  dealReference?: string;
  defaultType?: React.ComponentProps<typeof QuoteForm>["defaultType"];
}) {
  return (
    <section id="quote" className="section light">
      <div className="wrap grid-2" style={{ gap: 64, alignItems: "start" }}>
        <div className="stack" style={{ gap: 22 }}>
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="disp h2">{title}</h2>
          <p className="lede">
            A Clutch broker replies with real numbers, usually the same business day. Based in Gilbert, Arizona, and
            delivering to all 50 states.
          </p>
          <div className="mono stack" style={{ gap: 10, fontSize: 15, borderTop: "2px solid var(--ink)", paddingTop: 22, marginTop: 8 }}>
            <span>
              {SITE.address.street}
              <br />
              {SITE.address.city}, {SITE.address.region} {SITE.address.postalCode}
            </span>
            <a href={SITE.phoneHref}>{SITE.phone}</a>
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </div>
        </div>
        <QuoteForm vehicle={vehicle} dealReference={dealReference} defaultType={defaultType} />
      </div>
    </section>
  );
}

export function PageHead({ eyebrow, title, lede, children }: { eyebrow: string; title: string; lede?: string; children?: React.ReactNode }) {
  return (
    <section style={{ padding: "64px 0 40px" }}>
      <div className="wrap row between" style={{ gap: 24, alignItems: "flex-end" }}>
        <div className="stack" style={{ gap: 14, maxWidth: 780 }}>
          <span className="eyebrow">{eyebrow}</span>
          <h1 className="disp" style={{ margin: 0, fontSize: "clamp(38px, 5vw, 72px)", lineHeight: 0.95 }}>
            {title}
          </h1>
          {lede && <p className="lede" style={{ fontSize: 18 }}>{lede}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

export const localBusinessLd = () => ({
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  "@id": `${SITE.url}/#business`,
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/logo-dark.svg`,
  image: `${SITE.url}/logo-dark.svg`,
  telephone: "+1-480-530-6890",
  email: SITE.email,
  description: SITE.description,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.city,
    addressRegion: SITE.address.region,
    postalCode: SITE.address.postalCode,
    addressCountry: SITE.address.country,
  },
  areaServed: [{ "@type": "State", name: "Arizona" }, { "@type": "Country", name: "United States" }],
  sameAs: [SITE.instagram],
  ...(REVIEWS.rating && REVIEWS.count
    ? { aggregateRating: { "@type": "AggregateRating", ratingValue: REVIEWS.rating, reviewCount: REVIEWS.count } }
    : {}),
});
