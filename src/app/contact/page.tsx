import type { Metadata } from "next";
import { QuoteSection } from "@/components/Sections";

export const metadata: Metadata = {
  title: "Get a Quote · Contact",
  description: "Get a quote from Clutch Auto Deals. Call or text (480) 530-6890, or send the car you want and a broker will reply with real numbers.",
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  return <QuoteSection eyebrow="Get a quote · Contact" title="Tell us the car. We'll handle the rest." />;
}
