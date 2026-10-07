// Shapes of the three Wix collections the site reads.

export type RawDeal = {
  id: string;
  dealNumber: string | null;
  year: number;
  make: string;
  model: string;
  trim: string | null;
  msrp: number | null;
  discountPct: number | null;
  monthlyLoyalty: number | null;
  monthlyAllQualify: number | null;
  dueAtSigning: number | null;
  termMonths: number | null;
  milesPerYear: number | null;
  badges: string[];
  featured: boolean;
  photo: string | null;
  finePrint: string | null;
  lastUpdated: string | null;
};

export type Brand = {
  title: string;
  slug: string;
  active: boolean;
  sortOrder: number | null;
  programMonth: string | null;
  programRegion: string | null;
  defaultDueAtSigning: number | null;
  defaultMilesPerYear: number | null;
  defaultTermMonths: number | null;
  requirements: string | null;
  finePrint: string | null;
  headline: string | null;
  intro: string | null;
  heroImage: string | null;
};

export type VehicleImage = {
  make: string;
  model: string;
  trim: string | null;
  modelYear: number | null;
  aliases: string[] | null;
  image: string | null;
  imaginModelFamily: string | null;
  imaginModelRange: string | null;
  imaginModelVariant: string | null;
  paintDescription: string | null;
};

export type BodyStyle = "suv" | "sedan" | "coupe" | "truck" | "van";

// A deal after brand defaults and the image library have been applied.
export type Deal = {
  id: string;
  slug: string;
  dealNumber: string | null;
  year: number;
  make: string;
  makeSlug: string;
  model: string;
  trim: string | null;
  title: string;
  msrp: number | null;
  discountPct: number | null;
  payment: number; // the headline payment (loyalty/conquest price when offered)
  paymentLabel: string; // e.g. "with loyalty"
  allQualify: number | null; // price everyone qualifies for, when different
  dueAtSigning: number | null; // null = first month + fees
  termMonths: number | null;
  milesPerYear: number | null;
  badges: string[];
  tag: string; // the one badge shown on the sticker strip
  featured: boolean;
  image: string | null;
  bodyStyle: BodyStyle;
  finePrint: string;
  requirements: string | null;
  programMonth: string | null;
  lastUpdated: string | null;
};
