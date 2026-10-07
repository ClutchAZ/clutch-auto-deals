import Link from "next/link";
import { CITIES, SITE } from "@/lib/site";

export function Footer({ brands }: { brands: { title: string; slug: string }[] }) {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="stack" style={{ gap: 18 }}>
            <img src="/logo-light.svg" alt="Clutch Auto Deals" width={96} height={91} />
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: "var(--text-mute)", maxWidth: 320 }}>
              {SITE.description}
            </p>
            <address className="mono" style={{ fontStyle: "normal", fontSize: 13, lineHeight: 1.7, color: "var(--text-soft)" }}>
              {SITE.address.street}
              <br />
              {SITE.address.city}, {SITE.address.region} {SITE.address.postalCode}
              <br />
              <a href={SITE.phoneHref}>{SITE.phone}</a>
              <br />
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </address>
            <a href={SITE.instagram} style={{ fontWeight: 700 }}>
              Instagram {SITE.instagramHandle} ↗
            </a>
          </div>
          <nav aria-label="Lease deals by brand">
            <h2>Lease deals</h2>
            {brands.map((b) => (
              <Link key={b.slug} href={`/lease-deals/${b.slug}`}>
                {b.title} lease deals
              </Link>
            ))}
          </nav>
          <nav aria-label="Arizona">
            <h2>Arizona</h2>
            {CITIES.map((c) => (
              <Link key={c.slug} href={`/auto-broker/${c.slug}`}>
                {c.name} auto broker
              </Link>
            ))}
          </nav>
          <nav aria-label="Company">
            <h2>Company</h2>
            <Link href="/deals">All deals</Link>
            <Link href="/how-it-works">How we work</Link>
            <Link href="/deal-review">Free deal review</Link>
            <Link href="/sell-your-car">Sell your car</Link>
            <Link href="/about">About</Link>
            <Link href="/reviews">Reviews</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </nav>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Clutch Auto Deals · Gilbert, Arizona</span>
          <span className="mono" style={{ fontSize: 11.5, maxWidth: 720, lineHeight: 1.5 }}>
            Payments are samples on base MSRP and exclude taxes, registration and plates. Programs change monthly and
            require credit approval.
          </span>
        </div>
      </div>
    </footer>
  );
}
