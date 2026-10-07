import type { MetadataRoute } from "next";
import { getCatalog } from "@/lib/deals";
import { CITIES, SITE } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { deals, brands } = await getCatalog();
  const now = new Date();
  const page = (path: string, priority: number, freq: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly") => ({
    url: `${SITE.url}${path}`,
    lastModified: now,
    changeFrequency: freq,
    priority,
  });
  return [
    page("/", 1, "weekly"),
    page("/deals", 0.9, "weekly"),
    ...brands.map((b) => page(`/lease-deals/${b.slug}`, 0.8, "weekly")),
    ...CITIES.map((c) => page(`/auto-broker/${c.slug}`, 0.7)),
    page("/how-it-works", 0.6),
    page("/deal-review", 0.7),
    page("/sell-your-car", 0.6),
    page("/about", 0.5),
    page("/reviews", 0.5),
    page("/contact", 0.6),
    ...deals.map((d) => page(`/deals/${d.slug}`, 0.5, "weekly")),
  ];
}
