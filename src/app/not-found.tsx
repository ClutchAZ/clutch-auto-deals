import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="wrap stack" style={{ gap: 20, alignItems: "flex-start" }}>
        <span className="eyebrow">404</span>
        <h1 className="disp h2">That deal's gone.</h1>
        <p className="lede">Programs change every month, so this page may have expired. Here's what's live right now.</p>
        <Link className="btn btn-orange" href="/deals">See this month's deals</Link>
      </div>
    </section>
  );
}
