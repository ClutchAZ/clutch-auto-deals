"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";

const NAV = [
  { href: "/deals", label: "Deals" },
  { href: "/how-it-works", label: "How we work" },
  { href: "/deal-review", label: "Free deal review" },
  { href: "/sell-your-car", label: "Sell your car" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);
  return (
    <>
      <div className="topbar">
        <div className="wrap">
          <span className="mono">Auto broker · Gilbert, Arizona · Delivering nationwide</span>
          <span className="links">
            <a href={SITE.phoneHref}>{SITE.phone}</a>
            <a href={SITE.smsHref}>Text us</a>
          </span>
        </div>
      </div>
      <header className="header">
        <div className="wrap">
          <Link href="/" className="brandmark" aria-label="Clutch Auto Deals home">
            <img src="/logo-light.svg" alt="" width={54} height={51} />
            <span className="word">
              <span className="disp">Clutch</span>
              <span className="mono">AUTO DEALS</span>
            </span>
          </Link>
          <nav className="nav" aria-label="Main">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} aria-current={path.startsWith(n.href) ? "page" : undefined}>
                {n.label}
              </Link>
            ))}
          </nav>
          <Link className="btn btn-orange" href="/contact">
            Get a quote
          </Link>
          <button
            className="menu-btn"
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 7h18M3 12h18M3 17h18" />}
            </svg>
          </button>
        </div>
        <nav id="mobile-nav" className="mobile-nav" data-open={open} aria-label="Mobile">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}>
              {n.label}
            </Link>
          ))}
          <Link className="btn btn-orange" href="/contact">
            Get a quote
          </Link>
        </nav>
      </header>
    </>
  );
}
