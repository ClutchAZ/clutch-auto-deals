import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd, localBusinessLd } from "@/components/Sections";
import { getCatalog } from "@/lib/deals";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Clutch Auto Deals | Auto Broker in Gilbert & Phoenix, AZ",
    template: "%s | Clutch Auto Deals",
  },
  description:
    "Clutch Auto Deals is an Arizona auto broker. Pre-negotiated lease and finance deals on BMW, Mercedes-Benz, Lexus, Genesis and more, delivered in Arizona and nationwide.",
  openGraph: { type: "website", siteName: SITE.name, locale: "en_US" },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { themeColor: "#0c0d0e", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { brands } = await getCatalog();
  return (
    <html lang="en">
      <body>
        <a href="#main" className="sr-only">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer brands={brands.map((b) => ({ title: b.title, slug: b.slug }))} />
        <JsonLd data={localBusinessLd()} />
      </body>
    </html>
  );
}
