// Business details used across the site, schema markup and footer.
// Change them here once and every page updates.

export const SITE = {
  name: "Clutch Auto Deals",
  shortName: "Clutch",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.clutchautodeals.com",
  phone: "(480) 530-6890",
  phoneHref: "tel:+14805306890",
  smsHref: "sms:+14805306890",
  email: "info@clutchautodeals.com",
  instagram: "https://instagram.com/clutchautodeals",
  instagramHandle: "@clutchautodeals",
  address: {
    street: "3651 E Baseline Rd, Suite E222B",
    city: "Gilbert",
    region: "AZ",
    postalCode: "85234",
    country: "US",
  },
  description:
    "Clutch Auto Deals is an auto broker in Gilbert, Arizona. We source, negotiate and deliver new cars, lease or purchase, across Arizona and nationwide.",
};

// Google reviews. Leave rating null and reviews empty until filled in;
// the review sections stay hidden so nothing placeholder ever ships.
export const REVIEWS: {
  rating: number | null;
  count: number | null;
  googleUrl: string | null;
  items: { quote: string; name: string; car?: string }[];
} = {
  rating: null,
  count: null,
  googleUrl: null,
  items: [],
};

// Arizona city landing pages (local SEO).
export const CITIES: { slug: string; name: string; note: string }[] = [
  { slug: "phoenix", name: "Phoenix", note: "Delivery or dealer pickup anywhere in the Valley." },
  { slug: "scottsdale", name: "Scottsdale", note: "Luxury leasing without the showroom visit." },
  { slug: "gilbert", name: "Gilbert", note: "Our home base on Baseline Road." },
  { slug: "mesa", name: "Mesa", note: "Minutes from our Gilbert office." },
  { slug: "chandler", name: "Chandler", note: "East Valley pickup or delivery to your door." },
  { slug: "tempe", name: "Tempe", note: "From campus to Kyrene, we'll bring it to you." },
  { slug: "queen-creek", name: "Queen Creek", note: "Delivery to the far East Valley." },
  { slug: "tucson", name: "Tucson", note: "Shipped down I-10 or picked up in the Valley." },
];
